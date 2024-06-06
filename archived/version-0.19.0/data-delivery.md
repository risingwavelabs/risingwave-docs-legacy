---
id: data-delivery
title: Overview of data delivery
slug: /data-delivery
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-delivery/" />
</head>

RisingWave supports delivering data to downstream systems via its sink connectors.

To stream data out of RisingWave, you must create a sink. A sink is an external target that you can send data to. Use the [`CREATE SINK`](/sql/commands/sql-create-sink.md) statement to create a sink. You need to specify what data to be exported, the format, and the sink parameters. 

Currently, RisingWave supports the following sink connectors:

- Kafka sink connector (`connector = 'kafka'`)
  
  With this connector, you can sink data from RisingWave to Kafka topics. For details about the syntax and parameters, see [Sink data to Kafka](guides/create-sink-kafka.md).

- JDBC sink connector (`connector = 'jdbc'`)

  With this connector, you can sink data from RisingWave to JDBC-available databases, such as MySQL or PostgreSQL. When sinking to a database with a JDBC driver, ensure that the corresponding table created in RisingWave has the same schema as the table in the database you are sinking to. For details about the syntax and parameters, see [Sink to MySQL](/guides/sink-to-mysql.md) or [Sink to PostgreSQL](/guides/sink-to-postgres.md).

- Iceberg sink connector (`connector = 'iceberg'`)
  
  With this connector, you can sink data from RisingWave to Apache Iceberg. For details about the syntax and parameters, see [Sink data to Apache Iceberg](/guides/sink-to-iceberg.md).

For each sink, you can specify the data format. All sinks supports the `upsert` and `append-only` formats while Kafka also supports the `debezium` format. When creating an `upsert` sink, note whether or not you need to specify the primary key in the following situations.

- If the downstream system supports primary keys and the table in the downstream system has a primary key, then RisingWave does not allow users to define a primary key when creating an upsert sink.

- If the downstream system supports primary keys but the table in the downstream system has no primary key, then RisingWave does not allow users to create an upsert sink. A primary key must be defined in the table in the downstream system.

- If the downstream system does not support primary keys, then users must define the primary key when creating an upsert sink.
