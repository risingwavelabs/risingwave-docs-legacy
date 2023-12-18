---
id: ingest-from-upstash-kafka
title: Ingest data from Upstash Kafka
description: Connect RisingWave to a Kafka broker in Upstash.
slug: /ingest-from-upstash-kafka
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-upstash-kafka/" />
</head>
# Install Kafka (via Upstash)

Follow these four easy steps to get started with Upstash Kafka:

## 1. Sign Up for an Upstash Cloud Account

Start by signing up for a free Upstash Cloud account, which will grant you access to our Kafka services. To create your account, visit [Upstash Cloud Account](https://console.upstash.com/kafka).

![1](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/e7685303-1e16-4f00-8095-aa12de40e9e8)

## 2. Create a Kafka Cluster

Once you're logged in, create your Kafka cluster with the following details:

- **Cluster Name**: Give your Kafka cluster a unique name for identification.
- **Region**: Choose the region where your Kafka cluster will be hosted.
- **Cluster Type**: Select the cluster type that suits your needs.

![2](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/b633cbc5-d084-47ab-99ae-61765fffb308)

## 3. Set Up a Kafka Topic

After creating your Kafka cluster, set up a Kafka topic effortlessly. Upstash Kafka provides default configurations for the number of partitions and retention policy, simplifying the setup process.

![3](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/61003e9f-1cb1-4c45-a90d-ccefe5c6a835)

## 4. Connect and Interact with Your Kafka Cluster

You're now ready to connect to your Kafka cluster using various Kafka clients. These clients enable you to both produce and consume data from your Kafka topic. This step empowers you to create real-time event-driven applications and services both using Kafka and RisingWave.

![4](https://github.com/fahadullahshah261/risingwave-tutorials/assets/99340455/5937c6c1-076a-4dab-8ceb-6abf9904743a)

With these four steps, you are on your way to leveraging the capabilities of Upstash Kafka. Explore the full potential of event streaming for your applications!

For detailed documentation and client-specific guides, please refer to our [Upstash Kafka Documentation](https://upstash.com/docs/kafka).

# Connect Upstash with RisingWave

Create a RisingWave cluster within [RisingWave Cloud](https://cloud.risingwave.com/) using RisingWave free-tier account.
After succesfully deploying RisingWave cluster, create a source table in RisingWave SQL editor as:

```sql
CREATE TABLE customer(
customer_id INT,
customer_name VARCHAR
)
WITH(
connector = 'kafka',
topic = '<topic-name>', 
properties.bootstrap.server = '<broker-url>', 
scan.startup.mode = 'earliest', 
properties.sasl.mechanism = 'SCRAM-SHA-512', 
properties.security.protocol = 'sasl_ssl', 
properties.sasl.username = '<your-username>', 
properties.sasl.password = ‘<your-password>’'
) FORMAT PLAIN ENCODE JSON;
```
After successfully ingesting data from Upstash into RisingWave, creating a source table, now you can query the data as:

```sql
SELECT * FROM customer;
```
Well done, you have consumed data from an Upstash Kafka topic into the RisingWave source table and then, queried it.

For more information related to the data ingestion from Upstash, please refer to [Upstash Documentaion](https://upstash.com/docs/kafka/overall/getstarted).
