---
id: ingest-from-upstash-kafka
title: Ingest data from Upstash Kafka
description: Connect RisingWave to a Kafka broker in Upstash.
slug: /ingest-from-upstash-kafka
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-upstash-kafka/" />
</head>

You can ingest data from Kafka deployed in Upstash into RisingWave. Upstash is a serverless platform that offers Redis, Kafka, and Qstash, providing the benefits of scalability, advanced security options, and dedicated support.

## Set up Kafka on Uptash

This guide goes through the steps to create a Kafka cluster on Uptash and to connect it to RisingWave for data ingestion. For more information regarding the data ingestion from Upstash, please refer to [Upstash Documentation](https://upstash.com/docs/kafka/overall/getstarted).

### Sign up for an Upstash Cloud account

Begin by signing up for a free Upstash Cloud account, which provides access to Kafka services. To create an account, visit [Upstash Cloud Account](https://console.upstash.com/kafka).

<img
  src={require('../images/upstash-signup.png').default}
  alt="Sign up for Upstash Cloud"
/>

### Create a Kafka cluster

Once you are logged in, create your Kafka cluster with the following details:

- **Cluster Name**: Give your Kafka cluster a unique name for identification.
- **Region**: Choose the region where your Kafka cluster will be hosted.
- **Cluster Type**: Select the cluster type that suits your needs.

<img
  src={require('../images/upstash-create-cluster.png').default}
  alt="Create a cluster"
/>

### Set up a Kafka topic

After creating your Kafka cluster, set up a Kafka topic. Upstash Kafka provides default configurations for the number of partitions and retention policy, simplifying the setup process.

<img
  src={require('../images/upstash-create-topic.png').default}
  alt="Create a topic"
/>

### Connect and interact with your Kafka cluster

You are now ready to connect to your Kafka cluster using various Kafka clients. These clients enable you to both produce and consume data from your Kafka topic. Therefore, you can extract real-time data from the Python Wikipedia API and feed it into a Kafka topic in Upstash.

<img
  src={require('../images/upstash-connect-interact.png').default}
  alt="Connect and interact with your Kafka cluster"
/>

With these steps, you are on your way to leveraging the capabilities of Upstash Kafka and RisingWave to build stream processing applications and pipelines!

For detailed documentation and client-specific guides, please refer to [Upstash Kafka Documentation](https://upstash.com/docs/kafka).

## Ingest and process data from Upstash Kafka

### Create a RisingWave cluster

Create a RisingWave cluster in [RisingWave Cloud](https://cloud.risingwave.com/) using the free plan. See the [documentation of RisingWave Cloud](https://docs.risingwave.com/cloud/manage-clusters/) for instructions.

### Create a source

Once you have deployed the RisingWave cluster, create a source in the [Query console](https://docs.risingwave.com/cloud/console-overview/) using the following SQL query:

```sql
CREATE SOURCE wiki_source (
  contributor VARCHAR,
  title VARCHAR,
  edit_timestamp TIMESTAMPTZ,
  registration TIMESTAMPTZ,
  gender VARCHAR,
  edit_count VARCHAR
)
WITH(
  connector = 'kafka',
  topic = '<topic-name>', 
  properties.bootstrap.server = '<broker-url>', 
  scan.startup.mode = 'earliest', 
  properties.sasl.mechanism = 'SCRAM-SHA-512', 
  properties.security.protocol = 'SASL_SSL', 
  properties.sasl.username = '<your-username>', 
  properties.sasl.password = '<your-password>'
) FORMAT PLAIN ENCODE JSON;
```

### Create a materialized view

Let's create a materialized view named `wiki_mv` based on the source `wiki_source`, which filters out the rows with null values.

```sql
CREATE MATERIALIZED VIEW wiki_mv AS
SELECT  
  contributor,
  title,
  CAST(edit_timestamp AS TIMESTAMP) AS edit_timestamp,
  CAST(registration AS TIMESTAMP) AS registration,
  gender,
  CAST(edit_count AS INT) AS edit_count
FROM wiki_source
WHERE edit_timestamp IS NOT NULL
  AND registration IS NOT NULL
  AND edit_count IS NOT NULL;
```

### Query the materialized view

The materialized view can be queried to retrieve the latest data from the source:

```sql
SELECT * FROM wiki_mv LIMIT 5;
```

The retrieved result should look like this:

```
contributor    |   title                     |     edit_timestamp             |       registration        | gender  | edit_count
---------------+-----------------------------+---------------------------+---------------------------+---------+-----------

Omnipaedista   | Template:Good and evil      | 2023-12-03 10:22:02+00:00 | 2008-12-14 06:02:32+00:00 | male    | 222563
PepeBonus      | Moshi mo Inochi ga Egaketara| 2023-12-03 10:22:16+00:00 | 2012-06-02 13:39:53+00:00 | unknown | 20731
Koulog         | Ionikos F.C.                | 2023-12-03 10:23:00+00:00 | 2023-10-28 05:52:35+00:00 | unknown | 691
Fau Tzy        | 2023 Liga 3 Maluku          | 2023-12-03 10:23:17+00:00 | 2022-07-23 09:53:11+00:00 | unknown | 4697
Cavarrone      | Cheers (season 8)           | 2023-12-03 10:23:40+00:00 | 2008-08-23 11:13:14+00:00 | male    | 83643

(5 rows)
```

You have successfully consumed data from an Upstash Kafka topic into the RisingWave, created a source and a materialized view, and then queried it.
