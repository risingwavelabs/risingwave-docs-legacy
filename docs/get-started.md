---
id: get-started
title: Quick start
description: Get started with RisingWave.
slug: /get-started
toc_max_heading_level: 2
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/get-started/" />
</head>

This guide aims to provide a quick and easy way to get started with RisingWave. In this guide, we will walk you through the common tasks of using RisingWave.

## Step 1: Start RisingWave

:::info
The following options start RisingWave in standalone mode. In this mode, data is stored in the file system and the metadata is stored in the embedded SQLite database. Standalone mode only supports `jdbc`, `postgresql-cdc`, `mysql-cdc`, `elastic-search`, and `cassandra` connectors in certain user environments. Ubuntu users can utilize these connectors with Java installed, while Mac users will have to wait until the 1.8 release for support.

For extensive testing or single-machine deployment, consider [starting RisingWave via Docker Compose](/deploy/risingwave-docker-compose.md). For production environments, consider [RisingWave Cloud](/deploy/risingwave-cloud.md), our fully managed service, or [deployment on Kubernetes using the Operator](/deploy/risingwave-kubernetes.md) or [Helm Chart](/deploy/deploy-k8s-helm.md).
:::

### Script installation

Open a terminal and run the following `curl` command.

```shell
curl https://risingwave.com/sh | sh
```

### Docker

