---
id: sink-to-elasticsearch
title: Sink data from RisingWave to Elasticsearch
description: Sink data from RisingWave to Elasticsearch.
slug: /sink-to-elasticsearch 
---
You can deliver the data that has been ingested and transformed in RisingWave to Elasticsearch to serve searches or analytics.

This guide describes how to sink data from RisingWave to Elasticsearch using the Elasticsearch sink connector in RisingWave.

[Elasticsearch](https://www.elastic.co/elasticsearch/) is a distributed, RESTful search and analytics engine capable of addressing a growing number of use cases. It centrally stores your data for lightning-fast search, fine‑tuned relevancy, and powerful analytics that scale with ease.

:::note Beta Feature
The Elasticsearch sink connector in RisingWave is currently a Beta feature that supports only versions 7.x and 8.x of Elasticsearch. Please contact us if you encounter any issues or have feedback.
:::

:::note

The Elasticsearch sink connector in RisingWave provides at-least-once delivery semantics. Events may be redelivered in case of failures.

:::

## Prerequisites

- Ensure the Elasticsearch cluster (version 7.x or 8.x) is accessible from RisingWave.

- If you are running RisingWave locally from binaries, make sure that you have [JDK 11](https://openjdk.org/projects/jdk/11/) or later versions installed in your environment.

## Create an Elasticsearch sink

Use the following syntax to create an Elasticsearch sink. Once a sink is created, any insert or update to the sink will be streamed to the specified Elasticsearch endpoint.

```sql
CREATE SINK sink_name
[ FROM sink_from | AS select_query ]
WITH (
  connector = 'elasticsearch',
  primary_key = '<primary key of the sink_from object>',
  [ index = '<your Elasticsearch index>' | index_column = '<your index column>'],
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
|`primary_key` |Optional. The primary keys of the sink. If the primary key has multiple columns, set a delimiter in the `delimiter` parameter below to join them. |
| `index`         |Required if `index_column` is not set. Name of the Elasticsearch index that you want to write data to. |
| `index_column`  |This parameter enables you to create a sink that writes to multiple indexes dynamically. The sink decides which index to write to based on a column. It is mutually exclusive with the parameter `index`. Only one of them **can and must** be set. When `index` is set, the write index of Elasticsearch is index. When `index_column` is set, the index of Elasticsearch is the value of this column. Note that the column corresponding to `index_column` must be the `string` type, and since Elasticsearch sink defaults to the first column as key, it is not recommended to place this column in the first column.|
| `url`          | Required. URL of the Elasticsearch REST API endpoint.|
| `username`        | Optional. `elastic` user name for accessing the Elasticsearch endpoint. It must be used with `password`.|
| `password`       | Optional. Password for accessing the Elasticseaerch endpoint. It must be used with `username`.|
|`delimiter` | Optional. Delimiter for Elasticsearch ID when the sink's primary key has multiple columns.|

:::note
For versions under 8.x, there was once a parameter `type`. In Elasticsearch 6.x, users could directly set the type, but starting from 7.x, it is set to not recommended and the default value is unified to '_doc.' In version 8.x, the type has been completely removed. See [Elasticsearch's official documentation](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/removal-of-types.html) for more details.

So, if you are using Elasticsearch 7.x, we set it to the official's recommended value, which is '_doc'. If you are using Elasticsearch 8.x, this parameter has been removed by the Elasticsearch official, so no setting is required.
:::

### Notes about primary keys and Elasticsearch IDs

The Elasticsearch sink defaults to the `upsert` sink type. It does not support the `append-only` sink type.

If you want to customize your Elasticsearch ID, please specify it via the `primary_key` parameter. RisingWave will combine multiple primary key values into a single string with the delimiter you set, and use it as the Elasticsearch ID.

If you don't want to customize your Elasticsearch ID, RisingWave will use the first column in the sink definition as the Elasticsearch ID.

## Data type mapping

ElasticSearch uses a mechanism called [dynamic field mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-field-mapping.html) to dynamically create fields and determine their types automatically. It treats all integer types as long and all floating-point types as float. To ensure data types in RisingWave are mapped to the data types in Elasticsearch correctly, we recommend that you specify the mapping via [index templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-templates.html) or [dynamic templates](https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-templates.html) before creating the sink.

|RisingWave Data Type| ElasticSearch Field Type|
|--------|--------|
|boolean |boolean|
|smallint |long|
|integer |long|
|bigint |long|
|numeric |text|
|real |float|
|double precision |float|
|character varying |text|
|bytea |text|
|date |date|
|time without time zone |text|
|timestamp without time zone | text|
|timestamp with time zone |text|
|interval |text|
|struct |object|
|array |array|
|JSONB|object (RisingWave's Elasticsearch sink will send JSONB as a JSON string, and Elasticsearch will convert it into an object)|

:::note
Elasticsearch doesn't require users to explicitly `CREATE TABLE`. Instead, it infers the schema on-the-fly based on the first record ingested. For example, if a record contains a jsonb '{v1: 100}', v1 will be inferred as a long type. However, if the next record is '{v1: "abc"}', the ingestion will fail because "abc" is inferred as a string and the two types are incompatible.

This behavior should be noted, or your data may be less than it should be. In terms of monitoring, you can check out Grafana, where there is a panel for all sink write errors.
:::
