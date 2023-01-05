---
id: clickstream-analysis
slug: /clickstream-analysis
title: Clickstream analysis
description: Use RisingWave to perform clickstream analysis.
---

## Overview

Whether a website gets a few hundred visitors a day or a few million, clickstream data can reveal valuable insights by using different metrics from the website. Not only does clickstream data reveal how popular a particular page on a website is, but it is also a useful substitute for traditional market research methods. We can determine the effectiveness of a digital marketing campaign, UX design, and more based on user behaviors without using traditional surveys.

Clickstream data provide a detailed log of how users travel through a particular website. It shows how long a user has been on a specific page, how they arrived at it, and what the user clicked on next. If many users quickly leave a page, it suggests that improvements are needed to encourage more user interaction.

In this tutorial, you will learn how to track the number of clicks a webpage gets over time with RisingWave. We have set up a demo cluster for this tutorial so you can easily try it out.


## Prerequisites

* Ensure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed in your environment. Note that Docker Compose is included in Docker Desktop for Windows and macOS. If you use Docker Desktop, ensure that it is running before launching the demo cluster.
* Ensure that the [PostgreSQL](https://www.postgresql.org/docs/current/app-psql.html) interactive terminal, `psql`, is installed in your environment. For detailed instructions, see [Download PostgreSQL](https://www.postgresql.org/download/).

## Step 1: Launch the demo cluster

In the demo cluster, we packaged RisingWave and a workload generator. The workload generator will start to generate random traffic and feed them into Kafka as soon as the cluster is started.

First, clone the [risingwave-demo](https://github.com/singularity-data/risingwave-demo) repository to the environment.

```shell
git clone https://github.com/risingwavelabs/risingwave-demo.git
```

Now navigate to the `clickstream` directory and start the demo cluster from the docker compose file. 

```shell
cd risingwave-demo/clickstream
docker-compose up -d
```

:::note

If the following error occurs:
```shell
ERROR: The Compose file './docker-compose.yml' is invalid because:
'name' does not match any of the regexes: '^x-'
```
Use `docker compose` instead of `docker-compose`, or enable **Use Docker Compose V2** on the Settings page of Docker Desktop.

For more information, see [Docker Documentation](https://docs.docker.com/compose/#compose-v2-and-the-new-docker-compose-command).

:::

Necessary RisingWave components will be started, including the frontend node, compute node, metadata node, and MinIO. The workload generator will start to generate random data and feed them into Kafka topics. In this demo cluster, data of materialized views will be stored in the MinIO instance.

Now connect to RisingWave to manage data streams and perform data analysis.

```shell
psql -h localhost -p 4566 -d dev -U root
```

## Step 2: Connect RisingWave to data streams

Now that we have set up the data stream in Kafka (in JSON) using the demo cluster, we can connect to the streams with the following SQL statement. The data contains information about what each user is clicking on and the timestamp of each event.

```sql
CREATE SOURCE user_behaviors (
    user_id VARCHAR,
    target_id VARCHAR,
    target_type VARCHAR,
    event_timestamp TIMESTAMP,
    behavior_type VARCHAR,
    parent_target_type VARCHAR,
    parent_target_id VARCHAR
) WITH (
    connector = 'kafka',
    topic = 'user_behaviors',
    properties.bootstrap.server = 'message_queue:29092',
    scan.startup.mode = 'earliest'
) ROW FORMAT JSON;
```

RisingWave is connected to the streams but has not started to consume data yet. For data to be processed, we need to define materialized views. After a materialized view is created, RisingWave will consume data from the specified offset.

## Step 3: Create materialized views

In this tutorial, we will create a materialized view that counts how many times a thread was clicked on over a day.

First, the `tumble()` function will map each event into a 10-minute window to create an intermediary table `t`, where the events will be aggregated on `target_id` and `window_time` to get the number of clicks for each thread. The events will also be filtered by `target_type` and `behavior_type`.

Next, the `hop()` function will create 24-hour time windows every 10 minutes. Each event will be mapped to corresponding windows. Finally, they will be grouped by `target_id` and `window_time` to calculate the total number of clicks of each thread within 24 hours. 

Please refer to [User time windows](/sql/functions-operators/sql-function-time-window.md) for an explanation of the tumble and hop functions and aggregations.


```sql
CREATE MATERIALIZED VIEW thread_view_count AS WITH t AS (
    SELECT
        target_id,
        COUNT() AS view_count,
        window_start as window_time
    FROM
        TUMBLE(
            user_behaviors,
            event_timestamp,
            INTERVAL '10 minutes'
        )
    WHERE
        target_type = 'thread'
        AND behavior_type = 'show'
    GROUP BY
        target_id,
        window_start
)
SELECT
    target_id,
    SUM(t.view_count) AS view_count,
    window_start,
    window_end
FROM
    HOP(
        t,
        t.window_time,
        INTERVAL '10 minutes',
        INTERVAL '1440 minutes'
    )
GROUP BY
    target_id,
    window_start,
    window_end;
```


## Step 4: Query the results 

We can query the most often viewed threads with the following statement. 

```sql
SELECT * FROM thread_view_count
ORDER BY view_count DESC, window_start
LIMIT 5;
```

The result may look like this:

```
 target_id | view_count |    window_start     |     window_end      
-----------+------------+---------------------+---------------------
 thread58  |         15 | 2022-09-22 06:50:00 | 2022-09-23 06:50:00
 thread58  |         15 | 2022-09-22 07:00:00 | 2022-09-23 07:00:00
 thread58  |         15 | 2022-09-22 07:10:00 | 2022-09-23 07:10:00
 thread58  |         15 | 2022-09-22 07:20:00 | 2022-09-23 07:20:00
 thread58  |         15 | 2022-09-22 07:30:00 | 2022-09-23 07:30:00
(5 rows)
```

We can also query results by specifying a time interval. To learn more about data and time functions and operators, see [Date and time](https://www.risingwave.dev/docs/latest/sql-function-datetime/). 

```sql
SELECT * FROM thread_view_count
WHERE window_start > ('2022-9-23 06:50' :: TIMESTAMP - INTERVAL '1 day')
AND window_start < 
('2022-9-23 07:40' :: TIMESTAMP - INTERVAL '1 day' + INTERVAL '10 minutes')
AND target_id = 'thread58'
ORDER BY window_start;
```

The result looks like this:

```
 target_id | view_count |    window_start     |     window_end      
-----------+------------+---------------------+---------------------
 thread58  |         15 | 2022-09-22 06:50:00 | 2022-09-23 06:50:00
 thread58  |         15 | 2022-09-22 07:00:00 | 2022-09-23 07:00:00
 thread58  |         15 | 2022-09-22 07:10:00 | 2022-09-23 07:10:00
 thread58  |         15 | 2022-09-22 07:20:00 | 2022-09-23 07:20:00
 thread58  |         15 | 2022-09-22 07:30:00 | 2022-09-23 07:30:00
 thread58  |         15 | 2022-09-22 07:40:00 | 2022-09-23 07:40:00
(6 rows)
```

When you finish, run the following command to disconnect RisingWave.

```shell
\q
```

Optional: To remove the containers and the data generated, use the following command.

```shell
docker-compose down -v
```

## Summary

In this tutorial, we learn:

* How to get time-windowed aggregate results by using the tumble and hop time window functions.
* How to compare time intervals. 


