---
id: ingest-from-automq-kafka
title: Ingest data from AutoMQ Kafka
description: Connect RisingWave to a AutoMQ Kafka.
slug: /ingest-from-automq-kafka
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-kafka/" />
</head>

[AutoMQ for Kafka](https://docs.automq.com/zh/docs/automq-s3kafka/YUzOwI7AgiNIgDk1GJAcu6Uanog) is a cloud-native version of Kafka redesigned for cloud environments. 
AutoMQ Kafka is [open source](https://github.com/AutoMQ/automq-for-kafka) and fully compatible with the Kafka protocol, fully leveraging cloud benefits. 
Compared to self-managed Apache Kafka, AutoMQ Kafka, with its cloud-native architecture, offers features like capacity auto scaling, self-balancing of network traffic, move partition in seconds. These features contribute to a significantly lower Total Cost of Ownership (TCO) for users.

This article will guide you on how to import data from AutoMQ Kafka into RisingWave using the RisingWave Cloud.

## Prepare AutoMQ Kafka and test data
To prepare your AutoMQ Kafka environment and test data, follow the AutoMQ [Quick Start](https://docs.automq.com/zh/docs/automq-s3kafka/VKpxwOPvciZmjGkHk5hcTz43nde) guide to deploy your AutoMQ Kafka cluster. Ensure that RisingWave can directly connect to your AutoMQ Kafka server. 
You can refer [Create a VPC connection](https://docs.risingwave.com/cloud/create-a-connection/) to establish a secure connection with your VPC through AWS PrivateLink or GCP Private Service Connect.


To quickly create a topic named `example_topic` in AutoMQ Kafka and write a test JSON data into it, follow these steps:
#### Create a topic
Use Kafka’s command-line tools to create a topic. Ensure you have access to the Kafka environment and the Kafka service is running. Here is the command to create a topic:
```shell
./kafka-topics.sh --create --topic example_topic --bootstrap-server 10.0.96.4:9092 --partitions 1 --replication-factor 1
```
:::note

Replace `topic` and `bootstrap-server` with your Kafka server address.

:::


To check the result of the topic creation, use this command:
```shell
./kafka-topics.sh --describe example_topic --bootstrap-server 10.0.96.4:9092
```
#### Generate test data
Generate a simple JSON format test data
```json
{
  "id": 1,
  "name": "testuser",
  "timestamp": "2023-11-10T12:00:00",
  "status": "active"
}
```

#### Write test data
Use Kafka’s command-line tools or programming methods to write test data into example_topic. Here is an example using command-line tools:
```shell
echo '{"id": 1, "name": "testuser", "timestamp": "2023-11-10T12:00:00", "status": "active"}' | sh kafka-console-producer.sh --broker-list 10.0.96.4:9092 --topic example_topic
```

:::note

Replace `topic` and `bootstrap-server` with your Kafka server address.

:::

To view the recently written topic data, use the following command:
```shell
sh kafka-console-consumer.sh --bootstrap-server 10.0.96.4:9092 --topic example_topic --from-beginning
```

## Create AutoMQ Kafka data source in RisingWave Cloud
1. Go to [**Clusters**](https://cloud.risingwave.com/clusters/) and create a RisingWave cluster.
2. Go to [**Source**](https://cloud.risingwave.com/source/).
3. Specify the cluster and database, and log in as a database user.
4. AutoMQ Kafka is 100% compatible with Apache Kafka, just click **Create source** and select Kafka. 
5. Configure the connector settings, source details, and schema according to the instuctions of the guided setup.

   :::note

   Default AutoMQ Kafka port is 9092 and SSL is not enabled. If you want to use SSL, please reference the [Apache Kafka Documentation](https://kafka.apache.org/documentation/#security_ssl).
   You can use json format and set startup mode to earliest to read data from the beginning in this example.

   :::

6. Check the generated SQL statement and click **Confirm** to create the source in your database.

## Query the ingested data
1. Go to [**Console**](https://cloud.risingwave.com/console/) and login your cluster
2. Run the following SQL to query the ingested data:
```sql
SELECT * from your_source_name limit 1;
```
:::note

Replace your_source_name with the name you defined when create source.

:::
