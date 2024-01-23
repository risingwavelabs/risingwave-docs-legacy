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

A Kafka consumer group is a concept in Apache Kafka. It refers to a group of consumers that work together to consume data from one or more topics.

1. **Grouping consumers**: Kafka allows multiple consumers to form a group (called a consumer group) to consume messages from a topic. Consumers divide the topic's partitions among themselves to consume messages more efficiently.

2. **Partition assignment**: In Kafka, topics are divided into partitions for scalability and parallelism. Each consumer in a group is assigned one or more partitions to read messages from. This split of tasks helps process data in parallel.

3. **Load balancing**: Kafka automatically distributes partitions among consumers. When new consumers join the group or existing consumers leave, Kafka reassigns the partition among the remaining consumers. This ensures even workload distribution and high availability.

4. **Scalability and fault tolerance**: Kafka consumer groups provide scalability by distributing the consumption process across multiple consumers. If a consumer fails, others in the group can take over its partitions, ensuring fault tolerance.

### RisingWave's task parallelism

In RisingWave, each task is divided into smaller operational units known as `actors.` These actors are assigned globally unique actor IDs by the meta. This design is crucial for ensuring efficient execution of tasks.

### Design of Kafka sources in RisingWave

For Kafka sources, RisingWave operates under the assumption that each actor exclusively receives messages from a designated Kafka partition. This assumption simplifies offset management and allows for the distribution of partitions across different actors to optimize throughput. However, in scenarios where the number of partitions in the upstream Kafka topic is fewer than RisingWave's task parallelism, some actors may remain inactive and not produce messages downstream. Each active actor processes at least one partition, forwarding the consumed data and the latest offset of each partition downstream. This information is then recorded in the state table. Within the same epoch, the state table only allows one actor to write for a given partition, requiring a clear mapping between partitions and actors.

### Issues with specifying group IDs

1. **Data loss**: In Kafka's fault tolerance mechanism, when a consumer fails, other consumers in the group can take over its partitions. However, this behavior contradicts the foundational assumption of RisingWave regarding sources. Specifically, if `actor_1` crashes at time `T0` and the Kafka broker reassigns its partition to `actor_2`, `actor_2` will discard messages not originating from its assigned partition. When `actor_1` recovers and the broker reassigns the original partition back, messages between `T0` and `T1` are considered consumed and not available, resulting in data loss. This scenario violates the requirement of exactly-once semantics and disrupts the records in the state table. The scheduling of brokers in consumer groups is likely misaligned with RisingWave's checkpoints, potentially causing failures in writing to the state table.

2. **Disruption of existing RisingWave behavior**: The issue arises when users are allowed to specify group IDs in sources. Let's consider a scenario where two downstream materialized views depend on the same source, assuming a parallelism degree of 3 and the upstream topic having 3 partitions. In the current implementation, there would be two sets of source executors, totaling six, all sharing the same group ID.

According to Kafka's behavior, "each consumer in a group is assigned one or more partitions to read messages from." However, if the number of consumers exceeds the number of partitions, some consumers will not receive any data. This situation clearly fails to meet the requirement of both materialized views receiving complete data sets.
