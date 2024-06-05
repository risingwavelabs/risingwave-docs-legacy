---
id: cluster-connect-to-a-cluster
title: Connect to a cluster
description: Connect to a cluster and interact with RisingWave using the console or terminal.
slug: /connect-to-a-cluster
---

After [getting a cluster up and running](cluster-manage-clusters.md#create-a-cluster), you need to connect to it so that you can interact with RisingWave.

You can choose one of the following ways to connect to your cluster.

## Query console

The query console is the most intuitive and easy way to connect to and interact with RisingWave. It offers graphical tools for managing data and visualizing results.

To connect via the console, follow the steps below:

1. In RisingWave Cloud, go to [**Clusters**](https://cloud.risingwave.com/clusters/), and click **Workspace** for the cluster you want to connect to.

2. A workspace login window will pop up. You can choose **Default user** or **Create a new user**, then log in to the cluster.

3. Click **Switch** in the top right corner to switch the user if needed.

:::tip
For detailed instructions on using the console, see [Query console](console-overview.md).
:::

## Local client

For terminal enthusiasts, you can still connect to your cluster through a local terminal.

To connect via the local client, follow the steps below:

1. In RisingWave Cloud, go to [**Clusters**](https://cloud.risingwave.com/clusters/), and click **Connect** for the cluster you want to connect to.

2. Click **Switch** in the top right corner to switch the user, and then choose a startup mode.

    - If you switch to the default user, the available modes are `psql` and `Connection String`.

    - If you create a new user, the available modes are `psql`, `Connection String`, `Parameters Only`, `Java`, `Node.js`, `Python`, and `Golang`.

    :::note
    To connect via `psql`, you need to [Install `psql`](/docs/current/install-psql-without-postgresql/) in your environment. `psql` is a command-line interface for interacting with PostgreSQL databases, including RisingWave.
    :::

3. You may need to set up a CA certificate to enable SSL connections. See the instructions displayed on the portal for more details.

4. Copy the command and run it in a terminal window.

5. Log in with the password of the database user.

    <img
    src={require('./images/psql-login.png').default}
    alt="Connect via psql"
    width="46%"
    />
    <img
    src={require('./images/psql-connected.png').default}
    alt="Connect via psql"
    width="46%"
    />

    :::note
    If you choose `Java`, `Node.js`, `Python`, or `Golang` as the startup mode, replace `<ENTER-SQL-USER-PASSWORD>` in the command with the password you set when creating a new user.
    :::

## What's next

<card
title="Develop with RisingWave Cloud"
content="RisingWave Cloud leverages the superpower of RisingWave, an open-source distributed SQL database specifically designed for stream processing. Start building your real-time applications with RisingWave, in the cloud."
cloud="develop-overview"
/>