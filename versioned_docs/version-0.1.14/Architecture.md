---
sidebar_postion: 3
id: architecture
title: Architecture
slug: /architecture

---


RisingWave includes these key components:

* A serving layer that parses SQL queries and performs planning and optimizations of query jobs.
* A processing layer that performs all the data computation and status updates.
* A meta server that coordinates the operations between the serving layer and the processing layer.
* A persistence layer that stores data to and retrieves data from object storage like S3.


<img
  src={require('./images/archi_external.png').default}
  alt="RisingWave Architecture"
/>
