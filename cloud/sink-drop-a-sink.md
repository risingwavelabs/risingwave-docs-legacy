---
id: sink-drop-a-sink
title: Drop a sink
description: Drop a sink from the database.
slug: /drop-a-sink
---

If you no longer need to deliver data to a sink, you can drop the sink.

You can drop a sink with one of the following methods:

- [Deleting a sink on the **Sink** page](#deleting-a-sink-on-the-sink-page)
- [Using SQL command](#using-sql-command)

## Deleting a sink on the **Sink** page

1. Go to [**Sink**](https://cloud.risingwave.com/sink/).

2. Specify the cluster and database, and log in as a database user.

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

Refer to [`DROP SINK`](/docs/current/sql-drop-sink) in the RisngWave Database documentation.
