---
id: sql-create-source
title: CREATE SOURCE
description: Supported data sources and how to connect RisingWave to the sources.
slug: /sql-create-source
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-source/" />
</head>

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the `CREATE SOURCE` command. For the full list of the sources we support, see [Supported sources](/docs/current/supported-sources-and-formats).

If you choose to persist the data from the source in RisingWave, use the `CREATE TABLE` command with connector settings. Or if you need to create the primary key (which is required by some formats like FORMAT UPSERT/DEBEZIUM), you have to use `CREATE TABLE` too. For more details, see [CREATE TABLE](sql-create-table.md).

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or data transformations.

## Syntax

```sql
CREATE SOURCE [ IF NOT EXISTS ] source_name (
    col_name data_type [ AS generation_expression ],
    ...
   [ watermark_clause ]
)
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

A [generated column](/sql/query-syntax/query-syntax-generated-columns.md) is defined with non-deterministic functions. When the data is ingested, the function will be evaluated to generate the value of this field.

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

To know when a data record is loaded to RisingWave, you can define a column that is generated based on the processing time (`<column_name> timestamptz AS proctime()`) when creating the table or source. See also [`proctime()`](/sql/functions-operators/sql-function-datetime.md#proctime).

For a source with schema from an external connector, use `*` to represent all columns from the external connector first, so that you can define a generated column on the source with an external connector. See the example below.

```sql title=Example
CREATE SOURCE from_kafka (
  *,
  gen_i32_field INT AS int32_field + 2
)
INCLUDE KEY AS some_key
WITH (
  connector = 'kafka',
  topic = 'test-rw-sink-upsert-avro',
  properties.bootstrap.server = 'message_queue:29092'
)
FORMAT upsert ENCODE AVRO (
  schema.registry = 'http://message_queue:8081'
);
```

:::note

The generated column is created in RisingWave and will not be accessed through the external connector. Therefore, if the external upstream system has a schema, it does not need to include the generated column within the table's schema in the external system.

:::

## Parameters

| Parameter| Description|
|-----------|-------------|
|*source_name*    |The name of the source. If a schema name is given (for example, `CREATE SOURCE <schema>.<source> ...`), then the table is created in the specified schema. Otherwise it is created in the current schema.|
|*col_name*      |The name of a column.|
|*data_type*|The data type of a column. With the `struct` data type, you can create a nested table. Elements in a nested table need to be enclosed with angle brackets ("\<\>"). |
|*generation_expression*| The expression for the generated column. For details about generated columns, see [Generated columns](/sql/query-syntax/query-syntax-generated-columns.md).|
|*watermark_clause*| A clause that defines the watermark for a timestamp column. The syntax is `WATERMARK FOR column_name as expr`. For details about watermarks, refer to [Watermarks](/transform/watermarks.md).|
|**INCLUDE** clause | Extract fields not included in the payload as separate columns. For more details on its usage, see [`INCLUDE` clause](/ingest/include-clause.md). |
|**WITH** clause |Specify the connector settings here if trying to store all the source data. See [Supported sources](/docs/current/supported-sources-and-formats) for the full list of supported source as well as links to specific connector pages detailing the syntax for each source. |
|**FORMAT** and **ENCODE** options |Specify the data format and the encoding format of the source data. To learn about the supported data formats, see [Supported formats](/docs/current/supported-sources-and-formats). |

:::note
Please distinguish between the parameters set in the FORMAT and ENCODE options and those set in the WITH clause. Ensure that you place them correctly and avoid any misuse.
:::

## Watermarks

RisingWave supports generating watermarks when creating a source. Watermarks are like markers or signals that track the progress of event time, allowing you to process events within their corresponding time windows. The [`WATERMARK`](/transform/watermarks.md) clause should be used within the `schema_definition`. For more information on how to create a watermark, see [Watermarks](/transform/watermarks.md).

## Change Data Capture (CDC)

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, and then delivering the changes to a downstream service in real-time.

RisingWave provides native MySQL and PostgreSQL CDC connectors. With these CDC connectors, you can ingest CDC data from these databases directly, without setting up additional services like Kafka.

If Kafka is part of your technical stack, you can also use the Kafka connector in RisingWave to ingest CDC data in the form of Kafka topics from databases into RisingWave. You need to use a CDC tool such as [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Maxwell's daemon](https://maxwells-daemon.io/) to convert CDC data into Kafka topics.

For complete step-to-step guides about ingesting MySQL and PostgreSQL data using both approaches, see [Ingest data from MySQL](/guides/ingest-from-mysql-cdc.md) and [Ingest data from PostgreSQL](/guides/ingest-from-postgres-cdc.md).

## See also

- [`DROP SOURCE`](sql-drop-source.md) — Remove a source.
- [`SHOW CREATE SOURCE`](sql-show-create-source.md) — Show the SQL statement used to create a source.
- [`ALTER SOURCE`](sql-alter-source.md) — Modify a source.
