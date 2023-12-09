---
id: sink-to-elasticsearch
title: Sink data from RisingWave to Elasticsearch
description: Sink data from RisingWave to Elasticsearch.
slug: /sink-to-elasticsearch 
---
You can deliver the data that has been ingested and transformed in RisingWave to Elasticsearch to serve searches or analytics.

This guide describes how to sink data from RisingWave to Elasticsearch using the Elasticsearch sink connector in RisingWave.

[Elasticsearch](https://www.elastic.co/elasticsearch/) is a distributed, RESTful search and analytics engine capable of addressing a growing number of use cases. It centrally stores your data for lightning fast search, fine‑tuned relevancy, and powerful analytics that scale with ease.

:::note Beta Feature
The Elasticsearch sink connector in RisingWave is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

:::note

The Elasticsearch sink connector in RisingWave provides at-least-once delivery semantics. Events may be redelivered in case of failures.

:::

## Prerequisites

- Ensure the Elasticsearch cluster (version 7.x or 8.x) is accessible from RisingWave.

- The Elastic sink connector in RisingWave relies on the connector node to work. Please ensure the connector node is enabled in RisingWave. For details, see [Enable the connector node](/deploy/risingwave-trial.md/?method=binaries#optional-enable-the-connector-node).

## Create a Elasticsearch sink

Use the following syntax to create a Elasticsearch sink. Once a sink is created, any insert or update to the sink will be streamed to the specified Elasticsearch endpoint.

```sql
CREATE SINK sink_name
[ FROM sink_from | AS select_query ]
WITH (
  connector = 'elasticsearch',
  index = '<your Elasticsearch index>',
  url = 'http://<ES hostname>:<ES port>',
  username = '<your ES username>', 
  password = '<your password>',
  delimiter='<delimiter>'
);
```

## Parameters

| Parameter       | Description |
| --------------- | ----------- |
|sink_name| Name of the sink to be created.|
|sink_from| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or a SELECT query must be specified.|
|AS select_query| A SELECT query that specifies the data to be output to the sink. Either this query or a FROM clause must be specified. See [SELECT](/sql/commands/sql-select.md) for the syntax and examples of the SELECT command.|
| `index`         |Required. Name of the Elasticsearch index that you want to write data to. |
| `url`          | Required. URL of the Elasticsearch REST API endpoint.|
| `username`        | Optional. `elastic` user name for accessing the Elasticsearch endpoint. It must be used with `password`.|
| `password`       | Optional. Password for accessing the Elasticseaerch endpoint. It must be used with `username`.|
|`delimiter` | Optional. Delimiter for Elasticsearch ID when the sink's primary key has multiple columns.|

### Notes about Elasticsearch ID

If the sink has a primary key (normally it is inherited from a materialized view), RisingWave will use the primary key as the Elasticsearch ID.
If the sink doesn't have a primary key (in the case that the materialized view is append-only), RisingWave will use the first column in the sink definition as the Elasticsearch ID.

## Data type mapping

ElasticSearch uses a mechanism called [dynamic field mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-field-mapping.html) to dynamically create fields and determine their types automatically. It treats all integer types as long and all floating-point types as float. To ensure data types in RisingWave are mapped to the data types in Elasticsearch correctly, we recommend that you specify the mapping via [index templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-templates.html) or [dynamic templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-templates.html) before creating the sink.

|RisingWave Data Type| ElasticSearch Field Type|
|--------|--------|
|boolean |boolean|
|smallint |long|
|integer |long|
|bigint |long|
|numeric |float|
|real |float|
|double precision |float|
|character varying |text|
|bytea |text|
|date |date|
|time without time zone |text|
|timestamp without time zone | text|
|timestamp with time zone |text|
|interval |text|
|struct |Not supported|
|array |array|
|JSONB |text|
