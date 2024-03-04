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

## Start RisingWave

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

## Connect to RisingWave

Ensure you have `psql` installed in your environment. To learn about how to install it, see [Install `psql` without PostgreSQL](/guides/install-psql-without-full-postgres.md).

Open a new terminal window and run:

```shell
psql -h localhost -p 4566 -d dev -U root
```

## Insert some data

RisingWave specializes in streaming data ingestion from sources such as message queues and database change streams. However, it also supports direct data insertion.

Now, let's create a table and insert some data.

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

## Analyze and query data

As an illustrative example, let's create a materialized view to calculate the average score for examination 101, and then view the current value of the materialized view.

```sql title="Create a materialized view"
CREATE MATERIALIZED VIEW average_exam_scores_101 AS
SELECT
    exam_id,
    AVG(score) AS average_score,
    COUNT(score) AS total_scores
FROM
    exam_scores
WHERE
    exam_id = 101
GROUP BY
    exam_id;
```

```sql title="Query the current result"
SELECT * FROM average_exam_scores_101;
------
 exam_id |   average_score   | total_scores 
---------+-------------------+--------------
     101 | 85.33333333333333 |            3
(1 row)
```

As new data is received, the `average_exam_scores_101` materialized view will be automatically updated. RisingWave performs incremental computations in the background to keep the results up to date.

Now, let's insert five additional rows of data into the `exam_scores` table and query the latest result from the `average_exam_scores_101` materialized view. This will provide us with the updated average score for examination 101.

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
dev=> SELECT * FROM average_exam_scores_101;
 exam_id | average_score | total_scores 
---------+---------------+--------------
     101 |         87.74 |            5
(1 row)
```

## What's next?

Congratulations! You've successfully started RisingWave and used it to perform some basic data analysis. To dive deeper, you may want to: 

- See [this GitHub repository](https://github.com/risingwavelabs/risingwave/tree/main/integration_tests) for ready-to-run demos and tests.
- Read our documentation to learn about how to ingest data from data streaming sources, transform data, and deliver data to downstream systems.