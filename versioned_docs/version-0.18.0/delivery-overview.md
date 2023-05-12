---
id: delivery-overview
title: Overview of data delivery
slug: /delivery-overview
---

RisingWave supports delivering data to downstream systems via its sink connectors.

To stream data out of RisingWave, you must create a sink first. A sink is an external target that you can send data to. Use the [`CREATE SINK`](/sql/commands/sql-create-sink.md) statement to create a sink. You need to specify what data to be exported, the format, and the sink parameters. 

Currently, RisingWave supports two sink connectors:

- Kafka sink connector (`connector = 'kafka'`)
  With this connector, you can sink data from RisingWave to Kafka topics. For details about the syntax and parameters, see [Sink data to Kafka](/guides/create-sink-kafka.md).

- JDBC sink connector (`connector = 'jdbc'`)
  With this connector, you can sink data from RisingWave to JDBC-available databases, such as MySQL or PostgreSQL. When sinking to a database with a JDBC driver, ensure that the corresponding table created in RisingWave has the same schema as the table in the database you are sinking to. For details about the syntax and parameters, see [Create a JDBC sink](/guides/sink-to-mysql.md#create-a-sink).

