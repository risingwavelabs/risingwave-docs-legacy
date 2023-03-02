---
id: delivery-overview
title: Overview of data delivery
slug: /delivery-overview
---

RisingWave supports delivering data to message brokers and databases.

Before you stream data out of RisingWave, you must create a sink first. A sink is an external target that you can send data to. Use the [`CREATE SINK`](/sql/commands/sql-create-sink.md) statement to create a sink. You need to specify what data to be exported, the format, and the sink parameters. 

RisingWave provides a JDBC sink connector, with which you can sink data from RisingWave to JDBC-available databases, such as MySQL or PostgreSQL. When sinking to a database with a JDBC driver, ensure that the corresponding table created in RisingWave has the same schema as the table in the database you are sinking to. You can sink to a JDBC-available database by using a [`CREATE SINK`](/sql/commands/sql-create-sink.md) statement and specifying the connector as `jdbc`, the `jdbc_url`, and the sink table name.
