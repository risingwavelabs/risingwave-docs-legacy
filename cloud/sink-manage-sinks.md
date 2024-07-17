---
id: sink-manage-sinks
title: Manage sinks
description: Manage data sinks your database connected to.
slug: /manage-sinks
---

To stream data out of RisingWave, you must create a sink. A sink refers to an external target that you can send data to. You can deliver data to downstream systems via our sink connectors.

You need to create a sink in the database to deliver processed data to an external target. After a source is connected, you can create materialized views to perform analysis or sinks for data transformations.

For the complete list of supported sink connectors and data formats, see [Data delivery](/docs/current/data-delivery/) in the RisingWave documentation.

You can create a sink with one of the following methods:

- [Use guided setup](#using-guided-setup) on the **Sink** page
- [Write SQL command](#using-sql-command) manually

## Using guided setup

1. Go to [**Sink**](https://cloud.risingwave.com/sink/).

2. Specify the project and database, and log in as a database user.

    <img
    src={require('./images/sink-login.png').default}
    alt="Sinks page - login"
    />

3. Click **Create sink**.

4. Select the service you want to connect to.

    :::note
    More services will be supported in future releases.
    :::

5. Configure the connector settings in the **Create sink** tab.

6. Configure the data settings in the **Sink details** tab.

  **Sink from**: You can sink data from a custom SQL query or an existing table / materialized view.

  **Format**: For details on data format, see [Data delivery](/docs/current/data-delivery/).
  
7. Check the generated SQL statement and click **Confirm** to create the sink in your database.

    <img
    src={require('./images/sink-create-kafka-3.png').default}
    alt="Create sink - Kafka - step 3"
    />

## Using SQL command

Refer to [`CREARE SINK`](/docs/current/sql-create-sink) in the RisingWave Database documentation.

If you no longer need to deliver data to a sink, you can drop the sink.

You can drop a sink with one of the following methods:

- [Deleting a sink on the **Sink** page](#deleting-a-sink-on-the-sink-page)
- [Using SQL command](#using-sql-command)

## Deleting a sink on the **Sink** page

1. Go to [**Sink**](https://cloud.risingwave.com/sink/).

2. Specify the project and database, and log in as a database user.

    <img
    src={require('./images/sink-login.png').default}
    alt="Sinks page - login"
    />

3. Click the delete button on the sink you want to drop and confirm the deletion.

    <img
    src={require('./images/sink-delete.png').default}
    alt="Delete a sink"
    />

## Using SQL command

Refer to [`DROP SINK`](/docs/current/sql-drop-sink) in the RisingWave Database documentation.
