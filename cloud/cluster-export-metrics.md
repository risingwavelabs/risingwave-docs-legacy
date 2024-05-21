---
id: cluster-export-metrics
title: Export metrics
description: Export metrics from a RisingWave cloud cluster.
slug: /export-metrics
---

This article describes how to use metrics API to export metrics from a RisingWave Cloud cluster to various monitoring systems like Prometheus, DataDog, and InfluxDB. The metrics include all major components such as `etcd`, `frontend`, `compute`, `compactor`, and `meta`, except for those starting with `go.*`.

## Step 1: Generate API key

Generate the API key ID and API key secret in the Cloud Portal. See [Generate an API key](organization-service-account.md#generate-an-api-key) for details.

## Step 2: Get Cloud_HOST

Get the corresponding `CLOUD_HOST` for your region and Cloud provider from the table below:

| Region/CloudProvider | CLOUD_HOST |
| --- | --- |
| useast2/aws | canary-useast2-mgmt.risingwave.cloud |
| us-east-1/aws | prod-aws-usea1-mgmt.risingwave.cloud |
| us-west-2/aws | prod-aws-uswe2-mgmt.risingwave.cloud |
| eu-west-2/aws | prod-aws-euwe2-mgmt.risingwave.cloud |
| eu-north-1/aws | prod-aws-euno1-mgmt.risingwave.cloud |
| us-central1/gcp | prod-gcp-usce1-mgmt.risingwave.cloud |
| europe-west3/gcp | prod-gcp-euwe3-mgmt.risingwave.cloud |

## Step 3: Configure metric exporters

Choose one of the following methods to export metrics data from RisingWave environment to external monitoring systems.

:::note
The metrics are formatted according to [Prometheus](https://prometheus.io/docs/concepts/metric_types/) standards. If your monitoring collection mode is compatible with the Prometheus format, refer to the Prometheus section below to configure the collection.
:::

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs queryString="method">

<TabItem value="Prometheus" label="Prometheus">

To import the metrics to Prometheus, edit the `scrape_configs` section in the prometheus.yaml file as follows:

```yaml
scrape_configs:
- job_name: risingwave-remote
  static_configs:
  - targets: 
    - {CLOUD_HOST}
  metrics_path: /api/v1/tenant/{TENANTE_CLUSTER_ID}/metrics
  basic_auth:
    username: {API_KEY}
    password: {API_SECRET}
  scrape_interval: 60s
  scrape_timeout: 60s
  scheme: https
```

#### Notes

- Update the `Cloud_HOST` according to the region and Cloud provider of your RisingWave cluster.

- Update the `TENANT_CLUSTER_ID` with the specific cluster ID in your RisingWave environment. For example, if your cluster URL is `risingwave-cloud.com/cluster/168/us-central1/overview/`, replace `TENANT_CLUSTER_ID` with the value `168`.

</TabItem>

<TabItem value="DataDog" label="DataDog">

To import the metrics to DataDog, use DataDog Agent and [DataDog integration](https://app.datadoghq.com/integrations?integrationId=openmetrics). If you have not installed the DataDog agent, see [installation guide](https://app.datadoghq.com/account/settings/agent/latest?platform=overview).  

Next, edit the `openmetrics.d/conf.yaml` file at the root of your [Agent configuration directory](https://docs.datadoghq.com/agent/guide/agent-configuration-files/#agent-configuration-directory) as follows, and then restart your agents.

```yaml
instances:
- openmetrics_endpoint: http://{CLOUD_HOST}/api/v1/tenant/{TENANTE_CLUSTER_ID}/metrics
  namespace: risingwave
  metrics:
  - .*
  auth_type: basic
  username: {API_KEY}
  password: {API_SECRET}
```

#### Notes

- Update the `Cloud_HOST` according to the region and Cloud provider of your RisingWave cluster.
- Update the `TENANT_CLUSTER_ID` with the specific cluster ID in your RisingWave environment. For example, if your cluster URL is `risingwave-cloud.com/cluster/168/us-central1/overview/`, replace `TENANT_CLUSTER_ID` with the value `168`.
- The limit for the agent is **2000 metrics per instance**. To increase the limit, please contact [DataDog support](https://docs.datadoghq.com/help/).

</TabItem>

<TabItem value="InfluxDB" label="InfluxDB">

To import the metrics to InfluxDB, you need to configure Telegraf first. See instructions on how to [use Telegraf to scrape Prometheus metrics](https://docs.influxdata.com/influxdb/v2/write-data/developer-tools/scrape-prometheus-metrics/#use-telegraf) and the [Prometheus input plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/prometheus/README.md).

In the Telegraf configuration, you need to fill in the Prometheus input section, see [Prometheus](cluster-export-metrics.md?method=Prometheus#step-3-configure-metric-exporters) for details.

</TabItem>

</Tabs>

## Step 4: Set up dashboards

To set up dashboards based on key metrics, see [RisingWave open source user-dashboard](https://github.com/risingwavelabs/risingwave/blob/main/grafana/risingwave-user-dashboard.dashboard.py).
