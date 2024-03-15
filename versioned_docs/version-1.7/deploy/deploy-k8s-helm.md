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
- Ensure you allocate enough resources for the deployment, and use the recommended disks for etcd. For details, see [Hardware requirements](/deploy/hardware-requirements.md).

## Step 1: Start Kubernetes

Start a Kubernetes cluster. For details about starting a Kubernetes cluster, see Kubernetes' [Getting started guide](https://kubernetes.io/docs/setup/).

## Step 2: Start RisingWave

Now start a RisingWave cluster with Helm.

1. Add the `risingwave` chart repository:

```bash
helm repo add risingwavelabs https://risingwavelabs.github.io/helm-charts/
```

2. Update your Helm chart repositories to ensure that you are using the RisingWave Helm chart:

```bash
helm repo update
```

If you are using AWS EKS, you also need to set it as the default cluster for Helm:

```bash
aws eks update-kubeconfig --name <your_eks_cluster_name>
```

3. Optional: You can customize your configuration for the RisingWave deployment by editing the `values.yml` file.

4. Install the latest RisingWave Helm chart:

```bash
helm install --set wait=true <my-risingwave> risingwavelabs/risingwave
```

Where `<my-risingwave>` is the release name you choose to use for your RisingWave deployment. This command will install the latest stable version of RisingWave.

If you want to install a particular version, you can specify the version via the `image-tag` attribute. Remember to replace `<version_number>` with the desired version, for example `v1.7.0`.

```bash
helm install --set wait=true --set image.tag=<version_number> <my-risingwave> risingwavelabs/risingwave
```

You may get an output message like this:

```bash
NAME: my-risingwave
LAST DEPLOYED: Wed Aug 16 15:35:19 2023
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Use the following command to check the deployment status:

```bash
kubectl get pods -l app.kubernetes.io/instance=<my-risingwave>
```

When your status looks like below, it means the RisingWave cluster starts successfully:

```bash
NAME                                   READY   STATUS    RESTARTS        AGE
risingwave-compactor-8dd799db6-hdjjz   1/1     Running   1 (8m33s ago)   11m
risingwave-compute-0                   2/2     Running   0               11m
risingwave-etcd-0                      1/1     Running   0               11m
risingwave-frontend-7bd7b8c856-czdgd   1/1     Running   1 (8m33s ago)   11m
risingwave-meta-0                      1/1     Running   0               11m
risingwave-minio-5cfd8f5f64-6msqm      1/1     Running   0               11m
```

### Step 3: Access RisingWave

By default, the RisingWave Helm Chart will deploy a ClusterIP service that enables the cluster-local communication.

Once deployed, you can forward your local machine's port **`4567`** to the service's port via:

```bash
kubectl port-forward svc/my-risingwave 4567:svc
```

You can then connect to RisingWave using a PostgreSQL client on port 4567. For example:

```bash
psql -h localhost -p 4567 -d dev -U root
```

You can monitor the RisingWave cluster using the monitoring stack. For details, see [Monitoring a RisingWave cluster](/manage/monitor-risingwave-cluster.md).

## Optional: Customize your RisingWave deployment

During installation or upgrade, you can customze your RisingWave deployment by providing the configuration file `values.yml`. You should edit the file before specifying it during installation or upgrade.

To customize your deployment during installation, run this command instead:

```bash
helm install --set wait=true -f values.yml <my-risingwave> risingwavelabs/risingwave
```

To customize your deployment during upgrade, run this command instead:

```bash
helm upgrade -f values.yml --reuse-values <my-risingwave> risingwavelabs/risingwave
```

The `--reuse-values` option ensures that the previous configuration will be kept and only the provided configuration will be applied.

A typical `values.yml` looks like this:

```yaml
...
compactorComponent:
  resources:
    limits:
      cpu: 1
      memory: 2Gi
    requests:
      cpu: 100m
      memory: 64Mi
...
```

To view the user-specified configurations of your RisingWave cluster:

```bash
helm get values my-risingwave
```

The output will look like this:

```yaml
USER-SUPPLIED VALUES:
compactorComponent:
  resources:
    limits:
      cpu: 1
      memory: 2Gi
    requests:
      cpu: 100m
      memory: 64Mi
```

### Resize a node

By editing the configurations in `values.yml`, you can resize a worker node. The compactor node configurations are in the `compactorComponent` section. Configurations for the meta node and compute node are in `metaComponent` and `computeComponent` sections respectively.

```bash
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

### Customize state backends

By default, the RisingWave Helm chart uses MinIO as the default state backend. You can edit the `values.yml` file to customize the state backend. 


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="state_backend_options">

<TabItem value="aws-s3" label="AWS S3">

```yaml
tags:
  minio: false

stateStore:
  minio:
    enabled: false

  s3:
    enabled: true
    region: <your aws region, e.g, “ap-southeast-1”>
    bucket: <your bucket name>
    authentication:
      useServiceAccount: false
      accessKey: <your access key>
      secretAccessKey: <your secret access key>
```
</TabItem>

<TabItem value="alibaba-cloud-oss" label="Alibaba Cloud OSS">

```yaml
tags:
  minio: false

stateStore:
  minio:
    enabled: false

  oss:
    enabled: true
    region: <your oss region, e.g, "cn-hangzhou">
    bucket: <your bucket name>
    authentication:
      useServiceAccount: false
      accessKey: <your access key>
      secretAccessKey: <your secret access key>
```
</TabItem>

</Tabs>
