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

| **Parameter Name**              | **Description**    |
|--------------------------------|------------------|
| `mongodb.url`                   | The URL of MongoDB.  |
| `type`                        | Defines the type of the sink. Options include `append-only` or `upsert`.  |
| `collection.name`               | The collection name where data should be written to or read from. For sinks, the format is `db_name.collection_name`. Data can also be written to dynamic collections; see `collection.name.field` below for more information.   |
| `collection.name.field`         | Optional. The dynamic collection name where data should be sunk to. If specified, the field value will be used as the collection name. The collection name format is the same as `collection.name`. If the field value is null or an empty string, then the `collection.name` will be used as a fallback destination.        |
| `collection.name.field.drop`    | Optional. Controls whether the field value of `collection.name.field` should be dropped when sinking. Set this option to `true` to avoid the duplicate values of `collection.name.field` being written to the result collection.  |
| `mongodb.bulk_write.max_entries` | Optional. The maximum entries that will accumulate before performing the bulk write. Defaults to 1024. Default value is `1024`.  |

## Data type mapping

| **MongoDB Type**      | **RisingWave Type**           |
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

Below are some use cases for your reference.

### Sink data with append-only

To create a sink with the append-only type:

```sql
CREATE sink t1_sink FROM t1
WITH (
    connector='mongodb',
    type = 'append-only',
    mongodb.url = 'mongodb://mongodb:27017/?replicaSet=rs0',
    collection.name = 'demo.t1'
);
```

In append-only mode, MongoDB will automatically generate an `_id` field for each record, typically with a value of the [`ObjectId`](https://www.mongodb.com/docs/manual/reference/method/ObjectId/) type. This is necessary because `_id` is the primary key in MongoDB.

### Sink data with upsert

To create a sink with the upsert type for a table with a single key:

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

Assuming the schema of `t2` is:
| name  | type | pk  |
|-------|------|-----|
| id    | int  | ✔   |
| value | text |     |

Given the record:
| id | value   |
|----|---------|
| 1  | 'example of record' |

The record written to MongoDB will be:

```json
{ "_id": 1, "id": 1, "value": "example of record" }
```

:::note
No redundant `id` field will exist if the primary key of `t2` is `_id`.
:::

To create a sink with the upsert type for a table with a compound key:

```sql title="compound key"
CREATE TABLE t3(
    a int,
    b int,
    value text,
    primary key (a, b)
);

insert into t3 values(1, 2, 'abc');

CREATE sink t3_sink FROM t3
WITH (
    connector='mongodb',
    type = 'upsert',
    mongodb.url = 'mongodb://mongodb:27017/?replicaSet=rs0',
    collection.name = 'demo.t3',
    primary_key='a,b'
);
```

The record written to MongoDB will be:

```json
{ "_id": { "a": 1, "b": 2 }, "a": 1, "b": 2, "value": "abc" }
```

### Dynamic collection name

Dynamic collection names are useful in certain scenarios. For example, a multi-tenant application may store its data using sharding, where `tenant_id` is included as a prefix in the collection name, such as `sharding_2024_01.tenant1_order`. This approach offers more flexibility and enables efficient data organization and retrieval based on specific tenant requirements.

To use a dynamic collection name:

```sql
CREATE sink t2_sink FROM t2
WITH (
    connector='mongodb',
    type = 'upsert',
    mongodb.url = 'mongodb://mongodb:27017/?replicaSet=rs0',
    collection.name = 'demo.t2',
    collection.name.field = 'collection_name',
    collection.name.field.drop = 'true',
    primary_key='_id'
);
```

- `collection.name`: Serve as a fallback collection name if the value of `collection.name.field` is empty or null. In this case, it defaults to `demo.t2`.

- `collection.name.field`: Specify the field used for the collection name. This field must be of type `varchar`.

- `collection.name.field.drop`: When set to `true`, it avoids duplicate values of `collection.name.field` in the result collection.
