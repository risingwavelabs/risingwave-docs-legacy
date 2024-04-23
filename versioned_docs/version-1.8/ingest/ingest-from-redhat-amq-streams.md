---
 id: ingest-from-redhat-amq-streams
 title: Ingest data from RedHat AMQ Streams
 description: Describes how to ingest data from RedHat AMQ Streams.
 slug: /ingest-from-redhat-amq-streams
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-redhat-amq-streams/" />
</head>

You can ingest data from RedHat AMQ Streams into RisingWave by using the Kafka source connector in RisingWave.

[AMQ Streams](https://developers.redhat.com/products/amq/overview) offers a distributed backbone that allows microservices and other applications to share data with extremely high throughput and extremely low latency. It is based on the [Strimzi](http://strimzi.io/) and [Apache Kafka](http://kafka.apache.org/) projects. AMQ Streams features a wide range of capabilities, including publish and subscribe functionality, long-term data retention, advanced queueing, replayable events, and partitioned messages for scalability.

## Prerequisites

Before ingesting data from RedHat AMQ Streams into RisingWave, please ensure the following:

- The AMQ Streams cluster is running and accessible from your RisingWave cluster.
- Allow the AMQ Streams cluster so that RisingWave can ingest data. Ensure you possess the client username and password if authentication is necessary for the cluster.
- Create the AMQ Streams topic from which you want to ingest data.
- Ensure that your RisingWave cluster is running.

For example, we create a topic named `financial-transactions` with the following sample data from various  financial transactions data, formatted as JSON. Each sample represents a unique transaction with distinct transaction IDs, sender and receiver accounts, amounts, currencies, and timestamps.  Hence AMQ Streams is compatible with Apache Kafka. For more information, refer to [Apache Kafka](https://docs.risingwave.com/docs/current/ingest-from-kafka/).

```json
{"tx_id": "TX1004", "sender_account": "ACC1004", "receiver_account": "ACC2004", "amount": 2000.00, "currency": "USD", "tx_timestamp": "2024-03-29T12:36:00Z"}
{"tx_id": "TX1005", "sender_account": "ACC1005", "receiver_account": "ACC2005", "amount": 450.25, "currency": "EUR", "tx_timestamp": "2024-03-29T12:36:15Z"}
{"tx_id": "TX1006", "sender_account": "ACC1006", "receiver_account": "ACC2006", "amount": 1250.00, "currency": "USD", "tx_timestamp": "2024-03-29T12:36:30Z"}
{"tx_id": "TX1007", "sender_account": "ACC1007", "receiver_account": "ACC2007", "amount": 830.50, "currency": "GBP", "tx_timestamp": "2024-03-29T12:36:45Z"}
{"tx_id": "TX1008", "sender_account": "ACC1008", "receiver_account": "ACC2008", "amount": 540.00, "currency": "EUR", "tx_timestamp": "2024-03-29T12:37:00Z"}
{"tx_id": "TX1009", "sender_account": "ACC1009", "receiver_account": "ACC2009", "amount": 975.75, "currency": "GBP", "tx_timestamp": "2024-03-29T12:37:15Z"}
{"tx_id": "TX1010", "sender_account": "ACC1010", "receiver_account": "ACC2010", "amount": 1600.00, "currency": "USD", "tx_timestamp": "2024-03-29T12:37:30Z"}
```

## Ingest data into RisingWave

### Create a table

In RisingWave, create a table named `financial-transactions` to connect RisingWave to the AMQ Streams topic.

```sql
CREATE TABLE financial_transactions (
    tx_id VARCHAR PRIMARY KEY,
    sender_account VARCHAR,
    receiver_account VARCHAR,
    amount NUMERIC,
    currency VARCHAR,
    tx_timestamp TIMESTAMP
)
WITH(
  connector='kafka', 
  topic = 'financial-transactions', 
  properties.bootstrap.server = 'localhost:9092',
  scan.startup.mode = 'earliest'
  ) 
  FORMAT PLAIN ENCODE JSON;
```

### Query the table

Let's retrieve data from the created table:

```sql
SELECT * FROM financial_transactions LIMIT 5;
```

Expected result:

```
 tx_id  | sender_account | receiver_account | amount  | currency |      tx_timestamp      
--------+----------------+------------------+---------+----------+------------------------
 TX1004 | ACC1004        | ACC2004          | 2000.00 | USD      | 2024-03-29 12:36:00+00
 TX1005 | ACC1005        | ACC2005          |  450.25 | EUR      | 2024-03-29 12:36:15+00
 TX1006 | ACC1006        | ACC2006          | 1250.00 | USD      | 2024-03-29 12:36:30+00
 TX1007 | ACC1007        | ACC2007          |  830.50 | GBP      | 2024-03-29 12:36:45+00
 TX1008 | ACC1008        | ACC2008          |  540.00 | EUR      | 2024-03-29 12:37:00+00
(5 rows)
```

You have consumed data from an AMQ Streams topic into the RisingWave, created a table, and then queried it.
