---
id: cluster-create-a-database-user
title: Create a database user
description: Create a database user in a cluster.
slug: /cluster-create-a-database-user
---


Choose one of the following to create a [database user](cluster-manage-database-users.md).

- You can create a database user when connecting to a cluster.

    See [Connect to a cluster](cluster-connect-to-a-cluster.md) for detailed instructions.

- You can click **Create user** in the **Database User** tab on the [cluster details page](cluster-check-status-and-metrics.md#check-cluster-details) to create a new user.
    
    [screenshot]

- You can run the [CREATE USER](https://www.risingwave.dev/docs/current/sql-create-user/) command to create a new user after [connecting to a cluster](cluster-connect-to-a-cluster.md) using the console or terminal.

    Ensure that you have logged in to the cluster with a user that has the CREATEUSER privilege. All users created in the Beta version of RisingWave Cloud have this privilege.
