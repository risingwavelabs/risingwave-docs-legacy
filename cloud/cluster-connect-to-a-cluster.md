---
id: cluster-connect-to-a-cluster
title: Connect to a cluster
description: Connect to a cluster using the console or terminal.
slug: /cluster-connect-to-a-cluster
---

After [getting a cluster up and running](cluster-manage-clusters.md#create-a-cluster), you need to connect to it so that you can interact with RisingWave.

You can choose from the following two ways to connect to your cluster.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="console" label="Console">

The console is the most intuitive and easy way to connect to and interact with RisingWave, offering graphical tools for managing data and visualizing results.

[screenshot]

To connect via the console:


1. Select the **Console** tab.

    [screenshot]

2. Select an existing database user or create a new one.

    [screenshot]

3. Log in to the database as one of the database users.

    [screenshot]
 
    
</TabItem>

<TabItem value="terminal" label="Terminal">

For terminal enthusiasts, you can still connect to a cluster through your local terminal.

[screenshot]

1. [Install `psql`](https://www.risingwave.dev/docs/current/install-psql-without-postgresql/) in your environment.

    `psql` is a command-line interface for interacting with PostgreSQL databases, including RisingWave.

2. Select the **Clusters** tab.
    
    [screenshot]
    
3. Click the **Connect** button on the cluster you want to connect to.
    
    [screenshot]

    :::tip
    If the status of the cluster is **Stopped**, you need to click **Start** to restart it before you can connect to it.
    :::
    
4. Select an existing database user or create a new one.
    
    [screenshot]
    
5. Copy the connection string and run it in a terminal window.
    
    [screenshot]
    
6. Log in with the password of the database user.


</TabItem>

</Tabs>

## More to read

[Provide the links to the Develop section in the Kernel docs]