---
id: source-manage-sources
title: Manage sources
description: Manage data sources your database connected to.
slug: /manage-sources
---

To ingest data into RisingWave, you must first create a source. A source refers to an external data feed that RisingWave can read from. You can connect RisingWave to a variety of external sources like databases and message brokers. After a source is connected, you can create materialized views to perform analysis or sinks for data transformations.

For the complete list of supported sources and formats, see [Supported sources and formats](/docs/current/sql-create-source/#supported-sources).

## Create a source

You can create a source with one of the following methods:

### Using guided setup

1. Go to [**Project**](https://cloud.risingwave.com/project/home/).

2. Specify the project and click its **Workspace**.

3. Next to **Source** tab, click **+ Add new**.

4. Select the service you want to connect to.

    :::note
    More services will be supported in future releases.
    :::

5. Configure the connector settings, source details, and schema according to the instructions of the guided setup.

6. Check the generated SQL statement and click **Confirm** to create the source in your database.

### Using SQL command

Refer to [`CREARE SOURCE`](/docs/current/sql-create-source/#supported-sources) in the RisingWave documentation. Select a connector to see the SQL syntax, options, and sample statement of connecting RisingWave to the connector.

## Check a source

Click on a source to view its details, including the connector settings, schema, throughput, errors, and running status.

:::tip

When checking throughput and errors, you can click **Last 30 minutes** on the right side to customize your time range.

:::

## Drop a source

If you no longer require data from a source, drop the source connection with one of the following methods to stop data consumption.

### Using guided step

1. Go to **Source**.

2. Click the delete button on the source you want to drop and confirm the deletion.

### Using SQL command

- Use the [`DROP SOURCE`](/docs/current/sql-drop-source/) command to drop a source from the database.

- Use the [`DROP TABLE`](/docs/current/sql-drop-table/) command if it's a materialized source.
