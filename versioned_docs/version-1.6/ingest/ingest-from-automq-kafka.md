---
id: ingest-from-automq-kafka
title: Ingest data from AutoMQ Kafka
description: Ingest data from AutoMQ Kafka to RisingWave Cloud.
slug: /ingest-from-automq-kafka
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-automq-kafka/" />
</head>

[AutoMQ for Kafka](https://docs.automq.com/zh/docs/automq-s3kafka/YUzOwI7AgiNIgDk1GJAcu6Uanog) is a cloud-native version of Kafka specifically optimized for cloud environments. It is [open source](https://github.com/AutoMQ/automq-for-kafka), fully compatible with the Kafka protocol, and maximizes the advantages of the cloud. Unlike self-managed Apache Kafka, AutoMQ Kafka, with its cloud-native architecture, provides features such as automatic capacity scaling, self-balancing of network traffic, and seamless partition movement. These features result in a considerably reduced Total Cost of Ownership (TCO) for users.

This article will guide you on how to import data from AutoMQ Kafka into RisingWave Cloud.

## Prepare AutoMQ Kafka and generate test data

To set up your AutoMQ Kafka environment and test the data, please follow the [AutoMQ Quick Start guide](https://docs.automq.com/zh/docs/automq-s3kafka/VKpxwOPvciZmjGkHk5hcTz43nde). This guide will help you deploy your AutoMQ Kafka cluster. Ensure that RisingWave can directly connect to your AutoMQ Kafka server. You can refer [Create a VPC connection](https://docs.risingwave.com/cloud/create-a-connection/) to learn about how to establish a secure connection with your VPC through AWS PrivateLink or GCP Private Service Connect.

### Create a topic

Use Kafka’s command-line tools to create a topic. Ensure you have access to the Kafka environment and the Kafka service is running. Here is the command to create a topic:

```shell
./kafka-topics.sh --create --topic example_topic --bootstrap-server 10.0.96.4:9092 --partitions 1 --replication-factor 1
```
:::note

In this guide, `example_topic` and `10.0.96.4:9092` are used as examples of topic name and Kafka server address respectively. Please replace them with your actual topic name and Kafka server address.

:::


To check the result of the topic creation, use this command:
```shell
./kafka-topics.sh --describe example_topic --bootstrap-server 10.0.96.4:9092
```
### Generate test data

Generate a simple JSON format test data. For example:
```json
{
  "id": 1,
  "name": "testuser",
  "timestamp": "2023-11-10T12:00:00",
  "status": "active"
}
```

### Write test data to a topic

Use Kafka’s command-line tools or programming methods to write test data into the topic that you just created. Here is an example using command-line tools:
```shell
echo '{"id": 1, "name": "testuser", "timestamp": "2023-11-10T12:00:00", "status": "active"}' | sh kafka-console-producer.sh --broker-list 10.0.96.4:9092 --topic example_topic
```


To view the recently written topic data, use the following command:
```shell
sh kafka-console-consumer.sh --bootstrap-server 10.0.96.4:9092 --topic example_topic --from-beginning
```

## Create AutoMQ Kafka data source in RisingWave Cloud

1. If you do not have a RisingWave cluster, you need to create one by navigating to [**Clusters**](https://cloud.risingwave.com/clusters/) in RisingWave.
2. Go to [**Source**](https://cloud.risingwave.com/source/), and log in to your database. Create a database user if necessary.
3. Click **Create source**. Because AutoMQ Kafka is 100% compatible with Apache Kafka, you can simply select Kafka in the window that opens. 
5. Specify the parameters for connecting to the AutoMQ Kafka topic that you created earlier.

   :::note

   The default AutoMQ Kafka port is 9092 and SSL is not enabled. If you want to use SSL, please reference the [Apache Kafka Documentation](https://kafka.apache.org/documentation/#security_ssl) for details.
   
   In this guide, you can use JSON format and set the startup mode to `earliest` to read data from the beginning.

   :::

7. Check the generated SQL statement and click **Confirm** to create the source in your database.

## Query the ingested data

1. Go to [**Console**](https://cloud.risingwave.com/console/) and log into your cluster.
2. Run the following SQL to query the ingested data:
```sql
SELECT * from your_source_name limit 1;
```
:::note

Replace `your_source_name` with the name you defined when create the source.

:::

When you see actual results, that means that you have successfully ingested data from AutoMQ Kafka into RisingWave Cloud. You can now write more data into the topic, or transform the ingested data by creating materialized views in RisingWave Cloud.
