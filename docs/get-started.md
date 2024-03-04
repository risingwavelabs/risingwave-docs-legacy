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

This guide aims to provide a quick and easy way to get started with RisingWave.

## Step 1: Start RisingWave

:::info
The following options start RisingWave in the standalone mode. In this mode, data is stored in the file system and the metadata is stored in the embedded SQLite database. 

For extensive testing or single-machine deployment, consider [starting RisingWave via Docker Compose](/deploy/risingwave-docker-compose.md). For production environments, consider [RisingWave Cloud](/deploy/risingwave-cloud.md), our fully managed service, or [deployment on Kubernetes using the Operator](/deploy/risingwave-kubernetes.md) or [Helm Chart](/deploy/deploy-k8s-helm.md).
:::

:::warning
There is a known limitation when using the standalone mode on macOS. Connectors for `jdbc`, `postgresql-cdc`, `mysql-cdc`, `elastic-search`, and `cassandra` may not function as expected. We anticipate that this limitation will be addressed in version 1.8.
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

Ensure [Homebrew](https://brew.sh/) is installed, and run the following commands:

```shell
brew tap risingwavelabs/risingwave
brew install risingwave@1.7-standalone
risingwave
```

### From a Web browser

[https://playground.risingwave.dev/](https://playground.risingwave.dev/)

## Step 2: Connect to RisingWave

Ensure you have `psql` installed in your environment. To learn about how to install it, see [Install `psql` without PostgreSQL](/guides/install-psql-without-full-postgres.md).

Open a new terminal window and run:

```shell
psql -h localhost -p 4566 -d dev -U root
```

## Step 3: Insert some data

RisingWave supports both direct data insertion and streaming data ingestion from sources like message queues and database change streams.

To keep things simple, we'll demonstrate the approach of direct data insertion. Let's create a table and insert some data.

For instance, we can create a table named `exam_scores` to store information about examination scores.

```sql title="Create the table"
CREATE TABLE exam_scores (
  score_id int,
  exam_id int,
  student_id int,
  score real,
  exam_date date
);
```

```sql title="Insert five rows of data"
INSERT INTO exam_scores (score_id, exam_id, student_id, score, exam_date)
VALUES
  (1, 101, 1001, 85.5, '2022-01-10'),
  (2, 101, 1002, 92.0, '2022-01-10'),
  (3, 101, 1003, 78.5, '2022-01-10'),
  (4, 102, 1001, 91.2, '2022-02-15'),
  (5, 102, 1003, 88.9, '2022-02-15');
```

## Step 4: Analyze and query data

As an example, let's create a materialized view to calculate the average score for each examination, and then view the current result of the materialized view.

```sql title="Create a materialized view"
CREATE MATERIALIZED VIEW average_exam_scores AS
SELECT
    exam_id,
    AVG(score) AS average_score,
    COUNT(score) AS total_scores
FROM
    exam_scores
GROUP BY
    exam_id;
```

```sql title="Query the current result"
SELECT * FROM average_exam_scores;
------
 exam_id |   average_score   | total_scores 
---------+-------------------+--------------
     102 | 90.05000000000001 |            2
     101 | 85.33333333333333 |            3
(2 rows)

```

As new data is received, the `average_exam_scores` materialized view will be automatically updated. RisingWave performs incremental computations in the background to keep the results up to date.

Now, let's insert five additional rows of data into the `exam_scores` table and query the latest result from the `average_exam_scores` materialized view. This will provide us with the updated average score for each examination.

```sql title="Insert more data"
INSERT INTO exam_scores (score_id, exam_id, student_id, score, exam_date)
VALUES
  (11, 101, 1004, 89.5, '2022-05-05'),
  (12, 101, 1005, 93.2, '2022-05-05'),
  (13, 102, 1004, 87.1, '2022-06-10'),
  (14, 102, 1005, 91.7, '2022-06-10'),
  (15, 102, 1006, 84.3, '2022-06-10');
```
```sql title="Query the latest result"
SELECT * FROM average_exam_scores;
------
 exam_id |   average_score   | total_scores 
---------+-------------------+--------------
     101 |             87.74 |            5
     102 | 88.64000000000001 |            5
(2 rows)
```

## What's next?

Congratulations! You've successfully started RisingWave and conducted some initial data analysis. To explore further, you may want to: 

- Check out the ready-to-run examples:
  * [Example A: Ingest data from Kafka](https://github.com/risingwavelabs/awesome-stream-processing/blob/main/00-get-started/01-ingest-kafka-data.md)
  * [Example B: Ingest data from Postgres CDC](https://github.com/risingwavelabs/awesome-stream-processing/blob/main/00-get-started/02-ingest-pg-cdc.md)
- See [this GitHub directory](https://github.com/risingwavelabs/risingwave/tree/main/integration_tests) for ready-to-run demos and integration examples.
- Read our documentation to learn about how to ingest data from data streaming sources, transform data, and deliver data to downstream systems.