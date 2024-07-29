---
id: uninstall-risingwave-k8s
title: Uninstall RisingWave from a Kubernetes cluster
description: Describes how to uninstall RisingWave from a Kubernetes cluster and how to remove the persistent volume claims, as well as data in object stores.
slug: /uninstall-risingwave-k8s
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/uninstall-risingwave-k8s/" />
</head>

This topic describes how to uninstall RisingWave from a Kubernetes cluster with Helm and how to remove the persistent volume claims (PVCs) and data in object stores.

## Uninstall RisingWave from a K8s cluster with Helm

To gracefully uninstall RisingWave from a Kubernetes cluster with Helm:

```bash
helm uninstall my-risingwave
```

Then wait for the uninstallation to complete. You can monitor the uninstallation status by using this command:

```bash
kubectl get pods
```

## Delete the persistent volume claims

To check the persistent volume claims, use the following command:

```bash
kubectl get persistentvolumeclaims -l app.kubernetes.io/instance=my-risingwave
```

If there are any existing persistent volume claims, you can delete them using the following command:

```bash
kubectl delete persistentvolumeclaims -l app.kubernetes.io/instance=my-risingwave
```

Please note that the underlying persistent volumes will be reclaimed based on their reclaim policies. For more information, you can refer to the [documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming).

## Delete the data in object storage

If you configure AWS S3 or other object storage options from cloud service providers as the state backend, you should also delete the bucket to avoid conflicts when deploying a new cluster with the same bucket name.
