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
    # Replace ${VERSION} with the version you want to install, e.g., v0.4.0
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

    > Error from server (InternalError): Internal error occurred: failed calling webhook "webhook.cert-manager.io": failed to call webhook: Post "https://cert-manager-webhook.cert-manager.svc:443/mutate?timeout=10s": dial tcp 10.105.102.32:443: connect: connection refused

    > Error from server (InternalError): Internal error occurred: failed calling webhook "webhook.cert-manager.io": failed to call webhook: Post "https://cert-manager-webhook.cert-manager.svc:443/mutate?timeout=10s": dial tcp 10.105.102.32:443: connect: connection refused
    :::

1. ***Optional:*** Check if the Pods are running.

    ```shell
    kubectl -n cert-manager get pods
    kubectl -n risingwave-operator-system get pods
    ```


## Deploy a RisingWave instance

Select an object storage service for data persistence.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="storage_selection">
<TabItem value="minio" label="etcd+MinIO">

RisingWave supports using MinIO as the object storage.

Run the following command to deploy a RisingWave instance with MinIO as the object storage.

```shell
kubectl apply -f https://raw.githubusercontent.com/risingwavelabs/risingwave-operator/main/docs/manifests/stable/persistent/minio/risingwave.yaml
```

</TabItem>
<TabItem value="s3" label="etcd+S3">

RisingWave supports using Amazon S3 as the object storage.

**Steps:**

1. Create a Secret with the name `s3-credentials`.

    ```shell
    kubectl create secret generic s3-credentials --from-literal AccessKeyID=${ACCESS_KEY} --from-literal SecretAccessKey=${SECRET_ACCESS_KEY}
    ```

1. On the S3 console, [create a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html) with the name `risingwave` in the US East (N. Virginia) (`us-east-1`) region.

1. Deploy a RisingWave instance with S3 as the object storage.

    ```shell
    kubectl apply -f https://raw.githubusercontent.com/risingwavelabs/risingwave-operator/main/docs/manifests/stable/persistent/s3/risingwave.yaml
    ```
    <details>
    <summary>Click here if you wish to customize the name and region of the S3 bucket</summary>

    Before executing the above command, customize the S3 bucket according to your specific requirements by following these steps.

    1. Download the manifest file from the link above.

    1. Open the downloaded file and modify the necessary fields, such as the bucket name and region according to your preferences.

    1. Save the modified file to your local file system.

    1. Replace the URL in the command with the local file path of the modified manifest file and then run the command. For example:

        ```shell
        kubectl apply -f a.yaml      # relative path
        kubectl apply -f /tmp/a.yaml # absolute path
        ```

    </details>


</TabItem>

<TabItem value="hdfs" label="etcd+HDFS">

RisingWave supports using HDFS as the object storage.

Deploy a RisingWave instance with HDFS as the object storage.

```shell
kubectl apply -f https://raw.githubusercontent.com/risingwavelabs/risingwave-operator/main/docs/manifests/risingwave/risingwave-etcd-hdfs.yaml
```

</TabItem>

</Tabs>

<br />

You can check the status of the RisingWave instance by running the following command.

```shell
kubectl get risingwave
```

If the instance is running properly, the output should look like this:

<Tabs groupId="storage_selection">
<TabItem value="minio" label="etcd+MinIO">

```
NAME        RUNNING   STORAGE(META)   STORAGE(OBJECT)   AGE
risingwave  True      etcd            MinIO             30s
```

</TabItem>
<TabItem value="s3" label="etcd+S3">

```
NAME        RUNNING   STORAGE(META)   STORAGE(OBJECT)   AGE
risingwave  True      etcd            S3                30s
```

</TabItem>
<TabItem value="hdfs" label="etcd+HDFS">

```
NAME                   RUNNING    STORAGE(META)   STORAGE(OBJECT)   AGE
risingwave-etcd-hdfs   True       Etcd            HDFS              30s
```

</TabItem>
</Tabs>

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
    <Tabs groupId="storage_selection">
    <TabItem value="minio" label="etcd+MinIO">

    ```shell
    psql -h risingwave-frontend -p 4567 -d dev -U root
    ```

    </TabItem>
    <TabItem value="s3" label="etcd+S3">

    ```shell
    psql -h risingwave-frontend -p 4567 -d dev -U root
    ```

    </TabItem>
    <TabItem value="hdfs" label="etcd+HDFS">

    ```shell
    psql -h risingwave-etcd-hdfs-frontend -p 4567 -d dev -U root
    ```

    </TabItem>
    </Tabs>

