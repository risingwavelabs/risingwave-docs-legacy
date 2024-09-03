---
sidebar_position: 3
id: architecture
title: Architecture
slug: /architecture

---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/architecture/" />
</head>

RisingWave includes these key components:

* A serving layer that parses SQL queries and performs planning and optimizations of query jobs.
* A processing layer that performs all the data computation and status updates.
* A metadata management service that manages the metadata of different nodes, and coordinates operations among these nodes. It consists of a local metadata store and various management modules.
* A storage layer that stores data to and retrieves data from object storage like S3.

![RisingWave Architecture](./images/architecture.png)
