---
id: risingwave-k8s-helm
title: Deploy RisingWave on Kubernetes with Helm
description: Deploy RisingWave in a Kubernetes cluster with Helm.
slug: /risingwave-k8s-helm
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/risingwave-k8s-helm/" />
</head>

This guide walks you through the process of deploying RisingWave in a single Kubernetes cluster with Helm.

## Prerequisites

Ensure you allocate enough resources for the deployment. For details about minimal and recommended resources, see [Resource planning](/deploy/resource-planning.md).s

## Step 1: Start Kubernetes

Install Kubernetes 1.24 or higher, and start a Kubernetes cluster. For details about starting a Kubernetes cluster, see Kubernetes' [Getting started guide](https://kubernetes.io/docs/setup/).

## Step 2: Start RisingWave

Now start a RisingWave cluster with Helm.

1. Install the [Helm client (version 3.0 or higher)](https://helm.sh/docs/intro/install/) and add the `risingwave` chart repository:

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

If you want to install a particular version, you can specify the version via the `image-tag` attribute. For example:

```bash
helm install --set wait=true --set image.tag=v1.2.0 <my-risingwave> risingwavelabs/risingwave
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

## Optional: Customize your RisingWave deployment

During installation or upgrade, you can customze your RisingWave deployment by providing the configuration file `values.yml`.

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
compactorComponent:
  resources:
    limits:
      cpu: 1
      memory: 2Gi
    requests:
      cpu: 100m
      memory: 64Mi
```

You can use this command to view the user-specified configurations of your RisingWave cluster:

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
