---
id: sink-to-opensearch
title: Sink data from RisingWave to OpenSearch
description: Sink data from RisingWave to OpenSearch.
slug: /sink-to-opensearch
---

This guide describes how to sink data from RisingWave to OpenSearch using the OpenSearch sink connector in RisingWave.

OpenSearch is the flexible, scalable, open-source way to build solutions for data-intensive applications. For more information about OpenSearch, see [OpenSearch official website](https://opensearch.org/).

## Prerequisites

xx

## Create an OpenSearch sink

Use the following syntax to create an OpenSearch sink. Once a sink is created, any insert or update to the sink will be streamed to the specified OpenSearch endpoint.

```sql
CREATE SINK sink_name
[ FROM sink_from | AS select_query ]
WITH (
  connector = 'opensearch',
  primary_key = '<primary key of the sink_from object>',
  { index = '<your opensearch index>' | index_column = '<your index column>' },
  url = 'http://<opensearch hostname>:<opensearch port>',
  username = '<your opensearch username>',
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
| `index`         |Required if `index_column` is not set. Name of the OpenSearch index that you want to write data to. |
| `index_column`  |This parameter enables you to create a sink that writes to multiple indexes dynamically. The sink decides which index to write to based on a column. It is mutually exclusive with the parameter `index`. Only one of them **can and must** be set. When `index` is set, the write index of OpenSearch is `index`. When `index_column` is set, the index of OpenSearch is the value of this column, which must be the `string` type. Since OpenSearch sink defaults to the first column as the key, it is not recommended to place this column as the first column.|
| `url`          | Required. URL of the OpenSearch REST API endpoint.|
| `username`        | Optional. `opensearch` user name for accessing the OpenSearch endpoint. It must be used with `password`.|
| `password`       | Optional. Password for accessing the OpenSearch endpoint. It must be used with `username`.|
|`delimiter` | Optional. Delimiter for OpenSearch ID when the sink's primary key has multiple columns.|

## Notes about primary keys and OpenSearch IDs

The OpenSearch sink defaults to the `upsert` sink type. It does not support the `append-only` sink type.

To customize your OpenSearch ID, specify it via the `primary_key` parameter. RisingWave will combine multiple primary key values into a single string with the delimiter set, and use it as the OpenSearch ID.

If you don't want to customize your OpenSearch ID, RisingWave will use the first column in the sink definition as the OpenSearch ID.

## Data type mapping

OpenSearch uses a mechanism called [dynamic field mapping](https://opensearch.org/docs/latest/field-types/#dynamic-mapping) to dynamically create fields and determine their types automatically. It treats all integer types as long and all floating-point types as float. To ensure data types in RisingWave are mapped to the data types in OpenSearch correctly, we recommend that you specify the mapping via [index templates](https://opensearch.org/docs/latest/im-plugin/index-templates/).

|RisingWave Data Type| OpenSearch Field Type|
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
|JSONB|object (RisingWave's OpenSearch sink will send JSONB as a JSON string, and OpenSearch will convert it into an object)|

:::note
OpenSearch doesn't require users to explicitly `CREATE TABLE`. Instead, it infers the schema on-the-fly based on the first record ingested. For example, if a record contains a jsonb '{v1: 100}', v1 will be inferred as a long type. However, if the next record is '{v1: "abc"}', the ingestion will fail because "abc" is inferred as a string and the two types are incompatible.

This behavior may lead to missing records. For monitoring, see Grafana, where there is a panel for all sink write errors.
:::
