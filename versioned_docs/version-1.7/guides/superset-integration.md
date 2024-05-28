---
id: superset-integration
title: Configure Superset to read data from RisingWave
description: Configure Superset to read data from RisingWave.
slug: /superset-integration
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/superset-integration/" />
</head>

Apache Superset is an open-source data exploration and data visualization software application. As a database, RisingWave can act as a data source for Business Intelligence tools like Apache Superset.

This guide will go over how to:

- Connect RisingWave to Superset.
- Create a dashboard.

## Prerequisites

### Install and start RisingWave

To install and start RisingWave locally, see the [Get started](/get-started.md) guide. We recommend running RisingWave locally for demo purposes.

Connect to a streaming source. For details on connecting to streaming sources and what sources are supported with RisingWave, see [CREATE SOURCE](/sql/commands/sql-create-source.md).

### Install Apache Superset

To install Apache Superset, follow the instructions in [Installing locally using Docker Compose](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose#installing-superset-locally-using-docker-compose). This guide will cover how to install the database driver in Docker, so we recommend installing it using Docker Compose.

## Establish the connection between Superset and RisingWave

### Start Apache Superset

Launch an instance of Apache Superset by following the instructions in [Launch Superset through Docker Compose](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose#3-launch-superset-through-docker-compose). To start Superset, enter http://localhost:8088 into your web browser.

If it is your first time starting Superset and the webpage asks for a username and password, use `admin` for both.

The following UI page should appear.

<img
src={require('../images/supersetui.png').default}
alt="Superset UI"
/>

### Connect to RisingWave

> Note that, if you're serving Superset in docker-compose,
> the PostgresSQL connector library [`psycopg2`](https://www.psycopg.org/docs/) comes out of the box with Superset.
>
> If not, you need install the `psycopg2` driver for Superset.
> The [Installing Database Drivers](https://superset.apache.org/docs/databases/installing-database-drivers) guide lists the required driver.

1. In Superset, select **Settings > Database connections**.

2. Click **+ Database**.

3. In the window that pops up, under **Select a database to connect**, select the **PostgresSQL** card.

4. Fill in the following fields:

   - HOST: `host.docker.internal`
   - PORT: `4566`
   - DATABASE NAME: `dev`
   - USERNAME: `root`
   - DISPLAY NAME: `RW` (optional)

5. Click **Connect**.

<img
src={require('../images/supersetdb.png').default}
alt="Add database in Superset"
/>

## Create a dashboard

### Create tables or materialized views in RisingWave

Instead of using Superset to create materialized views or tables, use RisingWave. For this guide, we will create the table `t` and insert some data.

Once RisingWave starts, use the following queries to create the table `t` and insert some values to the table.

```sql
CREATE TABLE t (v float, ts timestamp);
INSERT INTO t VALUES (1.0, '2022-11-15 15:35:40'),
(2.1, '2022-11-15 15:36:24'),
(3.5, '2022-11-15 15:37:32'),
(4.2, '2022-11-15 15:38:12'),
(4.2, '2022-11-15 15:38:21');
```

### Create and export tables or materialized views

Export the data from materialized views or tables in RisingWave to Superset:

1. Select **Datasets** then **+ Dataset**.

2. In the window that pops up, under **Database**, select **RisingWave**.

3. Under **Schema**, select the schema the table or materialized view was created in. By default, they are in the `public` schema.

4. Select the materialized view or table to be exported to Superset. In this guide, we'll select `t`.

Once the materialized view has been added as a dataset, it can be used to create dashboards.

### Create a dashboard in Superset

To create a dashboard based on the table `t`:

1. Click **Create chart**.

2. Select table `t`.

3. Select **Time-series line chart** as the rendering method.

4. Specify `ts` as the time column.

5. Specify `AVG(v)` as the metric.

6. Click **Update chart**. The query results will be rendered into a line chart.

<img
src={require('../images/superset-dashboard.png').default}
alt="Create a dashboard in Superset"
/>

For more details on creating dashboards, see the [Creating your first dashboard](https://superset.apache.org/docs/creating-charts-dashboards/creating-your-first-dashboard#creating-charts-in-explore-view) guide.
