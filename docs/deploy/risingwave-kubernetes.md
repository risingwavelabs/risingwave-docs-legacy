---
id: risingwave-kubernetes
title: Set up a RisingWave cluster in Kubernetes
description: Deploy RisingWave in a Kubernetes cluster with the Kubernetes Operator for RisingWave.
slug: /risingwave-kubernetes
---

This article will help you use the [Kubernetes Operator for RisingWave](https://github.com/risingwavelabs/risingwave-operator) (hereinafter ‘the Operator’) to deploy a RisingWave cluster in Kubernetes.

The Operator is a deployment and management system for RisingWave. It runs on top of Kubernetes and provides functionalities like provisioning, upgrading, scaling, and destroying the RisingWave instances inside the cluster. 

## Prerequisites

* **[Install `kubectl`](http://pwittrock.github.io/docs/tasks/tools/install-kubectl/)**

    Ensure that the Kubernetes command-line tool [`kubectl`](https://kubernetes.io/docs/reference/kubectl/) is installed in your environment.

* **[Install `psql`](../guides/install-psql-without-full-postgres.md)**

    Ensure that the PostgreSQL interactive terminal [`psql`](https://www.postgresql.org/docs/current/app-psql.html) is installed in your environment.

* **[Install and run Docker](https://docs.docker.com/get-docker/)**
    
    Ensure that [Docker](https://docs.docker.com/desktop/) is installed in your environment and running.



## Create a Kubernetes cluster

:::info
The steps in this section are intented for creating a Kubernetes cluster in your local environment.<br/>If you are using a managed Kubernetes service such as AKS, GKE, and EKS, refer to the corresponding documentation for instructions.
:::

**Steps:**

1. [Install `kind`](https://kind.sigs.k8s.io/docs/user/quick-start#installation).

    [`kind`](https://kind.sigs.k8s.io/) is a tool for running local Kubernetes clusters using Docker containers as cluster nodes. You can see the available tags of `kind` on [Docker Hub](https://hub.docker.com/r/kindest/node/tags).

1. Create a cluster.

    ```shell
    kind create cluster
    ```

1. ***(Optional)*** Check if the cluster is created properly.

    ```shell
    kubectl cluster-info
    ```

## Deploy the Operator

Before the deployment, ensure that the following requirements are satisfied.

* Docker version ≥ 18.09
* `kubectl` version ≥ 1.18
* For Linux, set the value of the `sysctl` parameter [net.ipv4.ip_forward](https://linuxconfig.org/how-to-turn-on-off-ip-forwarding-in-linux) to 1.

**Steps:**

1. [Install `cert-manager`](https://cert-manager.io/docs/installation/).

1. Install the Operator.

    ```shell
    kubectl apply -f https://github.com/risingwavelabs/risingwave-operator/releases/latest/download/risingwave-operator.yaml
    ```

1. ***(Optional)*** Check if the Pods are running.

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
kubectl apply -f https://raw.githubusercontent.com/risingwavelabs/risingwave-operator/main/examples/risingwave/risingwave-etcd-minio.yaml
```

</TabItem>
<TabItem value="s3" label="etcd+S3">

RisingWave supports using Amazon S3 as the object storage.

**Steps:**

1. Create a Secret with the name ‘s3-credentials’.

    ```shell
    kubectl create secret generic s3-credentials --from-literal AccessKeyID=${ACCESS_KEY} --from-literal SecretAccessKey=${SECRET_ACCESS_KEY} --from-literal Region=${AWS_REGION}
    ```

1. On the S3 console, [create a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html) with the name ‘hummock001’.

1. Deploy a RisingWave instance with S3 as the object storage.

    ```shell
    kubectl apply -f https://raw.githubusercontent.com/risingwavelabs/risingwave-operator/main/examples/risingwave/risingwave-etcd-s3.yaml
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
NAME                    RUNNING   STORAGE(META)   STORAGE(OBJECT)   AGE
risingwave-etcd-minio   True      etcd            MinIO             30s
```

</TabItem>
<TabItem value="s3" label="etcd+S3">

```
NAME                    RUNNING   STORAGE(META)   STORAGE(OBJECT)   AGE
risingwave-etcd-s3      True      etcd            S3                30s
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
    kubectl apply -f https://raw.githubusercontent.com/risingwavelabs/risingwave-operator/main/examples/psql/psql-console.yaml
    ```

1. Attach to the Pod so that you can execute commands inside the container.

    ```shell
    kubectl exec -it psql-console bash
    ```

1. Connect to RisingWave via `psql`.
    <Tabs groupId="storage_selection">
    <TabItem value="minio" label="etcd+MinIO">

    ```shell
    psql -h risingwave-etcd-minio-frontend -p 4567 -d dev -U root
    ```

    </TabItem>
    <TabItem value="s3" label="etcd+S3">

    ```shell
    psql -h risingwave-etcd-s3-frontend -p 4567 -d dev -U root
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
    export RISINGWAVE_NAME=risingwave-etcd-minio
    export RISINGWAVE_NAMESPACE=default
    export RISINGWAVE_HOST=`kubectl -n ${RISINGWAVE_NAMESPACE} get node -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}'`
    export RISINGWAVE_PORT=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].spec.ports[0].nodePort}'`

    psql -h ${RISINGWAVE_HOST} -p ${RISINGWAVE_PORT} -d dev -U root
    ```

    </TabItem>
    <TabItem value="s3" label="etcd+S3">

    ```shell
    export RISINGWAVE_NAME=risingwave-etcd-s3
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
    export RISINGWAVE_NAME=risingwave-etcd-minio
    export RISINGWAVE_NAMESPACE=default
    export RISINGWAVE_HOST=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'`
    export RISINGWAVE_PORT=`kubectl -n ${RISINGWAVE_NAMESPACE} get svc -l risingwave/name=${RISINGWAVE_NAME},risingwave/component=frontend -o jsonpath='{.items[0].spec.ports[0].port}'`

    psql -h ${RISINGWAVE_HOST} -p ${RISINGWAVE_PORT} -d dev -U root
    ```

    </TabItem>
    <TabItem value="s3" label="etcd+S3">

    ```shell
    export RISINGWAVE_NAME=risingwave-etcd-s3
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

You can now [connect a streaming source to RisingWave](sql/commands/sql-create-source.md) and [issue SQL queries to manage your data](risingwave-sql-101.md).


