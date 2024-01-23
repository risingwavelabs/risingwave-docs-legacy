---
id: rw-faq
title: RisingWave frequently asked questions
description: RisingWave frequently asked questions
slug: /rw-faq
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/rw-faq/" />
</head>

This topic lists frequently asked questions to provide the information you need and streamline your experience when using RisingWave.

## Why does RisingWave not accept Kafka consumer group IDs?

A Kafka consumer group is a concept in Apache Kafka, a distributed streaming platform. It refers to a group of consumers that work together to consume data from one or more topics.

1. **Grouping consumers**: Kafka allows multiple consumers to form a group (called a consumer group) to consume messages from a topic. Consumers divide the topic's partitions among themselves to consume messages more efficiently.

2. **Partition assignment**: In Kafka, topics are divided into partitions for scalability and parallelism. Each consumer in a group is assigned one or more partitions to read messages from. This split of tasks helps process data in parallel.

3. **Load balancing**: Kafka automatically distributes partitions among consumers. When new consumers join the group or existing consumers leave, Kafka reassigns the partition among the remaining consumers. This ensures even workload distribution and high availability.

4. **Scalability and fault tolerance**: Kafka consumer groups provide scalability by distributing the consumption process across multiple consumers. If a consumer fails, others in the group can take over its partitions, ensuring fault tolerance.

### RisingWave's task parallelism

In RisingWave, each task necessitates parallel processing. The smallest operational units within tasks, called `actors`, are assigned globally unique actor IDs by the meta. This design is pivotal for efficient task execution.

### Design of Kafka sources in RisingWave

For Kafka source, RisingWave operates with the assumption that each actor receives messages exclusively from a designated Kafka partition. This assumption significantly simplifies offset management, aiming to distribute partitions across different actors to maximize throughput. However, if the upstream Kafka topic's partitions are fewer than RisingWave's task parallelism, some actors may be inactive, not producing messages downstream. Each active actor processes at least one partition, passing the consumed data and the latest offset of each partition downstream, which is then recorded in the state table. The state table, within the same epoch, permits only one actor to write for a given partition (the primary key), necessitating a clear mapping between partitions and actors.

### Issues with specifying group IDs

1. **Data loss**: In Kafka's fault tolerance, if a consumer fails, others in the group can take over its partitions. This behavior contradicts RisingWave’s foundational assumption about sources. Specifically, if `actor_1` crashes at time `T0` and the Kafka broker reassigns its partition to `actor_2`, `actor_2` will discard messages not from its assigned partition. When `actor_1` recovers and the broker reassigns the original partition back, messages between `T0` and `T1` are considered consumed and not present, leading to data loss. This scenario violates the "exactly once" semantics requirement and disrupts the state table's records, as broker scheduling in consumer groups is likely misaligned with RisingWave's checkpoints, potentially causing state table write failures.

2. **Disruption of existing RisingWave behavior**: Allowing users to specify group IDs in sources leads to another issue. For instance, if two downstream materialized views depend on the same source (assuming a parallelism degree of 3 and the upstream topic has 3 partitions), the current implementation would involve two sets of source executors, totaling six, all sharing the same group ID. Given that "each consumer in a group is assigned one or more partitions to read messages from," some consumers won't receive data if the number of consumers exceeds the number of partitions. This scenario clearly fails to meet the requirement of both materialized views receiving complete data sets.
