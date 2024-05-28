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

<DefaultButton text="Continue →" cloud="quickstart?step=2" block/>

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

<DefaultButton text="Continue →" cloud="quickstart?step=3" block/>

</TabItem>

<TabItem value="3" label="3. Connect to your cluster">

## Connect to your cluster

After getting a cluster up and running, you need to connect to it so that you can interact with RisingWave.

You can choose from the following two ways to connect to your cluster.

<Tabs>

<TabItem value="console" label="Query console">

The query console is the most intuitive and easy way to connect to and interact with RisingWave, offering graphical tools for managing data and visualizing results.

#### To connect via the console:

1. Go to [**Query**](https://cloud.risingwave.com/console/).

2. Create a new database user.

   > You must log in to the cluster as a database user. Since this is a new cluster, you need to create a user in it first.

   <img
   src={require('./images/cluster-console-createuser.gif').default}
   alt="Create a database user"
   />

3. Enter the password of the user you created to log in to the cluster.

   <img
   src={require('./images/cluster-console-login.gif').default}
   alt="First login to the console"
   />

</TabItem>
 
<TabItem value="local" label="Local client">

For terminal enthusiasts, you can still connect to your cluster through a local terminal with the help of `psql`.

#### To connect via `psql` client:

1. [Install `psql`](/docs/current/install-psql-without-postgresql/) in your environment.

   `psql` is a command-line interface for interacting with PostgreSQL databases, including RisingWave.

2. In RisingWave Cloud, go to [**Clusters**](https://cloud.risingwave.com/clusters/).
3. Click **Connect** of your cluster.

   <img
   src={require('./images/cluster-local-connect-1.png').default}
   alt="Connect to a cluster from a local client"
   />

4. Create a new database user.

   > You must connect and log in to the cluster as a database user. Since this is a new cluster, you need to create a user in it first.

   <img
   src={require('./images/cluster-local-createuser.gif').default}
   alt="Create a database user in a cluster"
   />

5. Copy the connection string and run it in a terminal window.
6. Log in with the password of the database user.

<ResponsiveGrid
  container
  direction="row"
  spacing="20"
  justifyContent="space-between"
  justifyItems="stretch"
  alignItems="baseline">

  <ResponsiveGrid item xs={12} md={6}>

    <img
    src={require('./images/psql-login.png').default}
    alt="Connect via psql"
    />

  </ResponsiveGrid>

  <ResponsiveGrid item xs={12} md={6}>

    <img
    src={require('./images/psql-connected.png').default}
    alt="Connect via psql"
    />

  </ResponsiveGrid>
  </ResponsiveGrid>

</TabItem>

</Tabs>

---

<DefaultButton text="Continue →" cloud="quickstart?step=4" block/>

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

<DefaultButton text="Continue →" cloud="quickstart?step=5" block/>

</TabItem>

<TabItem value="5" label="5. Ingest, process, and deliver data">

## Ingest, process, and deliver data

Congrats, you are now ready to unleash the full potential of RisingWave on your own. Read [Develop with RisingWave Cloud](develop-overview.md) to start your journey.

<OutlinedCard
title="Develop with RisingWave Cloud"
content="RisingWave Cloud leverages the superpower of RisingWave, an open-source distributed SQL database specifically designed for stream processing. Start building your real-time applications with RisingWave, in the cloud."
cloud="develop-overview"
/>

</TabItem>

</Tabs>
