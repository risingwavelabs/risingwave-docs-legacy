---
id: delivery-overview
title: Overview of data delivery
slug: /delivery-overview
---

RisingWave supports delivering data to message brokers and databases.

Before you write data from RisingWave to a sink, you need to create a sink connection first. A sink is an external target where you can send the processed data. Use a [`CREATE SINK`](./sql/commands/sql-create-sink.md) statement to create a sink connection. You need to specify what data to be exported, the format, as well as the sink parameters.