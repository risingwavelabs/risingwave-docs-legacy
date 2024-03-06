---
id: sink-to-cassandra
title: Sink data from RisingWave to Cassandra or ScyllaDB
description: Sink data from RisingWave to Cassandra or ScyllaDB.
slug: /sink-to-cassandra
---
You can sink data from RisingWave to [Cassandra](https://cassandra.apache.org/). As [ScyllaDB](https://www.scylladb.com/) can work as a drop-in replacement for Cassandra, it means you can sink data from RisingWave to ScyllaDB as well.

This guide describes how to sink data from RisingWave to Cassandra or ScyllaDB using the Cassandra sink connector in RisingWave.

:::note Beta Feature
The Cassandra sink connector in RisingWave is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

## Prerequisites

- Ensure your Cassandra or ScyllaDB cluster is accessible from RisingWave.

- If you are running RisingWave locally from binaries and intend to use the native CDC source connectors or the JDBC sink connector, make sure that you have [JDK 11](https://openjdk.org/projects/jdk/11/) or later versions is installed in your environment.

## Syntax

To sink data to Cassandra or ScyllaDB, create a Cassandra sink in RisingWave using the syntax below:

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
    connector='cassandra',
    type='<type>',
    cassandra.url = '<node1>,<node2>,<node3>',
    cassandra.keyspace = '<keyspace>',
    cassandra.table = '<cassandra_table>',
    cassandra.datacenter = '<data_center>'
);
```

Once the sink is created, data changes will be streamed to the specified table.

## Parameters

| Parameter Names       | Description |
| --------------------- | ---------------------------------------------------------------------- |
|*sink_name*| Name of the sink to be created.|
|*sink_from*| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or *select_query* query must be specified.|
|AS *select_query*| A `SELECT` query that specifies the data to be output to the sink. Either this query or a *sink_from* clause must be specified. See [SELECT](/sql/commands/sql-select.md) for the syntax and examples of the `SELECT` command.|
| `type`                | Required. Specify if the sink should be `upsert` or `append-only`. If creating an `upsert` sink, you must specify a primary key.|
| `primary_key`          | Optional. A string of a list of column names, separated by commas, that specifies the primary key of the Cassandra sink.|
|`force_append_only`| If `true`, forces the sink to be `append-only`, even if it cannot be.|
| `cassandra.url`        | Required. The URL or IP address of the Cassandra or ScyllaDB cluster or node you want to connect to.|
| `cassandra.keyspace`       | Required. The name of the keyspace within the Cassandra database or ScyllaDB where you want to store the data. A keyspace is a logical container for organizing data in Cassandra.|
| `cassandra.table`   | Required. The name of the table in the specified keyspace where you want to insert or update the data.|
| `cassandra.datacenter`  | Optional. If you are working with a multi-data center Cassandra setup, you may need to specify the name of the target data center where the data should be written.|

:::note

The Cassandra sink in RisingWave provides at-least-once delivery semantics. Events may be redelivered in case of failures. We recommend using the `upsert` sink type to avoid duplicates.

:::

## Data type mapping - RisingWave and Cassandra

|RisingWave Data Type | Cassandra Data Type|
|-----|-----|
|boolean | boolean |
|smallint | smallint |
|integer |int|
|bigint |bigint|
|numeric |double|
|real |float|
|double precision |double|
|character varying (varchar) |text|
|bytea |blob|
|date |date|
|time without time zone |time|
|timestamp without time zone |unsupported. You need to convert `timestamp` to `timestamptz` in RisingWave before sinking.|
|timestamp with time zone |timestamp|
|interval |duration|
|struct |unsupported|
|array |unsupported|
|JSONB |unsupported|
