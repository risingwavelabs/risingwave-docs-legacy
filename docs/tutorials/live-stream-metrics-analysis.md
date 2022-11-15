---
id: live-stream-metrics-analysis
slug: /live-stream-metrics-analysis
title: Live stream metrics analysis
description: RisingWave makes it possible to analyze live stream metrics in a low code manner.
---

## Overview

Live streaming has become a popular form of entertainment where streamers can interact with their audience in real time. Not only do streamers want to keep a high view count, but they also want to maintain a high-quality stream to ensure the viewing experience is enjoyable for their audience.

There are numerous metrics to keep track of when sustaining a stable live stream. One of the most common metrics is how long the stream was frozen. Streamers and viewers do not want a stream frozen for long as it disrupts the experience.

In this tutorial, you will learn how to monitor live stream metrics, such as video quality and view count, using RisingWave. We have set up a demo cluster for this tutorial so you can easily try it out.

## Prerequisites

- Ensure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed in your environment. Note that Docker Compose is included in Docker Desktop for Windows and macOS. If you use Docker Desktop, ensure it is running before launching the demo cluster.
- Ensure that the [PostgreSQL](https://www.postgresql.org/docs/current/app-psql.html) interactive terminal, `psql`, is installed in your environment. For detailed instructions, see [Download PostgreSQL](https://www.postgresql.org/download/).

## Step 1: Launch the demo cluster

In the demo cluster, we packaged RisingWave and a workload generator. The workload generator will start to generate random traffic and feed them into Kafka as soon as the cluster is started.

First, clone the [risingwave-demo](https://github.com/singularity-data/risingwave-demo) repository to the environment.

```
git clone https://github.com/risingwavelabs/risingwave-demo.git
```

Now navigate to the live-stream directory and start the demo cluster from the docker compose file.

```
cd risingwave-demo/live-stream
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

```
psql -h localhost -p 4566 -d dev -U root
```

## Step 2: Connect RisingWave to data streams

Now that we have set up the data stream in Kafka (in JSON) using the demo cluster, we can connect to the streams with the following SQL statement. The data contains information regarding the video streaming metrics as well as the unique viewers of each stream.

```sql
CREATE SOURCE live_stream_metrics (
    client_ip VARCHAR,
    user_agent VARCHAR,
    user_id VARCHAR,
    room_id VARCHAR,
    video_bps BIGINT,
    video_fps BIGINT,
    video_rtt BIGINT,
    video_lost_pps BIGINT,
    video_total_freeze_duration BIGINT,
    report_timestamp TIMESTAMP,
    country VARCHAR
) WITH (
    connector = 'kafka',
    kafka.topic = 'live_stream_metrics',
    kafka.brokers = 'message_queue:29092',
    kafka.scan.startup.mode = 'earliest'
) ROW FORMAT JSON;
```

RisingWave is connected to the streams but has not started to consume data yet. For data to be processed, we need to define materialized views. After a materialized view is created, RisingWave will consume data from the specified offset.

## Step 3: Create materialized views

In this tutorial, we will create different materialized views that keep track of the video streaming performance and the viewer count.

### Set up materialized view for live stream performance

The first materialized view will summarize the streaming performance for each stream every 10 minutes. To create it, we will use the tumble function to map each event into a 10-minute window and aggregate based on each room to calculate how long the stream was frozen, the average number of packets lost per second, and the average round-trip time.

```sql
CREATE MATERIALIZED VIEW live_video_qos_10min AS
SELECT
    window_start AS report_ts,
    room_id,
    SUM(video_total_freeze_duration) AS video_total_freeze_duration,
    AVG(video_lost_pps) AS video_lost_pps,
    AVG(video_rtt) AS video_rtt
FROM
    TUMBLE(
        live_stream_metrics,
        report_timestamp,
        INTERVAL '10' MINUTE
    )
GROUP BY
    window_start,
    room_id;
```

We can query the results with the following SQL statement.

```sql
SELECT * FROM live_video_qos_10min ORDER BY room_id, report_ts;
```

Here is an example result.

```
      report_ts     |   room_id	 |video_total_freeze_duration | video_lost_pps |  video_rtt
--------------------+------------+----------------------------+----------------+-----------
2022-10-19 11:30:00 | 3998783950 |	          1528            |     4.64286    |  196.21429
2022-10-19 11:40:00	| 3998783950 |            3635            |     4.66667	   |  196.53333
2022-10-19 11:50:00	| 3998783950 |            603             |     4.09091	   |  175.18182
2022-10-19 11:30:00	| 658508327  |            1431	          |     4.32143	   |  201.35714
2022-10-19 11:40:00	| 658508327  |            3619	          |     5.23333	   |  191.86667

```

### Set up materialized view for view counts

Next, we will set up two materialized views to keep track of view counts.

The first materialized view will track the number of unique viewers on the entire streaming site every minute. We will use the tumble function to map each event into a one-minute window and count the number of distinct viewers within each time window.

```sql
-- A real-time dashboard of the total UV.
CREATE MATERIALIZED VIEW total_user_visit_1min AS
SELECT
    window_start AS report_ts,
    COUNT(DISTINCT user_id) AS uv
FROM
    TUMBLE(
        live_stream_metrics,
        report_timestamp,
        INTERVAL '1' MINUTE
    )
GROUP BY
    window_start;
```

We can query the results with the following SQL statement.

```sql
SELECT * FROM total_user_visit_1min ORDER BY report_ts;
```

Here is an example result.

```
      report_ts    	| uv
--------------------+----
2022-10-19 11:35:00	| 2
2022-10-19 11:36:00	| 2
2022-10-19 11:37:00	| 2
2022-10-19 11:38:00	| 2
2022-10-19 11:39:00	| 2
```

The second materialized view will track each streamer’s unique viewers every minute. We will use the tumble function to map each event into a one-minute window and then group by the room_id to each streamer’s unique viewers.

```sql
CREATE MATERIALIZED VIEW room_user_visit_1min AS
SELECT
    window_start AS report_ts,
    COUNT(DISTINCT user_id) AS uv,
    room_id
FROM
    TUMBLE(
        live_stream_metrics,
        report_timestamp,
        INTERVAL '1' MINUTE
    )
GROUP BY
    window_start,
    room_id;
```

We can query the results with the following SQL statement.

```sql
SELECT * FROM room_user_visit_1min ORDER BY room_id, report_ts;
```

Here is an example result.

```
      report_ts     | uv |  room_id
--------------------+----+-----------
2022-10-19 11:35:00 | 1  | 3998783950
2022-10-19 11:36:00 | 1  | 3998783950
2022-10-19 11:37:00 | 1  | 3998783950
2022-10-19 11:38:00 | 1  | 3998783950
2022-10-19 11:39:00 | 1  | 3998783950

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

- How to analyze video streaming metrics.
- How to set up a real-time dashboard to keep track of the number of unique viewers.