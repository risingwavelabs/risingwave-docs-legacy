---
sidebar_position: 3
id: architecture
title: Architecture
slug: /architecture

---


RisingWave includes these key components:

* A serving layer that parses SQL queries and performs planning and optimizations of query jobs.
* A processing layer that performs all the data computation and status updates.
* A metadata management layer that coordinates the operations across all other layers.
* A storage layer that stores data to and retrieves data from object storage like S3.

<img
  src={require('./images/architecture.png').default}
  alt="RisingWave Architecture"
/>
