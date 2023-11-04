---
id: fault-tolerance
title: Fault tolerance
slug: /fault-tolerance
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/fault-tolerance/" />
</head>

RisingWave is a fault-tolerant distributed stream processing system. This article provides a high-level overview of how RisingWave handles failures by answering the following questions:

- How does RisingWave recover from failures?
- How does RisingWave ensure data correctness and consistency in case of failures?
- How does failure recovery in RisingWave impact computation?

RisingWave adopts the [Chandy–Lamport algorithm](https://en.wikipedia.org/wiki/Chandy%E2%80%93Lamport_algorithm) to create checkpoints. A checkpoint is a global snapshot that represents a consistent state of the entire system at a particular point in time. In RisingWave, checkpoints are persisted to a durable and highly available remote storage.

For read queries, data is always fetched from the last checkpoint. This ensures that the data is correct and consistent.

If a failure occurs, only the states that are not saved to the upcoming checkpoint are lost. All the internal stateful operators in RisingWave will fetch the states from the last checkpoint. This approach avoids a full re-computation and therefore does not cause a long delay. Checkpoint intervals can be configured and the default is 10 seconds. It means that the delay caused by a failure should not exceed 10 seconds.

For instance, suppose you have a RisingWave cluster that has been ingesting Kafka data for 24 hours, and a failure occurs at 1:00:25 while the last checkpoint was at 1:00:20. In this case, RisingWave will not re-compute the data from one day earlier, but instead will re-compute from the checkpoint at 1:00:20.

To minimize the impact on computation and improve efficiency, checkpoints are created incrementally. States generated since the last checkpoint are persisted incrementally to remote storage. Behind the scenes, RisingWave runs remote compaction tasks to compact the states in a checkpoint. This reclaims space and improves read performance.
