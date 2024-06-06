---
id: quickstart
title: Quick start
description: Get started with RisingWave Cloud in 5 steps.
slug: /quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs queryString="step">

<TabItem value="1" label="1. Sign up and log in">

## Sign up and log in

#### You can use your company email to create an account.

1. [Sign up](https://cloud.risingwave.com/auth/signup/) for RisingWave Cloud.

2. [Log in](https://cloud.risingwave.com/auth/signin/) to your account.

<img
  src={require('./images/login.png').default}
  alt="RisingWave Cloud login page"
/>

---

#### Or create an account and log in with a third-party service.

<img
  src={require('./images/login-thirdparty.png').default}
  alt="RisingWave Cloud third-party login"
  width="30%"
/>

--- 
<defaultButton text="Continue →" cloud="quickstart?step=2" block/>


</TabItem>

<TabItem value="2" label="2. Create a cluster">

## Create a cluster

A cluster in RisingWave Cloud provides the necessary resources for hosting independent data repositories and streaming pipelines. Within a cluster, you can create and manage database users and databases.

You can find the **Create cluster** button on the [home page](https://cloud.risingwave.com/dashboard/) or the [**Clusters**](https://cloud.risingwave.com/clusters/) tab after your first login.
<p></p>

<img
  src={require('./images/cluster-create.png').default}
  alt="Create a cluster"
/>

You can choose to create a free cluster or a customizable cluster if you have an invitation code.

See [Choose a cluster plan](cluster-choose-a-cluster-plan.md) for details on how to choose a cluster plan and configure the resources.

--- 
<defaultButton text="Continue →" cloud="quickstart?step=3" block/>

</TabItem>

<TabItem value="3" label="3. Connect to your cluster">

## Connect to your cluster

After getting a cluster up and running, you need to connect to it so that you can interact with RisingWave.

You can choose from the following ways to connect to your cluster.

<Tabs>

<TabItem value="Workspace" label="Workspace">

It is the most intuitive and easy way to connect to and interact with RisingWave via workspace. It offers graphical tools for managing data and visualizing results.

#### To connect via workspace, follow the steps below:

1. In RisingWave Cloud, go to [**Clusters**](https://cloud.risingwave.com/clusters/), and click **Workspace** for the cluster you want to connect to.

2. A workspace login window will pop up. You can choose **Default user** or **Create a new user**, then log in to the cluster.

3. Click **Switch** in the top right corner to switch the user if needed.

:::tip
For detailed instructions on using the workspace, see [Workspace](console-overview.md).
:::

</TabItem>
 
<TabItem value="local" label="Local client">

If you need to connect to the RisingWave cluster via local clients, you can configure the connection in multiple ways.

#### To connect with any local clients, follow the steps below:

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


</TabItem>

</Tabs>

---
<defaultButton text="Continue →" cloud="quickstart?step=4" block/>

</TabItem>

<TabItem value="4" label="4. Explore RisingWave with examples">

## Explore RisingWave with examples

You can kickstart your journey with RisingWave by exploring the sample queries in the [**Query**](https://cloud.risingwave.com/console/) console.

These demos cover the most common steps in using RisingWave, such as establishing a connection with a data source, processing data by defining materialized views, and querying the results.

<img
src={require('./images/console-samplequeries.gif').default}
alt="Running a sample query using the console"
/>

---
<defaultButton text="Continue →" cloud="quickstart?step=5" block/>

</TabItem>

<TabItem value="5" label="5. Ingest, process, and deliver data">

## Ingest, process, and deliver data

Congrats, you are now ready to unleash the full potential of RisingWave on your own. Read [Develop with RisingWave Cloud](develop-overview.md) to start your journey.

<card
title="Develop with RisingWave Cloud"
content="RisingWave Cloud leverages the superpower of RisingWave, an open-source distributed SQL database specifically designed for stream processing. Start building your real-time applications with RisingWave, in the cloud."
cloud="develop-overview"
/>

</TabItem>

</Tabs>
