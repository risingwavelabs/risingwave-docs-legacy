---
id: superset-integration
title: Superset Integration
description: Connect RisingWave to Apache Superset.
slug: /superset-integration
---

# Integration with Apache Superset

Apache Superset is an open-source data exploration and data visualization software application. To connect Superset to an additional database, a Python database driver needs to be installed.

This guide will go over how to:
* Connect RisingWave to Superset.
* Create a dashboard.

## Establish the connection between Superset and RisingWave

### Install and Start RisingWave

To install and start RisingWave locally, see the [Get started](https://www.risingwave.dev/docs/latest/get-started/) guide. We recommend running RisingWave locally for demo purposes.

Connect to a streaming source. For details on connecting to streaming sources and what sources are supported with RisingWave, see [Create source](https://www.risingwave.dev/docs/latest/sql-create-source/).

### Install Apache Superset

To install Apache Superset, follow the guide on [Installing locally using Docker Compose](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose#installing-superset-locally-using-docker-compose). This tutorial will go over how to install the database driver in Docker so we recommend installing using Docker Compose. 

### Add the sqlalchemy-risingwave driver

Install the `sqlalchemy-risingwave` driver within the Docker containers for Superset. The general steps are outlined in the [Adding new database drivers in Docker](https://superset.apache.org/docs/databases/docker-add-drivers/#2-install-mysql-driver) guide. 

1. Create `requirements-local.txt`:
```shell
#From the repo root...
touch ./docker/requirements-local.txt
```

2. Add the driver selected in the step above:
```shell
echo "sqlalchemy-risingwave" >>/docker/requirements-local.txt
```

3. Rebuild your local image with the new driver baked in:
```shell
docker-compose build --force-rm
```

### Start Apache Superset

Launch an instance of Apache Superset, following the [Launch Superset through Docker Compose](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose#3-launch-superset-through-docker-compose) step of the installation guide. To start Superset, enter [http://localhost:8088](http://localhost:8088/) into your web browser. 

If it is your first time starting Superset and the webpage asks for a username and password, use admin for both.

The following UI page should appear.

<img
  src={require('../images/supersetui.png').default}
  alt="Supset UI"
/>

### Connect to RisingWave

1. Click **Settings > Database connections**. 
2. Select **+ Database**.
3. In the window that pops up, under **Supported databases**, select **Other** from the dropdown menu.
4. Fill in the primary credentials with SQLALCHEMY URI as `risingwave://root:@host.docker.internal:4566/dev`.
5. Click **Test Connection** then **Connect**.

<img
  src={require('../images/supersetdb.png').default}
  alt="Add database in Superset"
/>

## Create a dashboard

### Create a table or materialized view in RisingWave

Instead of using Superset to create materialized views or tables, use RisingWave. For this guide, we will create the table `t` and insert some data.

```sql
CREATE TABLE t (v FLOAT, ts TIMESTAMP);
INSERT INTO t VALUES (1.0, '2022-11-15 15:35:40'),
(2.1, '2022-11-15 15:36:24'),
(3.5, '2022-11-15 15:37:32'),
(4.2, '2022-11-15 15:38:12'),
(4.2, '2022-11-15 15:38:21');
```

### Create and export materialized views or tables

Export the data from materialized views or tables in RisingWave to Superset:

1. Export materialized view or table data to Superset by selecting **Datasets** then **+ Dataset***.
2. In the window that pops up, under **Database**, select RisingWave.
3. Under **Schema**, select the schema the table or materialized view was created in. By default, they are in the `public` schema.
4. Select the materialized view or table to be exported to Superset.

Once the materialized view has been added as a dataset, it can be used to create dashboards.

### Create a dashboard in Superset

To create a dashboard based on the table `t`:
1. Click the **Create chart** button.
2. Select table t.
3. Use **Time-series line chart** as the rendering method.
4. Specify “ts” as the time column.
5. Specify “AVG(v)” as the metric.
6. Click **Update chart**. The query results will be rendered into a line chart.

<img
  src={require('../images/superset-dashboard.png').default}
  alt="Create a dashboard in Superset"
/>

For more details on creating dashboards, see the [Creating your first dashboard](https://superset.apache.org/docs/creating-charts-dashboards/creating-your-first-dashboard#creating-charts-in-explore-view) guide. 