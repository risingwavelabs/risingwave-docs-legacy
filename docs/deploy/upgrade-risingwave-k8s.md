---
id: upgrade-risingwave-k8s
title: Upgrade RisingWave with Helm
description: Upgrade RisingWave with Helm charts
slug: /upgrade-risingwave-k8s
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/upgrade-risingwave-k8s/" />
</head>
This topic describes the steps to upgrade RisingWave in a Kubernetes cluster with Helm charts.

:::caution

When upgrading RisingWave, it's important to be aware that there may be breaking changes. If you require technical support during the process of upgrading RisingWave in your production environments, please don't hesitate to reach out to us.

:::

1. Update the local cache of available charts (packages) from the configured Helm chart repositories:

```bash
helm repo update
```

2. Check for available versions of RisingWave Helm charts:

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
