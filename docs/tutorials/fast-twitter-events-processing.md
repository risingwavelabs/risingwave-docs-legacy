---
id: fast-twitter-events-processing
slug: /fast-twitter-events-processing
title: Fast Twitter events processing
description: RisingWave makes it possible to process and analyze Twitter events in a low code manner.
---

## Overview
Social media platforms process countless messages from millions of users every day. It is demanding for companies to keep up with these posts as popular topics are constantly changing. But analyzing these messages is imperative as it allows businesses to make more strategic business decisions by understanding the values of their consumers and competitors. A streaming system would be helpful in this case as it enables companies to update with trending topics constantly.

To keep track of topics, social media platforms, such as Twitter, use hashtags to indicate what their post is about. The number of times a hashtag is used tracks audience engagement. If a hashtag is used often, it suggests that a particular topic is popular. And if we track how often a hashtag is used over time, we can determine if audience engagement is increasing or decreasing.

In this tutorial, you will learn how to extract valuable insights from text data using RisingWave. We have set up a demo cluster for this tutorial, so you can easily try it out.

## Prerequisites

* Ensure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed in your environment. Note that Docker Compose is included in Docker Desktop for Windows and macOS. If you use Docker Desktop, ensure that it is running before launching the demo cluster.
* Ensure that the [PostgreSQL](https://www.postgresql.org/docs/current/app-psql.html) interactive terminal, `psql`, is installed in your environment. For detailed instructions, see [Download PostgreSQL](https://www.postgresql.org/download/).

## Step 1: Launch the demo cluster

In the demo cluster, we packaged RisingWave and a workload generator. The workload generator will start to generate random traffic and feed them into Kafka as soon as the cluster is started.

First, clone the [risingwave-demo](https://github.com/singularity-data/risingwave-demo) repository to the environment.

```shell
git clone https://github.com/risingwavelabs/risingwave-demo.git
```

Now navigate to the `twitter` directory and start the demo cluster from the docker compose file. 

```shell
cd risingwave-demo/twitter
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

This tutorial will use RisingWave to consume data streams and perform data analysis. Tweets will be used as sample data so we can query the most popular hashtags on a given day to keep track of trending topics.

Below are the schemas for tweets and Twitter users. In the `tweet` schema, `text` contains the content of a tweet, and `created_at` contains the date and time when a tweet was posted. Hashtags will be extracted from `text`. 

```json
{
    "tweet": {
        "created_at": "2020-02-12T17:09:56.000Z",
        "id": "1227640996038684673",
        "text": "Doctors: Googling stuff online does not make you a doctor\n\nDevelopers: https://t.co/mrju5ypPkb",
        "lang": "English"
    },
    "author": {
        "created_at": "2013-12-14T04:35:55.000Z",
        "id": "2244994945",
        "name": "Singularity Data",
        "username": "singularitty"
    }
}
```

Connect to the data stream with the following SQL statement. 

```sql
CREATE SOURCE twitter (
    data STRUCT < created_at TIMESTAMP,
    id VARCHAR,
    text VARCHAR,
    lang VARCHAR >,
    author STRUCT < created_at TIMESTAMP,
    id VARCHAR,
    name VARCHAR,
    username VARCHAR,
    followers INT >
) WITH (
    connector = 'kafka',
    topic = 'twitter',
    properties.bootstrap.server = 'message_queue:29092',
    scan.startup.mode = 'earliest'
) ROW FORMAT JSON;
```

Note that the SQL statement uses the STRUCT data type. For details about the STRUCT data type, please see [Data types.](https://www.risingwave.dev/docs/latest/sql-data-types/)

## Step 3: Define a materialized view and analyze data
This tutorial will create a materialized view that tracks how often each hashtag is used daily. 

To do so, start by extracting all the hashtags used within a tweet by using the `regexp_matches` function. For instance, if given the following tweet:

>Struggling with the high cost of scaling? Fret not! [#RisingWave](https://twitter.com/hashtag/RisingWave?src=hashtag_click) cares about performance and cost-efficiency. We use a tiered architecture that fully utilizes the [#cloud](https://twitter.com/hashtag/cloud?src=hashtag_click) resources to give the users fine-grained control over cost and performance.

The `regexp_matches` function will find all the text in the tweet that matches the RegEx pattern `#\w+`. This extracts all the hashtags from the tweet and stores them in an array.

```
       hashtag	      |     created_at
----------------------+--------------------
[#RisingWave, #cloud] | 2022-05-18 17:00:00
```

Then the `unnest` function will separate each item in the array into separate rows.
```
   hashtag   |     created_at
----------------------------------
 #RisingWave | 2022-05-18 17:00:00
   #cloud    | 2022-05-18 17:00:00
```

Finally, we can group by `hashtag` and `window_start` to count how many times each hashtag was used daily.

```sql
CREATE MATERIALIZED VIEW hot_hashtags AS WITH tags AS (
    SELECT
        unnest(regexp_matches((data).text, '#\w+', 'g')) AS hashtag,
        (data).created_at AS created_at
    FROM
        twitter
)
SELECT
    hashtag,
    COUNT(*) AS hashtag_occurrences,
    window_start
FROM
    TUMBLE(tags, created_at, INTERVAL '1 day')
GROUP BY
    hashtag,
    window_start;
```

## Step 4: Query the results 

We can query the ten most often used hashtags.  

```sql
SELECT * FROM hot_hashtags
ORDER BY hashtag_occurrences DESC
LIMIT 10;
```

The results may look like this:

```
  hashtag  | hashtag_occurrences |    window_start
------------------------------------------------------
   #Multi  |         262         | 2022-08-18 00:00:00
   #zero   |         198         | 2022-08-18 00:00:00
 knowledge |         150         | 2022-08-18 00:00:00
   #Open   |         148         | 2022-08-18 00:00:00
   #User   |         142         | 2022-08-18 00:00:00
  #Cross   |         141         | 2022-08-18 00:00:00
  #local   |         139         | 2022-08-18 00:00:00
  #client  |         138         | 2022-08-18 00:00:00
  #system  |         135         | 2022-08-18 00:00:00
    #Re    |         132         | 2022-08-18 00:00:00
```

Most used hashtags from different dates will be shown if the workload generator runs for multiple days.

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

* How to define a nested table with RisingWave.
* How to extract character combinations from a string using regular expressions.


