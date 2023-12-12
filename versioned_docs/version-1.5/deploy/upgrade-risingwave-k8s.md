---
id: upgrade-risingwave-k8s
title: Upgrade RisingWave in a Kubernetes cluster
description: Upgrade RisingWave in a Kubernetes cluster
slug: /upgrade-risingwave-k8s
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/upgrade-risingwave-k8s/" />
</head>
This topic describes upgrade RisingWave in a K8s deployment with the RisingWave Kubernetes Operator and Helm.

:::caution

When upgrading RisingWave, it's important to be aware that there may be breaking changes. If you require technical support during the process of upgrading RisingWave in your production environments, please don't hesitate to reach out to us.

:::

:::note

Assuming that the Kubernetes namespace is `default`, if your RisingWave cluster is deployed in another namespace, please add the `-n <namespace>` argument to the `kubectl` and `helm` commands below. Remember to replace the `<namespace>` with your own namespace.

:::

## Upgrade RisingWave with Helm

1. Check the current status of the RisingWave helm release.

```shell
helm list -f <risingwave-cluster>
```

The output should look like this:

```plain
NAME       NAMESPACE  REVISION UPDATED                                  STATUS   CHART                        APP VERSION
risingwave default     21       2023-09-20 13:20:58.389424056 +0000 UTC  deployed risingwave-0.1.16 v1.3.0
```

1. Update the local cache of available charts (packages) from the configured Helm chart repositories:

```bash
helm repo update
```

1. Check for available versions of RisingWave Helm charts:

```bash
helm search repo risingwavelabs/risingwave -l
```

```bash title=Example output
NAME                               CHART VERSION APP VERSION DESCRIPTION
risingwavelabs/risingwave          0.1.16        v1.1.3      The distributed streaming database SQL stream p...
risingwavelabs/risingwave          0.1.15        v1.1.2      The distributed streaming database SQL stream p...
risingwavelabs/risingwave          0.1.14        v1.1.1      The distributed streaming database SQL stream p...
```

3. Upgrade RisingWave. You can upgrade to the latest version or a particular version.

To upgrade to the latest version:

```bash
helm upgrade --reuse-values my-risingwave risingwavelabs/risingwave
```

To upgrade to a particular version:

```bash
helm upgrade --set image.tag={risingwave-version} \
  -f values.yaml \
  --reuse-values \
  --version {chart-version} \
  my-risingwave risingwavelabs/risingwave
```

## Upgrade RisingWave with the Operator

Remember to replace all the `<risingwave-cluster>` with the real object name.

1. Check the current status of the RisingWave cluster.

```shell
kubectl get risingwave <risingwave-cluster>
```

Expected output:

```plain
NAME         META STORE   STATE STORE   VERSION   RUNNING   AGE
risingwave   Etcd         S3            v1.3.0    True      2m20s
```

1. Upgrade the image version. Remember to replace `<target-version>` with the target image version.

```shell
kubectl patch risingwave <risingwave-cluster> --type='merge' -p '{"spec": {"image": "ghcr.io/risingwavelabs/risingwave:<target-version>"}}'
```

1. Wait until all pods are recreated and the `Upgrading` condition becomes `False` or empty.

```shell
kubectl wait --for=condition=Upgrading=false risingwave/<risingwave-cluster>
```

If wait timeouts, please check if the pods are running properly.

- If any of the pods is pending or not running, you might need to troubleshoot first and see if there are problems with the pod itself. Possible issues include the image was not found or the pod operation was not scheduled.
- If the meta pod isn't running and ready, please submit an issue with the logs and rollback by following the guides below.
- If the meta pod is running but other pods are not, please wait a minute and see if they will be running afterwards. Please submit an issue with the logs and roll back by following the instructions below.

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

### Roll back when necessary

If any issue happens and it cannot be resolved within a certain timeframe, you can roll back the upgrade with the following command. Remember to replace the `<version-before>` with the image version used before the upgrade. The other steps to verify the rollback are the same as the upgrade.

```shell
kubectl patch risingwave <risingwave-cluster> --type='merge' -p '{"spec": {"image": "ghcr.io/risingwavelabs/risingwave:<version-before>"}}'
```
