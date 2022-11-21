---
id: superset-integration
title: Superset Integration
description: Connect RisingWave to Apache Superset.
slug: /superset-integration
---

# Integration with Apache Superset

Apache Superset is an open-source data exploration and data visualization software application. To connect Superset to an additional database, a Python database driver needs to be installed.

This guide will go over how to connect RisingWave to Superset.

## Install and Start RisingWave

To install and start RisingWave locally, see the [Get started](https://www.risingwave.dev/docs/latest/get-started/) guide. We recommend running RisingWave locally. 

Connect to a streaming source. For details on connecting to streaming sources and what sources are supported with RisingWave, see [Create source](https://www.risingwave.dev/docs/latest/sql-create-source/).

## Install Apache Superset

To install Apache Superset, follow the guide on [Installing locally using Docker Compose](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose#installing-superset-locally-using-docker-compose). This tutorial will go over how to install the database driver in Docker so we recommend installing using Docker Compose. 

## Add the sqlalchemy-risingwave driver

Install the `sqlalchemy-risingwave` driver within the Docker containers for Superset. The general steps are outlined in the [Adding new database drivers in Docker](https://superset.apache.org/docs/databases/docker-add-drivers/#2-install-mysql-driver) guide. 

Create `requirements-local.txt`:

```shell
#From the repo root...
touch ./docker/requirements-local.txt
```

Add the driver selected in the step above:

```shell
echo "sqlalchemy-risingwave" >>/docker/requirements-local.txt
```

Rebuild your local image with the new driver baked in:

```shell
docker-compose build --force-rm
```

## Start Apache Superset

Launch an instance of Apache Superset, following the [Launch Superset through Docker Compose](https://superset.apache.org/docs/installation/installing-superset-using-docker-compose#3-launch-superset-through-docker-compose) step of the installation guide. To start Superset, enter [http://localhost:8088](http://localhost:8088/) into your web browser. 

If it is your first time starting Superset and the webpage asks for a username and password, use admin for both.

The following UI page should appear.

<img
  src={require('../images/supersetui.png').default}
  alt="Supset UI"
/>

## Connect to RisingWave

1. Click **Settings > Database connections**. 
2. Select **+ Database**.
3. In the window that pops up, under **Supported databases**, select **Other** from the dropdown menu.
4. Fill in the primary credentials with SQLALCHEMY URI as `risingwave://root:@host.docker.internal:4566/dev`.
5. Click **Test Connection** then **Connect**.

<img
  src={require('../images/supersetdb.png').default}
  alt="Add database in Superset"
/>

## Create and export materialized views or tables

Instead of using Superset to create materialized views or tables, use RisingWave.

1. Export materialized view or table data to Superset by selecting **Datasets** then **+ Dataset***.
2. In the window that pops up, under **Database**, select RisingWave.
3. Under **Schema**, select the schema the table or materialized view was created in. By default, they are in the `public` schema.
4. Finally, select the materialized view or table to be exported to Superset.

Once the materialized view has been added as a dataset, it can be used to create dashboards. For more details on creating dashboards, see the [Creating your first dashboard](https://superset.apache.org/docs/creating-charts-dashboards/creating-your-first-dashboard#creating-charts-in-explore-view) guide. 