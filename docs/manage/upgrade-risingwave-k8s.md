---
id: cluster-upgrades
title: Upgrade the RisingWave version in a cluster
description: How to upgrade the RisingWave version in a cluster.
slug: /cluster-upgrades
keywords: [risingwave upgrade]
---
We strongly recommend that you regularly upgrade your RisingWave version to pick up bug fixes, performance improvements, and new features.

Note: assuming that the Kubernetes namespace is `default`. If your RisingWave cluster is deployed in another namespace, please add the `-n <namespace>` argument to the `kubectl` and `helm` commands below. Remember to replace the `<namespace>` with your own namespace.

## Upgrade with the RisingWave Operator

Remember to replace all the `<risingwave-cluster>` with the real object name.

1. Check the current status of the RisingWave cluster.

```shell
kubectl get risingwave <risingwave-cluster>
```

Expected output:

```plain
NAME         META STORE   STATE STORE   VERSION   RUNNING   AGE
risingwave   Etcd         S3            v1.2.0    True      2m20s
```

TODO: backup

1. Upgrade the image version. Remember to replace `<target-version>` with the target image version.

```shell
kubectl patch risingwave <risingwave-cluster> --type='merge' -p '{"spec": {"image": "ghcr.io/risingwavelabs/risingwave:<target-version>"}}'
```

1. Wait before the `Upgrading` condition becomes `True`.

```shell
kubectl wait --for=condition=Upgrading risingwave/<risingwave-cluster>
```

1. Wait before the `Upgrading` condition becomes `False`.

```shell
kubectl wait --for=condition=Upgrading=false risingwave/<risingwave-cluster>
```

1. If wait timeouts, please check if the pods are running properly.
   1. If any of the pods is pending or not running, you might need to troubleshoot first and see if there are problems with pod itself, e.g., image not found or pod not scheduled.
   2. If the meta pod isn't running and ready, please help submit an issue with the logs and rollback by following the guides below.
   3. If the meta pod is running but others are not, please wait a minute and see if they will be running afterwards. Please submit an issue with the logs and rollback by following the guides below.

```shell
kubectl get pods -l risingwave/name=<risingwave-cluster>
```

Expected output:

```plain
NAME                                    READY   STATUS    RESTARTS      AGE
risingwave-compactor-5cfcb469c5-gnkrp   1/1     Running   2 (1m ago)    2m35s
risingwave-compute-0                    1/1     Running   2 (1m ago)    2m35s
risingwave-frontend-86c948f4bb-69cld    1/1     Running   2 (1m ago)    2m35s
risingwave-meta-0                       1/1     Running   1 (1m ago)    2m35s
```

1. Rollback if necessary, with the following command. Remember to replace the `<version-before>` with the image version used before upgrading. The other steps to verify the rollback should be the same as the upgrading.

```shell
kubectl patch risingwave <risingwave-cluster> --type='merge' -p '{"spec": {"image": "ghcr.io/risingwavelabs/risingwave:<version-before>"}}'
```

TODO: restore if rollback fails.

## Upgrade with Helm

Remember to replace all the `<risingwave-cluster>` with the real object name.

1. Check the current status of the RisingWave helm release.

```shell
helm list -f <risingwave-cluster>
```

Expected output:

```plain
NAME      	NAMESPACE 	REVISION	UPDATED                                	 STATUS  	CHART                       	APP VERSION
risingwave	default	    21      	2023-09-20 13:20:58.389424056 +0000 UTC	 deployed	risingwave-0.1.9	v1.2.0
```

TODO: backup

1. Add and update the helm repo.

```shell
helm repo add risingwavelabs https://risingwavelabs.github.io/helm-charts/
helm repo update
```

2. Upgrade the image version. Remember to replace `<target-version>` with the target image version.

```shell
helm upgrade --wait --set image.tag=<target-version> --reuse-values <risingwave-cluster> risingwavelabs/risingwave
```

1. If wait timeouts, please check if the pods are running properly.
   1. If any of the pods is pending or not running, you might need to troubleshoot first and see if there are problems with pod itself, e.g., image not found or pod not scheduled.
   2. If the meta pod isn't running and ready, please help submit an issue with the logs and rollback by following the guides below.
   3. If the meta pod is running but others are not, please wait a minute and see if they will be running afterwards. Please submit an issue with the logs and rollback by following the guides below.

```shell
kubectl get pods -l risingwave/name=<risingwave-cluster>
```

Expected output:

```plain
NAME                                    READY   STATUS    RESTARTS      AGE
risingwave-compactor-5cfcb469c5-gnkrp   1/1     Running   2 (1m ago)    2m35s
risingwave-compute-0                    1/1     Running   2 (1m ago)    2m35s
risingwave-frontend-86c948f4bb-69cld    1/1     Running   2 (1m ago)    2m35s
risingwave-meta-0                       1/1     Running   1 (1m ago)    2m35s
```

1. Rollback if necessary, with the following command. Remember to replace the `<version-before>` with the image version used before upgrading. The other steps to verify the rollback should be the same as the upgrading.

```shell
helm rollback --wait <risingwave-cluster>
```

TODO: restore if rollback fails.