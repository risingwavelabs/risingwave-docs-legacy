---
id: ingest-from-upstash-kafka
title: Ingest data from Upstash Kafka
description: Connect RisingWave to a Kafka broker in Upstash.
slug: /ingest-from-upstash-kafka
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-upstash-kafka/" />
</head>

You can ingest data from Kafka deployed in Upstash into RisingWave. Upstash is a serverless platform that offers Redis, Kafka, and Qstash with the benefits of scalability, advanced security options, and dedicated support.

# Set Up Kafka on Uptash

This guide goes through the steps to create a Kafka cluster on Uptash and to connect it to RisingWave to read from it. For more information related to the data ingestion from Upstash, please refer to [Upstash Documentaion](https://upstash.com/docs/kafka/overall/getstarted).

## Sign Up for an Upstash Cloud Account

Start by signing up for a free Upstash Cloud account, which will grant you access to our Kafka services. To create your account, visit [Upstash Cloud Account](https://console.upstash.com/kafka).

![1](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/e7685303-1e16-4f00-8095-aa12de40e9e8)

## Create a Kafka Cluster

Once you're logged in, create your Kafka cluster with the following details:

- **Cluster Name**: Give your Kafka cluster a unique name for identification.
- **Region**: Choose the region where your Kafka cluster will be hosted.
- **Cluster Type**: Select the cluster type that suits your needs.

![2](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/b633cbc5-d084-47ab-99ae-61765fffb308)

## Set Up a Kafka Topic

After creating your Kafka cluster, set up a Kafka topic effortlessly. Upstash Kafka provides default configurations for the number of partitions and retention policy, simplifying the setup process.

![3](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/61003e9f-1cb1-4c45-a90d-ccefe5c6a835)

## Connect and Interact with Your Kafka Cluster

You're now ready to connect to your Kafka cluster using various Kafka clients. These clients enable you to both produce and consume data from your Kafka topic. This step empowers you to create real-time event-driven applications and services both using Kafka and RisingWave.

![4](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/5937c6c1-076a-4dab-8ceb-6abf9904743a)

With these four steps, you are on your way to leveraging the capabilities of Upstash Kafka. Explore the full potential of event streaming for your applications!

For detailed documentation and client-specific guides, please refer to our [Upstash Kafka Documentation](https://upstash.com/docs/kafka).

# Connect Upstash with RisingWave

Create a RisingWave cluster within [RisingWave Cloud](https://cloud.risingwave.com/) using the RisingWave free-tier account.

## Create a Source
After successfully deploying the RisingWave cluster, create a source in the RisingWave SQL editor as:

```sql
CREATE SOURCE wiki_source (
  contributor VARCHAR,
  title VARCHAR,
  timestamp TIMESTAMPTZ,
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
properties.sasl.password = ‘<your-password>’'
) FORMAT PLAIN ENCODE JSON;
```
## Create a Materialized View
We create a materialized view named wiki_mv based on the source wiki_source that filters out the rows with null values.

```sql
CREATE MATERIALIZED VIEW wiki_mv AS
SELECT  
  contributor,
  title,
  CAST(timestamp AS TIMESTAMP) AS timestamp,
  CAST(registration AS TIMESTAMP) AS registration,
  gender,
  CAST(edit_count AS INT) AS edit_count
FROM wiki_source
WHERE timestamp IS NOT NULL
  AND registration IS NOT NULL
  AND edit_count IS NOT NULL;
```
## Query the Materialized View

The materialized view can be queried to retrieve the latest data from the source:

```sql
SELECT * FROM wiki_mv LIMIT 5;
```
The retrieved result from the above query:
contributor    |   title                     |     timestamp             |       registration        | gender  | edit_count
---------------+-----------------------------+---------------------------+---------------------------+---------+-----------

Omnipaedista   | Template:Good and evil      | 2023-12-03 10:22:02+00:00 | 2008-12-14 06:02:32+00:00 | male    | 222563
PepeBonus      | Moshi mo Inochi ga Egaketara| 2023-12-03 10:22:16+00:00 | 2012-06-02 13:39:53+00:00 | unknown | 20731
Koulog         | Ionikos F.C.                | 2023-12-03 10:23:00+00:00 | 2023-10-28 05:52:35+00:00 | unknown | 691
Fau Tzy        | 2023 Liga 3 Maluku          | 2023-12-03 10:23:17+00:00 | 2022-07-23 09:53:11+00:00 | unknown | 4697
Cavarrone      | Cheers (season 8)           | 2023-12-03 10:23:40+00:00 | 2008-08-23 11:13:14+00:00 | male    | 83643

(5 rows)

Well done, you have consumed data from an Upstash Kafka topic into the RisingWave source table and then, queried it.
