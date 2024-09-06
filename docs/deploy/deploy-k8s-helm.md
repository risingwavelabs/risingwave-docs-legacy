---
id: risingwave-k8s-helm
title: Deploy RisingWave on Kubernetes with Helm
description: Deploy RisingWave in a Kubernetes cluster with Helm.
slug: /risingwave-k8s-helm
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/risingwave-k8s-helm/" />
</head>

This guide walks you through the process of deploying RisingWave in a single Kubernetes cluster with [Helm](https://helm.sh/).

## Prerequisites

- Ensure you have Helm 3.7 + installed in your environment. For details about how to install Helm, see the [Helm documentation](https://helm.sh/docs/intro/install/).
- Ensure you have [Kubernetes](https://kubernetes.io/) 1.24 or higher installed in your environment.
- Ensure you allocate enough resources for the deployment. For details, see [Hardware requirements](/deploy/hardware-requirements.md).

## Step 1: Start Kubernetes

Start a Kubernetes cluster. For details about starting a Kubernetes cluster, see Kubernetes' [Getting started guide](https://kubernetes.io/docs/setup/).

## Step 2: Start RisingWave

Now start a RisingWave cluster with Helm.

1. Add the RisingWave Helm chart repository:

  ```bash
  helm repo add risingwavelabs https://risingwavelabs.github.io/helm-charts/ --force-update
  ```

2. Update your Helm chart repositories to ensure that you are using the RisingWave Helm chart:

  ```bash
  helm repo update
  ```

  If you are using AWS EKS, you also need to update the local configuration for kubectl and Helm to access your EKS cluster:

  ```bash
  aws eks update-kubeconfig --name <your_eks_cluster_name>
  ```

3. Create a RisingWave namespace. We recommend creating a dedicated namespace for RisingWave resources.

  ```bash
  kubectl create namespace risingwave
  ```

4. Customize your configuration for the RisingWave deployment by editing the [`values.yml`](https://github.com/risingwavelabs/helm-charts/blob/main/charts/risingwave/values.yaml) file.

    - **Customize meta store**: The meta store in RisingWave holds metadata for cluster operations. See [Configuration](https://github.com/risingwavelabs/helm-charts/blob/main/docs/CONFIGURATION.md#customize-meta-store) for all the available options and [Examples](https://github.com/risingwavelabs/helm-charts/tree/main/examples/meta-stores) for detailed usage of meta stores.

    - **Customize state store**: The state store in RisingWave serves as a fault-tolerant storage system for preserving system state. See [Configuration](https://github.com/risingwavelabs/helm-charts/blob/main/docs/CONFIGURATION.md#customize-state-store) for all the available options and [Examples](https://github.com/risingwavelabs/helm-charts/tree/main/examples/state-stores) for detailed usage of state stores.

    - **Bundled PostgreSQL and MinIO**: If you want to use `PostgreSQL` as the meta store and `MinIO` as the state store, the Helm chart for RisingWave offers the option to bundle them together. This allows for a quick and easy setup of the Helm chart. See [Configuration](https://github.com/risingwavelabs/helm-charts/blob/main/docs/CONFIGURATION.md#bundled-etcdpostgresqlminio-as-stores) for more details. To enable this feature, set `tags.bundle=true`.

  :::note
  Before using the bundled `PostgreSQL` and `MinIO`, and any local stores, ensure that you have implemented the [Dynamic Volume Provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/).
  :::

5. Install the latest RisingWave Helm chart:

    ```bash
    helm install -n risingwave --create-namespace --set wait=true -f values.yaml <my-risingwave> risingwavelabs/risingwave
    ```

    Where `<my-risingwave>` is the release name you choose to use for your RisingWave deployment. This command will install the latest stable version of RisingWave.

    If you want to install a particular version, you can specify the version via the `image-tag` attribute. Remember to replace `<version_number>` with the desired version, for example `v1.7.0`.

    ```bash
    helm install -n risingwave --create-namespace --set wait=true --set image.tag=<version_number> <my-risingwave> -f values.yaml risingwavelabs/risingwave
    ```

    You may get an output message like this:

    ```
    NAME: my-risingwave
    LAST DEPLOYED: Wed Aug 16 15:35:19 2023
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    ```

6. Use the following command to check the deployment status:

  ```bash
  kubectl -n risingwave get pods -l app.kubernetes.io/instance=<my-risingwave>
  ```

  When your status looks like below, it means the RisingWave cluster starts successfully:

  ```
  NAME                                   READY   STATUS    RESTARTS        AGE
  risingwave-compactor-8dd799db6-hdjjz   1/1     Running   1 (8m33s ago)   11m
  risingwave-compute-0                   2/2     Running   0               11m
  risingwave-postgresql-0                1/1     Running   0               11m
  risingwave-frontend-7bd7b8c856-czdgd   1/1     Running   1 (8m33s ago)   11m
  risingwave-meta-0                      1/1     Running   0               11m
  risingwave-minio-5cfd8f5f64-6msqm      1/1     Running   0               11m
  ```

## Step 3: Access RisingWave

By default, the RisingWave Helm Chart will deploy a ClusterIP service that enables the cluster-local communication.

Once deployed, you can forward your local machine's port **`4567`** to the service's port via:

```bash
kubectl -n risingwave port-forward svc/my-risingwave 4567:svc
```

You can then connect to RisingWave using a PostgreSQL client on port 4567. For example:

```bash
psql -h localhost -p 4567 -d dev -U root
```

You can monitor the RisingWave cluster using the monitoring stack. For details, see [Monitoring a RisingWave cluster](/manage/monitor-risingwave-cluster.md).

## Optional: Resize a node

By editing the configurations in [`values.yml`](https://github.com/risingwavelabs/helm-charts/blob/main/charts/risingwave/values.yaml), you can resize a worker node. The compactor node configurations are in the `compactorComponent` section. Configurations for the meta node and compute node are in `metaComponent` and `computeComponent` sections respectively. See [Customize pods of different components](https://github.com/risingwavelabs/helm-charts/blob/main/docs/CONFIGURATION.md#customize-pods-of-different-components) for details.

```yaml
# To resize other types of node, please replace the name with
# computeComponent, or metaComponent.
compactorComponent:
  resources:
    # The maximum amount of CPU and memory the Pod can use.
    limits:
      cpu: 1
      memory: 2Gi
    # The minimum amount of CPU and memory that the Pod is guaranteed to have.
    requests:
      # 0.1 cores
      cpu: 100m
      memory: 64Mi
```

Please note that increasing the CPU resource will not automatically increase the parallelism of existing materialized views. When scaling up (adding more CPU cores) a compute node, you should perform the scaling by following the instructions in [Cluster scaling](/deploy/k8s-cluster-scaling.md).
