---
id: quickstart
title: Quick start
description: Get started with RisingWave Cloud in 5 steps.
slug: /quickstart
---

Get started with RisingWave Cloud in 5 steps.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Step 1: Create an account

You can use your company email to create an account.

1. [Sign up](https://cloud.risingwave.com/auth/signup/) for RisingWave Cloud.

2. [Log in](https://cloud.risingwave.com/auth/signin/) to your account.

Alternatively, continue with your third-party account: **Google**, **Microsoft**, or **Github**.

## Step 2: Create a project

After you sign up, you are navigated to **Create project** on the [home page](https://cloud.risingwave.com/project/home/). A project in RisingWave Cloud provides the necessary resources for hosting independent data repositories and streaming pipelines. Within a project, you can create and manage database users and databases.

You can choose to create a free project or a customizable project if you have an invitation code. See [Choose a project plan](project-choose-a-project-plan.md) to decide on a project and configure the resources.

## Step 3: Connect to your project

After getting a project up and running, you need to connect to it so that you can interact with RisingWave.

Choose from the following ways to connect to your project.

:::note
RisingWave Cloud creates a default user for every provisioned project. The default user is authenticated with a temporary token under the OAuth 2.0 protocol to ease the burden on developers.
:::

<Tabs>

<TabItem value="Workspace" label="Workspace">

Workspace offers graphical tools for managing data and visualizing results. It is the most intuitive and easy way to connect to and interact with RisingWave. 

#### To connect via workspace, follow the steps below:

1. In RisingWave Cloud, go to [**Projects**](https://cloud.risingwave.com/project/home/), and click **Workspace** for the project you want to connect to.

2. You will enter the Workspace as a default user. Click **Switch** in the top right corner to switch the user if needed.

:::tip
For detailed instructions on using the workspace, see [Workspace](console-overview.md).
:::

</TabItem>
 
<TabItem value="local" label="Local client">

If you need to connect to the RisingWave project via local clients, you can configure the connection in multiple ways.

#### To connect with any local clients, follow the steps below:

1. In RisingWave Cloud, go to [**Projects**](https://cloud.risingwave.com/project/home/), and click **Connect** for the project you want to connect to.

2. Click **Switch** in the top right corner to switch users, and then choose a startup mode.

    - For default users, RisingWave Cloud offers the `psql` command and a general `Connection String` for a quick connection.

    - Alternatively, you can create a new user, RisingWave Cloud offers `psql`, `Connection String`, `Parameters Only`, `Java`, `Node.js`, `Python`, and `Golang` as connection options.

    :::note
    To connect via `psql`, you need to [Install `psql`](/docs/current/install-psql-without-postgresql/) in your environment. `psql` is a command-line interface for interacting with PostgreSQL databases, including RisingWave.
    :::

3. You may need to set up a CA certificate to enable SSL connections. See the instructions displayed on the portal for more details.

4. Copy the command and run it in a terminal window.

5. Log in with the password of the database user.

</TabItem>

</Tabs>

## Step 4: Explore RisingWave with examples

You can kickstart your journey with RisingWave by exploring the sample queries in the [**Query**](https://cloud.risingwave.com/console/) console.

These demos cover the most common steps in using RisingWave, such as establishing a connection with a data source, processing data by defining materialized views, and querying the results.

## Step 5: Ingest, process, and deliver data

Congrats, you are now ready to unleash the full potential of RisingWave on your own. Read [Develop with RisingWave Cloud](develop-overview.md) to start your journey.

<card
title="Develop with RisingWave Cloud"
content="RisingWave Cloud leverages the superpower of RisingWave, an open-source distributed SQL database specifically designed for stream processing. Start building your real-time applications with RisingWave, in the cloud."
cloud="develop-overview"
/>
