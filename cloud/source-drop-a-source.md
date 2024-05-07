---
id: source-drop-a-source
title: Drop a source
description: Drop a source from the database.
slug: /drop-a-source
---

If you no longer require data from a source, drop the source connection to stop data consumption.

You can drop a source with one of the following methods:

- [Deleting a source on the **Source** page](#deleting-a-source-on-the-source-page)
- [Using SQL command](#using-sql-command)

## Deleting a source on the **Source** page

1. Go to [**Source**](https://cloud.risingwave.com/source/).

2. Specify the cluster and database, and log in as a database user.

    <img
    src={require('./images/source-login.png').default}
    alt="Sources page - login"
    />

3. Click the delete button on the source you want to drop and confirm the deletion.

    <img
    src={require('./images/source-delete.png').default}
    alt="Delete a source"
    />

## Using SQL command

- Use the [`DROP SOURCE`](/docs/current/sql-drop-source/) command to drop a source from the database.

- Use the [`DROP TABLE`](/docs/current/sql-drop-table/) command if it's a materialized source.
