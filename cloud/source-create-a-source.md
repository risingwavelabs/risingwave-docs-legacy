---
id: source-create-a-source
title: Create a source
description: Create a source in the database to read external data.
slug: /create-a-source
---

You need to create a source in the database to read external data. After a source is connected, you can create materialized views to perform analysis or sinks for data transformations.

For the complete list of supported sources and formats, see [Supported sources and formats](/docs/current/sql-create-source/#supported-sources).

You can create a source with one of the following methods:

- [Use guided setup](#using-guided-setup) on the **Source** page
- [Write SQL command](#using-sql-command) manually

## Using guided setup

1. Go to [**Source**](https://cloud.risingwave.com/source/).

2. Specify the cluster and database, and log in as a database user.

    <img
    src={require('./images/source-login.png').default}
    alt="Sources page - login"
    />

3. Click **Create source**.

4. Select the service you want to connect to.

    :::note
    More services will be supported in future releases.
    :::

5. Configure the connector settings, source details, and schema according to the instuctions of the guided setup.

6. Check the generated SQL statement and click **Confirm** to create the source in your database.

    <img
    src={require('./images/source-create-kafka-4.png').default}
    alt="Create source - Kafka - step 4"
    />

## Using SQL command

Refer to [`CREARE SOURCE`](/docs/current/sql-create-source/#supported-sources) in the RisngWave documentation. Select a connector to see the SQL syntax, options, and sample statement of connecting RisingWave to the connector.
