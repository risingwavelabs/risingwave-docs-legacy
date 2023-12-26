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
    
<img
    src={require('../images/add-a-database.png').default}
    alt="Add a Database"
    /> 

2. For the database type, select "PostgreSQL" since RisingWave uses the PostgreSQL wire protocol.

3. Fill in the connection details:
    - Name: Choose a friendly name.
    - Host: The hostname or IP address of the RisingWave database. The default **Host** is `localhost`.
    - Port: The port number of the RisingWave database. The default **Port** is `4566`.
    - Database name: The name of the RisingWave database you want to connect to. The default **Database** is `dev`.
    - Username: The username for accessing the database. The default **Username** is `root`.
    - Password: The password associated with the provided username. By default, there is no password for `root`.
    
   <img
    src={require('../images/connection-details.png').default}
    alt="Fill in connection settings in Metabase"
    />    
    
4. Save the connection.

Once connected, you will see the RisingWave database available in Metabase. You can now build dashboards, charts, and graphs on top of the real-time data in RisingWave.

 <img
    src={require('../images/connection-details.png').default}
    alt="RisingWave Database Available in Metabase"
    />    