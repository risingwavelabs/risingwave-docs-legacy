---
id: sql-create-table
title: CREATE TABLE
description: Create a table.
slug: /sql-create-table
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-table/" />
</head>

Use the `CREATE TABLE` command to create a new table or a materialized source. Tables consist of fixed columns and insertable rows. Rows can be added using the [`INSERT`](sql-insert.md) command. If creating a materialized source, be sure to include the connector settings and data format.

:::info
If you choose to not persist the data from the source in RisingWave, you should use [`CREATE SOURCE`](sql-create-source.md).
:::

## Syntax

```sql
CREATE TABLE [ IF NOT EXISTS ] table_name (
    col_name data_type [ PRIMARY KEY ],
    ...
    [ PRIMARY KEY (col_name, ... ) ]
)
[ WITH (
   connector='connector_name',
   connector_parameter='value', ...
)
ROW FORMAT data_format 
[MESSAGE 'message']
[ROW SCHEMA LOCATION 'location'] ];
```

:::note
For tables with primary key constraints, if you insert a new data record with an existing key, the new record will overwrite the existing record.
:::

:::note
Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive. See also [Identifiers](/sql/sql-identifiers.md).
:::

:::note
If creating a materialized source, remember to include the connector settings with the `WITH` clause and to specify the data format with the `ROW FORMAT` clause. See [`CREATE SOURCE`](sql-create-source.md) for a full list of supported connectors and data formats.
:::

## Parameters

| Parameter| Description|
|-----------|-------------|
|*table_name*    |The name of the table. If a schema name is given (for example, `CREATE TABLE <schema>.<table> ...`), then the table is created in the specified schema. Otherwise it is created in the current schema.|
|*col_name*      |The name of a column.|
|*data_type*|The data type of a column. With the `struct` data type, you can create a nested table. Elements in a nested table need to be enclosed with angle brackets ("<\>"). |
|**WITH** clause |Specify the connector settings here if trying to create a materialized source. See the [Data ingestion](/data-ingestion.md) page for the full list of supported source as well as links to specific connector pages detailing the syntax for each source. |
|**ROW FORMAT** clause |Specify the data format of the source data here if trying to create a materialized source. To learn about the supported data formats, see [Data formats](sql-create-source.md#supported-formats). |

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

The statement below creates a materialized source with a Kafka broker as the source.

```sql
CREATE TABLE IF NOT EXISTS source_abc (
   column1 varchar,
   column2 integer,
)
WITH (
   connector='kafka',
   topic='demo_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT JSON;
```
