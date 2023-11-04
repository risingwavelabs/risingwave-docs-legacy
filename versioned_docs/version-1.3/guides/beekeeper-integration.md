---
id: beekeeper-integration
title: Connect Beekeeper Studio to RisingWave
description: Connect Beekeeper Studio to RisingWave.
slug: /beekeeper-integration
---

Beekeeper Studio is a modern, easy to use SQL editor and database manager. It provides a graphical user interface, allowing you to efficiently query and manage PostgreSQL, MySQL, SQL Server and more. Since RisingWave is PostgreSQL-compatible, you can easily connect Beekeeper Studio to RisingWave.

:::note
RisingWave only supports connecting the Beekeeper Studio Community edition. The Ultimate (commercial) edition is not officially tested with RisingWave and may contain bugs. Please report any issues with the Ultimate edition to the RisingWave team.
:::

## Prerequisites

- Ensure that Beekeeper Studio Community Edition is installed. To download Beekeeper Studio, see the [Beekeeper releases page](https://github.com/beekeeper-studio/beekeeper-studio/releases/).

- Install and start RisingWave. For instructions on how to get started, see the [Quick start guide](/get-started.md).

## Establish the connection

1. In the Beekeeper Studio interface, under **New connection**, select **Postgres** as the **Connection type**.

2. Under the **New connection** window, provide the following information:

    - Host: The hostname or IP address of the RisingWave database. The default **Host** is `localhost`.

    - Port: The port number of the RisingWave database. The default **Port** is `4566`.

    - Database: The name of the RisingWave database you want to connect to. The default **Database** is `dev`.

    - Username: The username for accessing the database. The default **Username** is `root`.

    - Password: The password associated with the provided username. By default, there is no password for `root`.

    <img
    src={require('../images/beekeeper-connection.png').default}
    alt="Fill in connection settings in Beekeeper Studio"
    />

3. Click **Test**. If there are no issues, click **Connect**.

Now that the connection is established. By default, anything created in RisingWave, such as tables, sources, or materialized views, will be listed under the dev database and the public schema. Now you can leverage Beekeeper Studio's interface and studio on the RisingWave database.
