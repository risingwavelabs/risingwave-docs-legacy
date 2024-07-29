---
id: sink-manage-sinks
title: Manage sinks
description: Manage data sinks your database connected to.
slug: /manage-sinks
---

To stream data out of RisingWave, you must create a sink. A sink refers to an external target that you can send data to. You can deliver data to downstream systems via our sink connectors.

For the complete list of supported sink connectors and data formats, see [Data delivery](/docs/current/data-delivery/) in the RisingWave documentation.

## Create a sink

 You can create a sink using SQL command to deliver processed data to an external target.

Refer to [`CREATE SINK`](/docs/current/sql-create-sink) in the RisingWave Database documentation.

## Check a sink

1. Go to [**Project**](https://cloud.risingwave.com/project/home/).

2. Specify the project and click its **Workspace**.

3. Click **Sink** tab to view sinks.

## Drop a sink

If you no longer need to deliver data to a sink, you can drop the sink using SQL command.

Refer to [`DROP SINK`](/docs/current/sql-drop-sink) in the RisingWave Database documentation.
