---
id: risingwave-kubernetes
title: Set up a RisingWave cluster in Kubernetes
description: Deploy RisingWave in a Kubernetes cluster with the Kubernetes Operator for RisingWave.
slug: /risingwave-kubernetes
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/risingwave-kubernetes/" />
</head>

This article will help you use the [Kubernetes Operator for RisingWave](https://github.com/risingwavelabs/risingwave-operator) (hereinafter ‘the Operator’) to deploy a RisingWave cluster in Kubernetes.

The Operator is a deployment and management system for RisingWave. It runs on top of Kubernetes and provides functionalities like provisioning, upgrading, scaling, and destroying the RisingWave instances inside the cluster.

## Prerequisites

* **[Install `kubectl`](http://pwittrock.github.io/docs/tasks/tools/install-kubectl/)**

    Ensure that the Kubernetes command-line tool [`kubectl`](https://kubernetes.io/docs/reference/kubectl/) is installed in your environment.

* **[Install `psql`](/guides/install-psql-without-full-postgres.md)**

    Ensure that the PostgreSQL interactive terminal [`psql`](https://www.postgresql.org/docs/current/app-psql.html) is installed in your environment.

* **[Install and run Docker](https://docs.docker.com/get-docker/)**

    Ensure that [Docker](https://docs.docker.com/desktop/) is installed in your environment and running.

* Ensure you allocate enough resources for the deployment, and use the recommended disks for etcd. For details, see [Hardware requirements](/deploy/hardware-requirements.md).

## Create a Kubernetes cluster

:::info
The steps in this section are intended for creating a Kubernetes cluster in your local environment.<br/>If you are using a managed Kubernetes service such as AKS, GKE, and EKS, refer to the corresponding documentation for instructions.
:::

**Steps:**

1. [Install `kind`](https://kind.sigs.k8s.io/docs/user/quick-start#installation).

    [`kind`](https://kind.sigs.k8s.io/) is a tool for running local Kubernetes clusters using Docker containers as cluster nodes. You can see the available tags of `kind` on [Docker Hub](https://hub.docker.com/r/kindest/node/tags).

1. Create a cluster.

    ```shell
    kind create cluster
    ```

1. ***Optional:*** Check if the cluster is created properly.

    ```shell
    kubectl cluster-info
    ```

## Deploy the Operator

Before the deployment, ensure that the following requirements are satisfied.

* Docker version ≥ 18.09
* `kubectl` version ≥ 1.18
* For Linux, set the value of the `sysctl` parameter [`net.ipv4.ip_forward`](https://linuxconfig.org/how-to-turn-on-off-ip-forwarding-in-linux) to 1.

**Steps:**

1. [Install `cert-manager`](https://cert-manager.io/docs/installation/) and wait a minute to allow for initialization.

1. Install the latest version of the Operator.

    ```shell
    kubectl apply --server-side -f https://github.com/risingwavelabs/risingwave-operator/releases/latest/download/risingwave-operator.yaml
    ```

    <details>
    <summary>If you'd like to install a certain version of the Operator</summary>

    Run the following command to install a specific version instead of the latest version.

    ```shell
    # Replace ${VERSION} with the version you want to install, e.g., v1.3.0
    kubectl apply --server-side -f https://github.com/risingwavelabs/risingwave-operator/releases/download/${VERSION}/risingwave-operator.yaml
    ```

    **Compatibility table**

    | Operator | RisingWave | Kubernetes |
    |----------|------------|------------|
    | v0.4.0   | v0.18.0+   | v1.21+     |
    | v0.3.6   | v0.18.0+   | v1.21+     |

    You can find the release notes of each version [here](https://github.com/risingwavelabs/risingwave-operator/releases).

    </details>

    :::note
    The following errors might occur if `cert-manager` is not fully initialized. Simply wait for another minute and rerun the command above.

    > Error from server (InternalError): Internal error occurred: failed calling webhook "webhook.cert-manager.io": failed to call webhook: Post "<https://cert-manager-webhook.cert-manager.svc:443/mutate?timeout=10s>": dial tcp 10.105.102.32:443: connect: connection refused

    > Error from server (InternalError): Internal error occurred: failed calling webhook "webhook.cert-manager.io": failed to call webhook: Post "<https://cert-manager-webhook.cert-manager.svc:443/mutate?timeout=10s>": dial tcp 10.105.102.32:443: connect: connection refused
    :::

1. ***Optional:*** Check if the Pods are running.

    ```shell
    kubectl -n cert-manager get pods
    kubectl -n risingwave-operator-system get pods
    ```

## Deploy a RisingWave instance

RisingWave Kubernetes Operator extends the Kubernetes with CRDs (Custom Resource Definitions) to manage RisingWave. That means all you need to do is to create a RisingWave resource in your Kubernetes cluster, and the RisingWave Kubernetes Operator will take care of the rest.

### Use the example resource files

The RisingWave resource is a custom resource that defines a RisingWave cluster. In [this directory](https://github.com/risingwavelabs/risingwave-operator/blob/main/docs/manifests/risingwave), you can find resource examples that deploy RisingWave with different configurations of metadata store and state backend. Based on your requirements, you can use these resource files directly or as a reference for your customization. The [stable directory](https://github.com/risingwavelabs/risingwave-operator/tree/main/docs/manifests/stable/) contains resource files that we have tested compatibility with the latest released version of the RisingWave Operator:

The resource files are named using the convention of "risingwave-<meta_store>-<state_backend>.yaml". For example, `risingwave-etcd-s3.yaml` means that this manifest file uses etcd as the meta storage and AWS S3 as the state backend. The resource files whose names do not contain `etcd` means that they use memory as the meta store, which does not persist meta node data and therefore has a risk of losing data. Note that for production deployments, you should use etcd as the metadata store. Therefore, please use a resource file that contains `etcd` in its name or choose a file that is in the `/stable/` directory.

RisingWave supports using these systems or services as state backends.

* MinIO
* AWS S3
* S3-compatible object storages
* Google Cloud Storage
* Azure Blob Storage

You can [customize etcd as a separate cluster](#optional-customize-the-etcd-deployment), [customize the state backend](#optional-customize-the-state-backend), or [customize the state store directory](#optional-customize-the-state-store-directory).

### Optional: Customize the etcd deployment

RisingWave uses etcd for persisting data for meta nodes. It's important to note that etcd is highly sensitive to disk write latency. Slow disk performance can lead to increased etcd request latency and potentially impact the stability of the cluster. When planning your RisingWave deployment, follow the [etcd disk recommendations](/deploy/hardware-requirements.md#etcd).

We recommend using the [bitnami/etcd](https://github.com/bitnami/charts/blob/main/bitnami/etcd/README.md) Helm chart to deploy the etcd. Please save the following configuration as `etcd-values.yaml`.

```yaml
service:
  ports:
    client: 2379
  peer: 2380

replicaCount: 3

resources:
  limits:
    cpu: 1
    memory: 2Gi
  requests:
    cpu: 1
    memory: 2Gi

persistence:
  # storageClass: default
  size: 10Gi
  accessModes: [ "ReadWriteOnce" ]

auth:
  rbac:
    create: false
    allowNoneAuthentication: true

extraEnvVars:
- name:  "ETCD_MAX_REQUEST_BYTES"
  value: "104857600"
- name:  "MAX_QUOTA_BACKEND_BYTES"
  value: "8589934592"
- name:  "ETCD_AUTO_COMPACTION_MODE"
  value: "periodic"
- name:  "ETCD_AUTO_COMPACTION_RETENTION"
  value: "1m"
- name:  "ETCD_SNAPSHOT_COUNT"
  value: "10000"
- name:  "ETCD_MAX_TXN_OPS"
  value: "999999"
```

If you would like to specify the storage class of the persistent volume, uncomment the `# storageClass: default` and specify the right value.

Then, run the following command to deploy the etcd cluster:

```bash
helm install -f etcd-values.yaml etcd bitnami/etcd
```

### Optional: Customize the state backend

If you intend to customize a resource file, download the file to a local path and edit it:

```curl
curl https://raw.githubusercontent.com/risingwavelabs/risingwave-operator/main/docs/manifests/<sub-directory> -o risingwave.yaml
```

You can also create your own resource file from scratch if you are familiar with Kubernetes resource files.

Then, apply the resource file by using the following command:

 ```shell
kubectl apply -f a.yaml      # relative path
kubectl apply -f /tmp/a.yaml # absolute path
```

To customize the state backend of your RisingWave cluster, edit the `spec:stateStore` section under the RisingWave resource (`kind: RisingWave`).

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="state_backend_options">
<TabItem value="AWS S3" label="AWS S3">

```yaml
spec:
  stateStore:
    # Prefix to objects in the object stores or directory in file system. Default to "hummock".
    dataDirectory: hummock
    
    # Declaration of the S3 state store backend.
    s3:
      # Region of the S3 bucket.
      region: us-east-1
      
      # Name of the S3 bucket.
      bucket: risingwave
      
      # Credentials to access the S3 bucket.
      credentials:
        # Name of the Kubernetes secret that stores the credentials.
        secretName: s3-credentials
        
        # Key of the access key ID in the secret.
        accessKeyRef: AWS_ACCESS_KEY_ID
        
        # Key of the secret access key in the secret.
        secretAccessKeyRef: AWS_SECRET_ACCESS_KEY
        
        # Optional, set it to true when the credentials can be retrieved 
        # with the service account token, e.g., running inside the EKS.
        # 
        # useServiceAccount: true 
```

</TabItem>
<TabItem value="minio" label="MinIO">

:::note
The performance of MinIO is closely tied to the disk performance of the node where it is hosted. We have observed that AWS EBS does not perform well in our tests. For optimal performance, we recommend using S3 or a compatible cloud service.
:::

```yaml
spec:
  stateStore:
    # Prefix to objects in the object stores or directory in file system. Default to "hummock".
    dataDirectory: hummock
    
    # Declaration of the MinIO state store backend.
    minio:
      # Endpoint of the MinIO service.
      endpoint: risingwave-minio:9301
      
      # Name of the MinIO bucket.
      bucket: hummock001
      
      # Credentials to access the MinIO bucket.
      credentials:
        # Name of the Kubernetes secret that stores the credentials.
        secretName: minio-credentials
        
        # Key of the username ID in the secret.
        usernameKeyRef: username
        
        # Key of the password key in the secret.
        passwordKeyRef: password 
```

</TabItem>
<TabItem value="s3-compatible" label="S3-compatible">

```yaml
spec:
  stateStore:
    # Prefix to objects in the object stores or directory in file system. Default to "hummock".
    dataDirectory: hummock
    
    # Declaration of the S3 compatible state store backend.
    s3:
      # Endpoint of the S3 compatible object storage. Two variables are supported:
      # - ${BUCKET}: name of the S3 bucket.
      # - ${REGION}: name of the region.
      endpoint: ${BUCKET}.cos.${REGION}.myqcloud.com
      
      # Region of the S3 compatible bucket.
      region: ap-guangzhou
      
      # Name of the S3 compatible bucket.
      bucket: risingwave
      
      # Credentials to access the S3 compatible bucket.
      credentials:
        # Name of the Kubernetes secret that stores the credentials.
        secretName: cos-credentials
        
        # Key of the access key ID in the secret.
        accessKeyRef: ACCESS_KEY_ID
        
        # Key of the secret access key in the secret.
        secretAccessKeyRef: SECRET_ACCESS_KEY
```

</TabItem>

<TabItem value="azure-blob" label="Azure Blob Storage">

```yaml
spec:
  stateStore:
    # Prefix to objects in the object stores or directory in file system. Default to "hummock".
    dataDirectory: hummock
    
    # Declaration of the Google Cloud Storage state store backend.
    azureBlob:
      # Endpoint of the Azure Blob service.
      endpoint: https://you-blob-service.blob.core.windows.net
      
      # Working directory root of the Azure Blob service.
      root: risingwave
      
      # Container name of the Azure Blob service.
      container: risingwave
    
      # Credentials to access the Google Cloud Storage bucket.
      credentials:
        # Name of the Kubernetes secret that stores the credentials.
        secretName: gcs-credentials
        
        # Key of the account name in the secret.
        accountNameRef: AccountName
        
        # Key of the account name in the secret.
        accountKeyRef: AccountKey
```

</TabItem>

<TabItem value="google-cloud-storage" label="Google Cloud Storage">

```yaml
spec:
  stateStore:
    # Prefix to objects in the object stores or directory in file system. Default to "hummock".
    dataDirectory: hummock
    
    # Declaration of the Google Cloud Storage state store backend.
    gcs:
      # Name of the Google Cloud Storage bucket.
      bucket: risingwave
      
      # Root directory of the Google Cloud Storage bucket.
      root: risingwave
    
      # Credentials to access the Google Cloud Storage bucket.
      credentials:
        # Name of the Kubernetes secret that stores the credentials.
        secretName: gcs-credentials
        
        # Key of the service account credentials in the secret.
        serviceAccountCredentialsKeyRef: ServiceAccountCredentials
        
        # Optional, set it to true when the credentials can be retrieved.
        # useWorkloadIdentity: true
```

</TabItem>

</Tabs>

### Optional: Customize the state store directory

You can customize the directory for storing state data via the `spec: stateStore: dataDirectory` parameter in the `risingwave.yaml` file that you want to use to deploy a RisingWave instance. If you have multiple RisingWave instances, ensure the value of `dataDirectory` for the new instance is unique (the default value is `hummock`). Otherwise, the new RisingWave instance may crash. Save the changes to the `risingwave.yaml` file before running the `kubectl apply -f <...risingwave.yaml>` command. The directory path cannot be an absolute address, such as `/a/b`, and must be no longer than 180 characters.

### Validate the status of the instance

You can check the status of the RisingWave instance by running the following command.

```shell
kubectl get risingwave
```

If the instance is running properly, the output should look like this:

```shell
NAME        RUNNING   STORAGE(META)   STORAGE(OBJECT)   AGE
risingwave  True      etcd            S3                30s
```

## Connect to RisingWave

<Tabs>
<TabItem value="clusterip" label="ClusterIP">

By default, the Operator creates a service for the frontend component, through which you can interact with RisingWave, with the type of `ClusterIP`. But it is not accessible outside Kubernetes. Therefore, you need to create a standalone Pod for PostgreSQL inside Kubernetes.

**Steps:**

1. Create a Pod.

    ```shell
    kubectl apply -f https://raw.githubusercontent.com/risingwavelabs/risingwave-operator/main/docs/manifests/psql/psql-console.yaml
    ```

1. Attach to the Pod so that you can execute commands inside the container.

    ```shell
    kubectl exec -it psql-console -- bash
    ```

1. Connect to RisingWave via `psql`.

    ```shell
    psql -h risingwave-frontend -p 4567 -d dev -U root
    ```

</TabItem>
<TabItem value="nodeport" label="NodePort" >

You can connect to RisingWave from Nodes such as EC2 in Kubernetes

**Steps:**

1. In the `risingwave.yaml` file that you use to deploy the RisingWave instance, add a `frontendServiceType` parameter to the configuration of the RisingWave service, and set its value to `NodePort`.

    ```yaml
    # ...
    kind: RisingWave
    ...
    spec:
      frontendServiceType: NodePort
    # ...
    ```

1. Connect to RisingWave by running the following commands on the Node.

    ```shell
    export RISINGWAVE_NAME=risingwave-etcd-hdfs
    export RISINGWAVE_NAMESPACE=default
    export RISINGWAVE_HOST=`kubectl -n ${RISINGWAVE_NAMESPACE} get node -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}'`
    export RISINGWAVE_PORT=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].spec.ports[0].nodePort}'`

    psql -h ${RISINGWAVE_HOST} -p ${RISINGWAVE_PORT} -d dev -U root
    ```

</TabItem>
<TabItem value="loadbalancer" label="LoadBalancer">

If you are using EKS, GCP, or other managed Kubernetes services provided by cloud vendors, you can expose the Service to the public network with a load balancer in the cloud.

**Steps:**

1. In the `risingwave.yaml` file that you use to deploy the RisingWave instance, add a `frontendServiceType` parameter to the configuration of the RisingWave service, and set its value to `LoadBalancer`.

    ```yaml
    # ...
    kind: RisingWave
    ...
    spec:
      frontendServiceType: LoadBalancer
    # ...
    ```

2. Connect to RisingWave with the following commands.

    ```shell
    export RISINGWAVE_NAME=risingwave-etcd-hdfs
    export RISINGWAVE_NAMESPACE=default
    export RISINGWAVE_HOST=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'`
    export RISINGWAVE_PORT=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].spec.ports[0].port}'`

    psql -h ${RISINGWAVE_HOST} -p ${RISINGWAVE_PORT} -d dev -U root
    ```

</TabItem>
</Tabs>

<br />

Now you can ingest and transform streaming data. See [Quick start](/get-started.md) for details.
