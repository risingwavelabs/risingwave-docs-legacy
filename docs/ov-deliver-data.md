---
id: ov-deliver-data
title: Deliver data
description: Describes where you can deliver data to
slug: /ov-deliver-data
---

You can deliver data in RisingWave to external systems such as databases via Kafka topics. As RisingWave can act as a data source, you can connect RisingWave to various business intelligence tools to analyze and visualize the data.

Before you can write data in RisingWave to Kafka topics, you need to create a sink. A sink is an external target that you can send data to. By creating a sink, you establish a connection with the target. You can create a sink by using the `CREATE SINK` statement. 

To learn about the syntax and parameters, see [CREATE SINK](../docs/sql/commands/sql-create-sink.md).

To see how you can connect RisingWave to Superset, see [Integration with Apache Superset](../docs/superset-integration.md).