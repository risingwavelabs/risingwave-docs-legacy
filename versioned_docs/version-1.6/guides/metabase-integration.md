---
id: metabase-integration
title: Connect Metabase to RisingWave
description: Connect Metabase to RisingWave.
slug: /metabase-integration
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/metabase-integration/" />
</head>

Metabase is an open-source business intelligence tool that lets you visualize and share data insights. It provides an easy way to create charts, dashboards, and metrics on top of databases.

Since RisingWave is compatible with PostgreSQL, you can connect Metabase to RisingWave as a data source and build analytics on streaming data.

## Prerequisites

- Metabase installed and running.
- Install and start RisingWave. For instructions on how to get started, see the [Quick start guide](/get-started.md).

## Establish the connection

1. Open the Metabase admin interface and click "Add a database".

![Add a Database](../images/add-a-database.png)

2. For the database type, select "PostgreSQL" since RisingWave uses the PostgreSQL wire protocol.

3. Fill in the connection details:

  - Name: Choose a friendly name.
  - Host: The hostname or IP address of the RisingWave database.
  - Port: The port number of the RisingWave database.
  - Database name: The name of the RisingWave database you want to connect to.
  - Username: The username for accessing the database.
  - Password: The password associated with the provided username.

![Fill in the Connection Details](../images/connection-details.png)

4. Save the connection.

Once connected, you will see the RisingWave database available in Metabase. You can now build dashboards, charts, and graphs on top of the real-time data in RisingWave.

![Save the Connection](../images/save-the-connection.png)

It should be noted that Metabase's minimum auto-refresh is 1 minute, while RisingWave typically delivers a second-level data freshness. As a workaround, you can append `#refresh=5` to the URL, such as `http://127.0.0.1:3000/dashboard/1-jaffle-shop#refresh=5`, thus setting the refresh interval to 5 seconds.

![Auto Refresh](../images/auto-refresh.png)