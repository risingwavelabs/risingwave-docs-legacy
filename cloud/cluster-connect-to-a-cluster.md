---
id: cluster-connect-to-a-cluster
title: Connect to a cluster
description: Connect to a cluster and interact with RisingWave using the console or terminal.
slug: /connect-to-a-cluster
---

After [getting a cluster up and running](cluster-manage-clusters.md#create-a-cluster), you need to connect to it so that you can interact with RisingWave.

You can choose from the following two ways to connect to your cluster.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs queryString="method">

<TabItem value="console" label="Query console">

The query console is the most intuitive and easy way to connect to and interact with RisingWave, offering graphical tools for managing data and visualizing results.

#### To connect via the console:

 
1. Go to [**Query**](https://cloud.risingwave.com/console/).  

2. Select the cluster you want to connect to and then select an existing database user or create a new one.
    
    <details>
    <summary>See how to create a new user</summary>

    Select **Create a new user** on the left, and type in the username and password to create it.
    <img
    src={require('./images/cluster-console-createuser.gif').default}
    alt="Create a database user"
    />
    </details>

3. Enter the password of the user to log in to the cluster.

    <img
    src={require('./images/cluster-console-login.gif').default}
    alt="Log in to the cluster"
    />

:::tip
For detailed instructions on using the console, see [Query console](console-overview.md).
:::
    
</TabItem>

<TabItem value="local" label="Local client">

For terminal enthusiasts, you can still connect to your cluster through a local terminal with the help of `psql`.

#### To connect via `psql` client:

1. [Install `psql`](/docs/current/install-psql-without-postgresql/) in your environment.

    > `psql` is a command-line interface for interacting with PostgreSQL databases, including RisingWave.

2. In RisingWave Cloud, go to [**Clusters**](https://cloud.risingwave.com/clusters/).
    
3. Click **Connect** of the cluster you want to connect.
    
    <img
    src={require('./images/cluster-local-connect-2.png').default}
    alt="Connect to a cluster from a local client"
    />
    
4. Select the cluster you want to connect to and then select an existing database user or create a new one.

    <details>
    <summary>See how to create a new user</summary>

    Select **Create a new user** on the left, and type in the username and password to create it.
    <img
    src={require('./images/cluster-local-createuser.gif').default}
    alt="Create a database user in a cluster"
    />
    </details>
    
5. Copy the connection string and run it in a terminal window.
    
6. Log in with the password of the database user.

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

</TabItem>

</Tabs>

## What's next

<card
title="Develop with RisingWave Cloud"
content="RisingWave Cloud leverages the superpower of RisingWave, an open-source distributed SQL database specifically designed for stream processing. Start building your real-time applications with RisingWave, in the cloud."
cloud="develop-overview"
/>