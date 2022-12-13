---
id: ov-deliver-data
title: Deliver data
description: Targets that you can deliver data to.
slug: /ov-deliver-data
---

RisingWave supports delivering data to Kafka or Redpanda. As RisingWave can act as a data source, you can connect RisingWave to various business intelligence tools to analyze and visualize the data.

Before you can write data in RisingWave to Kafka or Redpanda, you need to create a sink in RisingWave, and set up a topic in Kafka or Redpanda. A sink is an external target that you can send data to. By creating a sink, you establish a connection with the target. To create a sink, you need to use the `CREATE SINK` statement and, in the statement, specify what data to be exported, the format, as well as the broker and topic parameters.

To learn about the syntax and parameters, see [CREATE SINK](../docs/sql/commands/sql-create-sink.md).

To see how you can connect RisingWave to Superset, see [Integration with Apache Superset](../docs/superset-integration.md).