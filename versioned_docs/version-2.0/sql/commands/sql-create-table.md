---
id: sql-create-table
title: CREATE TABLE
description: Create a table.
slug: /sql-create-table
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-table/" />
</head>

Use the `CREATE TABLE` command to create a new table. Tables consist of fixed columns and insertable rows. Rows can be added using the [`INSERT`](sql-insert.md) command. When creating a table, you can specify connector settings and data format.

:::info
If you choose not to persist the data from the source in RisingWave, use [`CREATE SOURCE`](sql-create-source.md) instead.
:::

## Syntax

```sql
CREATE TABLE [ IF NOT EXISTS ] table_name (
    col_name data_type [ PRIMARY KEY ] [ DEFAULT default_expr ] [ AS generation_expression ],
    ...
    [ PRIMARY KEY (col_name, ... ) ]
    [ watermark_clause ]
)
[ APPEND ONLY ]
[ ON CONFLICT conflict_action ]
[INCLUDE { header | key | offset | partition | timestamp } [AS <column_name>]]
[ WITH (
    connector='connector_name',
    connector_parameter='value', ...)]
[FORMAT data_format ENCODE data_encode [ (
    message='message',
    schema.location='location', ...) ]
];
```

## Notes

For tables with primary key constraints, if you insert a new data record with an existing key, the new record will overwrite the existing record.

A [generated column](/sql/query-syntax/query-syntax-generated-columns.md) that is defined with non-deterministic functions cannot be specified as part of the primary key. For example, if `A1` is defined as `current_timestamp()`, then it cannot be part of the primary key.

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

The syntax for creating a table with connector settings and the supported connectors are the same as for creating a source. See [`CREATE SOURCE`](sql-create-source.md) for a full list of supported connectors and data formats.

To know when a data record is loaded to RisingWave, you can define a column that is generated based on the processing time (`<column_name> timestamptz AS proctime()`) when creating the table or source. See also [`proctime()`](/sql/functions-operators/sql-function-datetime.md#proctime).

For a table with schema from external connector, use `*` to represent all columns from the external connector first, so that you can define a generated column on table with an external connector. See the example below.

```sql title=Example
CREATE TABLE from_kafka (
  *,
  gen_i32_field INT AS int32_field + 2,
  PRIMARY KEY (some_key)
)
INCLUDE KEY AS some_key
[INCLUDE { header | offset | partition | timestamp } [AS <column_name>]]
WITH (
  connector = 'kafka',
  topic = 'test-rw-sink-upsert-avro',
  properties.bootstrap.server = 'message_queue:29092'
)
FORMAT upsert ENCODE AVRO (
  schema.registry = 'http://message_queue:8081'
);
```

## Parameters

| Parameter or clause | Description|
|-----------|-------------|
|`table_name`    |The name of the table. If a schema name is given (for example, `CREATE TABLE <schema>.<table> ...`), then the table is created in the specified schema. Otherwise it is created in the current schema.|
|`col_name`      |The name of a column.|
|`data_type`|The data type of a column. With the `struct` data type, you can create a nested table. Elements in a nested table need to be enclosed with angle brackets (`<>`). |
|`DEFAULT`|The `DEFAULT` clause allows you to assign a default value to a column. This default value is used when a new row is inserted, and no explicit value is provided for that column. `default_expr` is any constant value or variable-free expression that does not reference other columns in the current table or involve subqueries. The data type of `default_expr` must match the data type of the column.|
|`generation_expression`| The expression for the generated column. For details about generated columns, see [Generated columns](/sql/query-syntax/query-syntax-generated-columns.md).|
|`watermark_clause`| A clause that defines the watermark for a timestamp column. The syntax is `WATERMARK FOR column_name as expr`. For the watermark clause to be valid, the table must be an append-only table. That is, the `APPEND ONLY` option must be specified. This restriction only applies to a table. For details about watermarks, refer to [Watermarks](/transform/watermarks.md).|
|`APPEND ONLY` | When this option is specified, the table will be created as an append-only table. An append-only table cannot have primary keys. `UPDATE` and `DELETE` statements are not valid for append-only tables. Note that append-only tables is in the [public preview stage](/product-lifecycle/#features-in-the-public-preview-stage). |
|`ON CONFLICT` | Specify the alternative action when the newly inserted record brings a violation of PRIMARY KEY constraint on the table. See [PK conflict behavior](#pk-conflict-behavior) below for more information. |
|**INCLUDE** clause | Extract fields not included in the payload as separate columns. For more details on its usage, see [`INCLUDE` clause](/ingest/include-clause.md). |
|**WITH** clause |Specify the connector settings here if trying to store all the source data. See the [Data ingestion](/ingest/data-ingestion.md) page for the full list of supported source as well as links to specific connector pages detailing the syntax for each source. |
|**FORMAT** and **ENCODE** options |Specify the data format and the encoding format of the source data. To learn about the supported data formats, see [Data formats](sql-create-source.md#supported-formats). |

:::note
Please distinguish between the parameters set in the FORMAT and ENCODE options and those set in the WITH clause. Ensure that you place them correctly and avoid any misuse.
:::

## Watermarks

RisingWave supports generating watermarks when creating an append-only streaming table. Watermarks are like markers or signals that track the progress of event time, allowing you to process events within their corresponding time windows. For more information on the syntax on how to create a watermark, see [Watermarks](/transform/watermarks.md).

## PK conflict behavior

The record with insert operation could introduce duplicate records with the same primary key in the table. In that case, an alternative action specified by the `ON CONFLICT` clause will be adopted. The record can come from Insert DML statement, external connectors of the table, or sinks into the table [`CREATE SINK INTO`](sql-create-sink-into.md).

The action could one of the following. A column not in the primary key can be specified as the version column for `DO UPDATE FULL` and `DO UPDATE IF NOT NULL`. When version column is specified, the insert operation will take effect only when the newly inserted value is greater or equal than the exist data record in the table's specified column.

- `IGNORE`: Ignore the newly inserted record.
- `DO UPDATE FULL [WITH VERSION COLUMN(col_name)]`: Replace the existing row in the table. When version column is specified, the existing row will be replaced only when the newly inserted value is greater or equal than the existing data record in the table's specified column.
- `DO UPDATE IF NOT NULL [WITH VERSION COLUMN(col_name)]`: Only replace those fields which is not NULL in the inserted row. If version column is specified but the inserted row's version field is NULL, the version column will not take effect.

:::info Public Preview
`VERSION COLUMN` is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

:::note
The delete and update operation on the table cannot break the primary key constraint on the table, so the option will not take effect for those cases.
:::

:::note
When `DO UPDATE IF NOT NULL` behavior is applied, `DEFAULT` clause is not allowed on the table's columns.
:::

## Examples

The statement below creates a table that has three columns.

```sql
CREATE TABLE taxi_trips(
    id VARCHAR,
    distance DOUBLE PRECISION,
    city VARCHAR
);
```

The statement below creates a table that includes nested tables.

```sql
CREATE TABLE IF NOT EXISTS taxi_trips(
    id VARCHAR,
    distance DOUBLE PRECISION,
    duration DOUBLE PRECISION,
    fare STRUCT<
      initial_charge DOUBLE PRECISION,
      subsequent_charge DOUBLE PRECISION,
      surcharge DOUBLE PRECISION,
      tolls DOUBLE PRECISION>);
```

The statement below creates a table with a Kafka broker as the source.

```sql
CREATE TABLE IF NOT EXISTS table_abc (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000',
) FORMAT PLAIN ENCODE JSON;
```
