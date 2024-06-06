---
id: cluster-connect-to-a-cluster
title: Connect to a cluster
description: Connect to a cluster and interact with RisingWave.
slug: /connect-to-a-cluster
---

After [getting a cluster up and running](cluster-manage-clusters.md#create-a-cluster), you need to connect to it so that you can interact with RisingWave.

You can choose one of the following ways to connect to your cluster.

## Workspace

It is the most intuitive and easy way to connect to and interact with RisingWave via workspace. It offers graphical tools for managing data and visualizing results.

To connect via workspace, follow the steps below:

1. In RisingWave Cloud, go to [**Clusters**](https://cloud.risingwave.com/clusters/), and click **Workspace** for the cluster you want to connect to.

2. A workspace login window will pop up. You can choose **Default user** or **Create a new user**, then log in to the cluster.

3. Click **Switch** in the top right corner to switch the user if needed.

:::tip
For detailed instructions on using the workspace, see [Workspace](console-overview.md).
:::

## Local client

If you need to connect to the RisingWave cluster via local clients, you can configure the connection in multiple ways.

To connect with any local clients, follow the steps below:

1. In RisingWave Cloud, go to [**Clusters**](https://cloud.risingwave.com/clusters/), and click **Connect** for the cluster you want to connect to.

2. Click **Switch** in the top right corner to switch users, and then choose a startup mode.

    - RisingWave Cloud creates a default user for every provisioned cluster. The default user is authenticated with a temporary token under the OAuth 2.0 protocol to ease the burden on developers. For default users, RisingWave Cloud offers the `psql` command and a general `Connection String` for a quick connection.

    - Alternatively, you can create a new user, RisingWave Cloud offers `psql`, `Connection String`, `Parameters Only`, `Java`, `Node.js`, `Python`, and `Golang` as connection options.

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