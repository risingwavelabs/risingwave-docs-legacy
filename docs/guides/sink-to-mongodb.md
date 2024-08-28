---
id: sink-to-mongodb
title: Sink data from RisingWave to MongoDB
description: Sink data from RisingWave to MongoDB.
slug: /sink-to-mongodb
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-mongodb/" />
</head>

This guide describes how to sink data from RisingWave to MongoDB. MongoDB is a document database designed for ease of application development and scaling. For more information, see [MongoDB](https://www.mongodb.com/).

:::info Public Preview
This feature is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

## Prerequisites

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='mongodb',
   connector_parameter = 'value', ...
);
```

## Parameters

| **Parameter Name**              | **Description**                                                                                                                                                                                                                                                                                                                                                                          |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `mongodb.url`                   | The URL of MongoDB.                                                                                                                                                                                                                                                                                                                                                                         |
| `collection.name`               | The collection name where data should be written to or read from. For sinks, the format is `db_name.collection_name`. Data can also be written to dynamic collections; see `collection.name.field` for more information.                                                                                                          |
| `r#type`                        |                                                                                                                                                                                                                                                                                                                                                                                             |
| `collection.name.field`         | Optional. The dynamic collection name where data should be sunk to. If specified, the field value will be used as the collection name. The collection name format is the same as `collection.name`. If the field value is null or an empty string, then the `collection.name` will be used as a fallback destination.        |
| `collection.name.field.drop`    | Optional. Controls whether the field value of `collection.name.field` should be dropped when sinking. Set this option to `true` to avoid the duplicate values of `collection.name.field` being written to the result collection.                                                                                             |
| `mongodb.bulk_write.max_entries` | Optional. The maximum entries that will accumulate before performing the bulk write. Defaults to 1024. Default value is `1024`.                                                                                                                                                                                                                                                  |

## Data type mapping

| **MongoDB Type**      | **Risingwave Type**           |
|-----------------------|-------------------------------|
| Boolean               | BOOLEAN                       |
| 32-bit integer        | SMALLINT                      |
| 32-bit integer        | INTEGER                       |
| 64-bit integer        | BIGINT                        |
| Double                | REAL                          |
| Double                | DOUBLE                        |
| Decimal128            | DECIMAL                       |
| String                | DATE                          |
| String                | VARCHAR                       |
| String                | TIME                          |
| Date                  | TIMESTAMP WITHOUT TIME ZONE   |
| Date                  | TIMESTAMP WITH TIME ZONE      |
| String                | INTERVAL                       |
| Object                | STRUCT                        |
| Array                 | ARRAY                         |
| Binary data           | BYTEA                         |
| Object                | JSONB                         |
| 64-bit integer        | SERIAL                        |

## Examples

### Sink data with append-only

```sql
CREATE sink t1_sink FROM t1
WITH (
    connector='mongodb',
    type = 'append-only',
    mongodb.url = 'mongodb://mongodb:27017/?replicaSet=rs0',
    collection.name = 'demo.t1'
);
```

### Sink data with upsert

```sql title="single key"
CREATE sink t2_sink FROM t2
WITH (
    connector='mongodb',
    type = 'upsert',
    mongodb.url = 'mongodb://mongodb:27017/?replicaSet=rs0',
    collection.name = 'demo.t2',
    primary_key='id'
);
```