Ensure [Docker Desktop](https://docs.docker.com/get-docker/) is installed and running in your environment.

```shell
docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v1.7.0-standalone single_node
```

### Homebrew

Ensure [Homebrew](https://brew.sh/) in installed, and run the following commands:

```shell
brew tap risingwavelabs/risingwave
brew install risingwave@1.7-standalone
risingwave
```

### From a Web browser

[https://playground.risingwave.dev/](https://playground.risingwave.dev/)

## Step 2: Connect to RisingWave

After RisingWave is up and running, connect to it via the Postgres interactive terminal `psql`. Ensure you have `psql` installed in your environment. To learn about how to install it, see [Install `psql` without PostgreSQL](/guides/install-psql-without-full-postgres.md).

Open a new terminal window and run:

```shell
psql -h localhost -p 4566 -d dev -U root
```

Notes about the `psql` options:

- The `-h` option is used to specify the host name or IP address of the PostgreSQL server to connect to.
- The `-p` option is used to specify the port number that the server is listening on.
- The `-d` option is used to specify the name of the database to connect to.
- The `-U` option is used to specify the name of the database user to connect as.
- By default, the PostgreSQL server uses the `root` user account to authenticate connections to the `dev` database. Note that this user account does not require a password to connect.

## Step 3: Ingest data into RisingWave

After RisingWave starts, you can ingest data into it. You can either directly insert data into it, or ingest data from a streaming source like Kafka, Pulsar, Kinesis, or Postgres CDC.

### Option A: Ingest streaming data from a source

The recommended approach for streaming data ingestion into RisingWave is through upstream sources, such as message queues or Change Data Capture streams. To view the list of supported sources and formats, refer to [Supported sources](/sql/commands/sql-create-source.md#supported-sources).

You can ingest streaming data by creating a table with connector settings using the [`CREATE TABLE`](/sql/commands/sql-create-table.md)) command or by creating a source using the [`CREATE SOURCE`](/sql/commands/sql-create-source.md) command. In RisingWave, a source stores the metadata of a stream but does not persist the data within the stream, while a table with connector settings persists the data in the stream.

Before proceeding, please ensure that the streaming source, such as a Kafka topic, is available as a prerequisite. To keep this guide concise, we will not provide detailed instructions on setting up your upstream sources.

### Option B: Insert data into RisingWave

To insert data into RisingWave, the process is similar to inserting data into any SQL database.

For instance, we can create a table called website_visits to store information about web page visits. We can then insert five rows of data into this table as an example.  It's important to note that the data in the table is intended to simulate the payload of a data stream.

```sql title="Create the table"
CREATE TABLE website_visits (
  timestamp timestamp with time zone,
  user_id varchar,
  page_id varchar,
  action varchar
);
```

```sql title="Insert five rows of data
INSERT INTO website_visits (timestamp, user_id, page_id, action) VALUES
  ('2023-06-13T10:00:00Z', 'user1', 'page1', 'view'),
  ('2023-06-13T10:01:00Z', 'user2', 'page2', 'view'),
  ('2023-06-13T10:02:00Z', 'user3', 'page3', 'view'),
  ('2023-06-13T10:03:00Z', 'user4', 'page1', 'view'),
  ('2023-06-13T10:04:00Z', 'user5', 'page2', 'view');
```

## Step 4: Transform data

To perform data transformations in RisingWave, there is no requirement to set up processing jobs or pipelines. You have the option to express your data transformation logic within materialized views if you need to directly query the results within RisingWave. Alternatively, if you intend to deliver the results to a downstream system, such as a data warehouse, and query the results there, you can include the transformation logic within a sink. In RisingWave, a sink is an object used to deliver data to a downstream system.

As an illustrative example, let's create a materialized view to obtain the total page visits, unique visitors, and the last visit time for each page based on the   `website_visits` table. 

```sql
CREATE MATERIALIZED VIEW visits_stream_mv AS 
SELECT page_id, 
count(*) AS total_visits, 
count(DISTINCT user_id) AS unique_visitors, 
max(timestamp) AS last_visit_time 
FROM website_visits
GROUP BY page_id;
```

## Step 5: Query data

Like other databases, you can query data in RisingWave using the [`SELECT`](/sql/commands/sql-select.md) command.

For example, let's see the latest results of the `visits_stream_mv` materialized view that we created earlier:

```sql
SELECT * FROM visits_stream_mv;
------
 page_id | total_visits | unique_visitors |      last_visit_time
---------+--------------+-----------------+---------------------------
 page2   |            2 |               2 | 2023-06-13 10:08:00+00:00
 page1   |            2 |               2 | 2023-06-13 10:07:00+00:00
 page3   |            1 |               1 | 2023-06-13 10:09:00+00:00
(3 rows)
```

As new data comes in, the results in `visits_stream_mv` will be automatically updated. Behind the scenes, RisingWave performs incremental computations when new data comes in.

For example, if you insert five more rows of data into the `website_visits` table:


```sql title="Insert five rows of data"
INSERT INTO website_visits (timestamp, user_id, page_id, action) VALUES
  {'2023-06-13T10:10:00Z', 'user1', 'page3', 'scroll'}
  {'2023-06-13T10:11:00Z', 'user2', 'page1', 'click'}
  {'2023-06-13T10:12:00Z', 'user3', 'page2', 'scroll'}
  {'2023-06-13T10:13:00Z', 'user4', 'page3', 'view'}
  {'2023-06-13T10:14:00Z', 'user5', 'page1', 'click'};
```

The results will be automatically updated:

```sql
SELECT * FROM visits_stream_mv;
------
 page_id | total_visits | unique_visitors |      last_visit_time   
---------+--------------+-----------------+---------------------------
 page2   |            3 |               3 | 2023-06-13 10:12:00+00:00
 page3   |            3 |               3 | 2023-06-13 10:13:00+00:00
 page1   |            4 |               4 | 2023-06-13 10:14:00+00:00
(3 rows)
```

## What's next?

- For runnable demos and integration tests, see [this GitHub repository](https://github.com/risingwavelabs/risingwave/tree/main/integration_tests). Note that Docker is required to run the demos and tests.

- You can export data from RisingWave to various destinations such as message queues, databases, data warehouses, or data lakes. For a complete list of destinations, see [Integrations](/rw-integration-summary.md). To deliver data from RisingWave to downstream systems, create a sink using the [`CREATE SINK`](/sql/commands/sql-create-sink.md) command.