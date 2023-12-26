---
id: ingest-from-instaclustr-kafka
title: Ingest data from Instaclustr Kafka
description: Connect RisingWave to a Kafka broker in Instaclustr Cloud.
slug: /ingest-from-instaclustr-kafka
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-instaclustr-kafka/" />
</head>

You can ingest data from Kafa deployed in Instaclustr, a fully managed and integrated platform with popular open-source tools such as Kafka, PostgreSQL, Cassandra, and Redis.
It facilitates easy Kafka Connect integration and includes a dedicated ZooKeeper along with Kraft that delivers a seamless Kafka journey with a 100% open-source solution.

## Set up Kafka on Instaclustr Cloud
This guide goes through the steps to create a Kafka cluster in Instaclustr and to connect it to RisingWave for data ingestion.
For more information regarding the data ingestion from Instaclustr Cloud, please refer to [Instaclustr Documentation](https://www.instaclustr.com/support/documentation/).

### Sign up for an Upstash Cloud account
Start by signing up for a free Instaclustr account, which will grant you access to Kafka services. To create your account, visit [Instaclustr Cloud](https://console2.instaclustr.com/signup?_gl=1*jofjww*_ga*OTI5OTY0NzUuMTY5OTU5NTc3Mw..*_ga_4NBQSJMP6D*MTcwMTM1MjQwMi4xMy4xLjE3MDEzNTI0ODMuNDAuMC4w&_ga=2.16614709.220277079.1701352406-92996475.1699595773). 



