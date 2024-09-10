---
id: delivery-overview
title: Overview of data delivery
slug: /delivery-overview
---

RisingWave supports delivering data to message brokers and databases.

Before you stream data out of RisingWave, you need to create a sink first. A sink is an external target that you can send data to. Use a [`CREATE SINK`](/sql/commands/sql-create-sink.md) statement to create a sink. You need to specify what data to be exported, the format, as well as the sink parameters.