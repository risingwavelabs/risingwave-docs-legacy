---
id: supabase-integration
title: Supabase Integration
description: Use RisingWave in Supabase application to enpower real-time data processing. 
slug: /supabase-integration
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/supabase-integration/" />
</head>

Supabase is an open source Firebase alternative. It uses Postgres database as the underlying storage. This [blog](https://www.risingwave.com/blog/unleash-the-true-power-of-supabase-realtime-with-risingwave/) shows how Supabase users can seamlessly integrate with RisingWave to enpower the product with stream processing ability. 

In this example, we will use Supabase to create a simple demo of social media platform where users can send posts. The example will be illustrated by
the following steps:

* Ingest data from Supabase into RisingWave.
* Calculate the real-time results of recent posts, the number of posts sent by users.
* Sink real-time results from RisingWave into Supabase.

## Prerequisites

* Follow the instruction [here](https://docs.risingwave.com/cloud/quickstart/) to start a free-tier RisingWave cluster. 
* Create a new [Supabase](https://supabase.com/docs/guides/getting-started) project.

## Create Supabase Tables and Replication

First, let's create two tables in Supabase. One is `users` table to store user information, and the other is `posts` table to store posts sent by users.

<img
  src={require('../images/supabase-integration/supabase-table-visualization.png').default}
  alt="Supabase tables visualization"
/>

Make sure the data replication of these two tables are enabled. More information about data replication can be found [here](https://supabase.com/docs/guides/database/replication).

<img
  src={require('../images/supabase-integration/supabase-replication.png').default}
  alt="Enable table replication in Supabase"
/>

## Ingest Data into RisingWave
Then we can [postgres-cdc connector](https://docs.risingwave.com/docs/1.1/ingest-from-postgres-cdc/) to replicate data from Supabase to RisingWave. 
Note that the data are ingested into RisingWave in real-time. To do this, we can use [RisingWave Web Console](https://docs.risingwave.com/cloud/console-overview/) or any other Postgres client tools to run the following SQL statements in the RisingWave cluster.
```sql
CREATE TABLE users (
  id int8,
  created_at TIMESTAMPTZ, 
  name string,
  PRIMARY KEY(id)
) 
WITH (
  connector='postgres-cdc',
  hostname = 'db.xxxxxx.supabase.co',
  port = '5432',
  username = 'postgres',
  password = 'xxxxxx',
  database.name = 'postgres',
  schema.name = 'public',
  table.name = 'users',
  publication.name = 'rw_publication' -- Database Replications name in Supabase
);

CREATE TABLE posts (
  id int8,
  created_at TIMESTAMPTZ, 
  user_id int8,
  content string,
  PRIMARY KEY(id)
) 
WITH (
  ...... -- same as above
);
```

## Calculate Real-Time Results
With the data ingested from the source, we can create some metrialized views now. 
Note that the results of materialized views are updated in real-time. 
So if you query the materialized views, you will always get the latest results at different time.
Use [RisingWave Web Console](https://docs.risingwave.com/cloud/console-overview/) or any other Postgres client tools to run the following SQL statements in the RisingWave cluster.

### Recent Posts
The following SQL statement creates a materialized view in RisingWave to show the most recent 100 posts.
```sql
CREATE MATERIALIZED VIEW recent_posts AS (
  SELECT name, content, posts.created_at as created_at FROM posts 
  JOIN users ON posts.user_id = users.id
  ORDER BY posts.created_at DESC LIMIT 100
);
```

### Trending Hashtags
The following SQL statement creates a materialized view in RisingWave to show the daily trending hashtags.
```sql
CREATE MATERIALIZED VIEW hot_hashtags AS WITH tags AS (
  SELECT
    regexp_matches(content, '#\w+', 'g') AS hashtag,
    created_at
  FROM posts
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

### The Number of Posts Sent by Users
The following SQL statement creates a materialized view in RisingWave to show the number of posts sent by users.
```sql
CREATE MATERIALIZED VIEW user_posts_cnt AS (
  SELECT 
    users.id as user_id,
    COUNT(posts.id) as cnt 
  FROM posts JOIN users ON users.id = posts.user_id
  GROUP BY users.id
);
```

## Sink Real-Time Results into Supabase
Though RisingWave can serve those real-time results directly, you might want to process these results in Supabase for other business logic. 
RisingWave support [JDBC connector](https://docs.risingwave.com/docs/1.1/sink-to-postgres/) to sink data from RisingWave to Supabase.

Let's sink the real-time result of the number of posts sent by users to Supabase. 
Before we create the sink in RisingWave, we need to create the destination table `user_posts_cnt` in Supabase. Now the schema looks like:

<img
  src={require('../images/supabase-integration/supabase-sink-table.png').default}
  alt="new table for sink in supabase"
/>

After the table is created, we can now execute the following statement in RisingWave to sink the result to the Supabase table we just created.
```sql
CREATE SINK supabase_user_posts_cnt 
FROM user_posts_cnt WITH (
  connector='jdbc',
  jdbc.url='jdbc:postgresql://db.xxxxxx.supabase.co:5432/postgres?user=postgres&password=xxxxxx',
  table.name = 'user_posts_cnt',
  type = 'upsert',
  primary_key= 'user_id'
)
```
Once the sink is successfully created, you should be able to see the results in Supabase. Try to send some posts in the Supabase application and you will see the results are updated in real-time.