</TabItem>
<TabItem value="nodeport" label="NodePort" >

You can connect to RisingWave from Nodes such as EC2 in Kubernetes

**Steps:**

1. Set the Service type to `NodePort`.

    ```
    # ...
    spec:
      global:
        serviceType: NodePort
    # ...
    ```

1. Connect to RisingWave by running the following commands on the Node.
    <Tabs groupId="storage_selection">
    <TabItem value="minio" label="etcd+MinIO">

    ```shell
    export RISINGWAVE_NAME=risingwave
    export RISINGWAVE_NAMESPACE=default
    export RISINGWAVE_HOST=`kubectl -n ${RISINGWAVE_NAMESPACE} get node -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}'`
    export RISINGWAVE_PORT=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].spec.ports[0].nodePort}'`

    psql -h ${RISINGWAVE_HOST} -p ${RISINGWAVE_PORT} -d dev -U root
    ```

    </TabItem>
    <TabItem value="s3" label="etcd+S3">

    ```shell
    export RISINGWAVE_NAME=risingwave
    export RISINGWAVE_NAMESPACE=default
    export RISINGWAVE_HOST=`kubectl -n ${RISINGWAVE_NAMESPACE} get node -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}'`
    export RISINGWAVE_PORT=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].spec.ports[0].nodePort}'`

    psql -h ${RISINGWAVE_HOST} -p ${RISINGWAVE_PORT} -d dev -U root
    ```

    </TabItem>
    <TabItem value="hdfs" label="etcd+HDFS">

    ```shell
    export RISINGWAVE_NAME=risingwave-etcd-hdfs
    export RISINGWAVE_NAMESPACE=default
    export RISINGWAVE_HOST=`kubectl -n ${RISINGWAVE_NAMESPACE} get node -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}'`
    export RISINGWAVE_PORT=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].spec.ports[0].nodePort}'`

    psql -h ${RISINGWAVE_HOST} -p ${RISINGWAVE_PORT} -d dev -U root
    ```

    </TabItem>
    </Tabs>

</TabItem>
<TabItem value="loadbalancer" label="LoadBalancer">

If you are using EKS, GCP, or other managed Kubernetes services provided by cloud vendors, you can expose the Service to the public network with a load balancer in the cloud.

**Steps:**

1. Set the Service type to `LoadBalancer`.

    ```
    # ...
    spec:
      global:
        serviceType: LoadBalancer
    # ...
    ```

1. Connect to RisingWave with the following commands.
    <Tabs groupId="storage_selection">
    <TabItem value="minio" label="etcd+MinIO">

    ```shell
    export RISINGWAVE_NAME=risingwave
    export RISINGWAVE_NAMESPACE=default
    export RISINGWAVE_HOST=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'`
    export RISINGWAVE_PORT=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].spec.ports[0].port}'`

    psql -h ${RISINGWAVE_HOST} -p ${RISINGWAVE_PORT} -d dev -U root
    ```

    </TabItem>
    <TabItem value="s3" label="etcd+S3">

    ```shell
    export RISINGWAVE_NAME=risingwave
    export RISINGWAVE_NAMESPACE=default
    export RISINGWAVE_HOST=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'`
    export RISINGWAVE_PORT=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].spec.ports[0].port}'`

    psql -h ${RISINGWAVE_HOST} -p ${RISINGWAVE_PORT} -d dev -U root
    ```

    </TabItem>
    <TabItem value="hdfs" label="etcd+HDFS">

    ```shell
    export RISINGWAVE_NAME=risingwave-etcd-hdfs
    export RISINGWAVE_NAMESPACE=default
    export RISINGWAVE_HOST=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'`
    export RISINGWAVE_PORT=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].spec.ports[0].port}'`

    psql -h ${RISINGWAVE_HOST} -p ${RISINGWAVE_PORT} -d dev -U root
    ```

    </TabItem>
    </Tabs>

</TabItem>
</Tabs>

<br />

Now you can ingest and transform streaming data. See [Quick start](/get-started.md) for details.
