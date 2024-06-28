---
id: data-persistence
title: Data persistence
slug: /data-persistence
description: Describes how data is persisted in RisingWave.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-persistence/" />
</head>

RisingWave adopts the [Chandy–Lamport algorithm](https://en.wikipedia.org/wiki/Chandy%E2%80%93Lamport_algorithm) to create checkpoints. A checkpoint is a global snapshot that represents a consistent state of the entire system at a particular point in time.

When a checkpoint is created, the incremental states of streaming operators and output results are persisted in a durable and highly available remote storage. The default checkpoint interval is 1 seconds.

In RisingWave, compute nodes perform write batching by buffering dirty states in memory before creating a checkpoint. Dirty states refer to unsaved states since the last checkpoint.

When the memory buffer exceeds a certain memory threshold (configurable), or when a checkpoint is created, the dirty states will be flushed and persisted in remote storage.

RisingWave does not require all of the data to be kept in-memory in order to function. The data can be persisted to these destinations:

- S3, or S3-compatible object storage
- Google Cloud Storage, or HDFS/WebHDFS (support implemented via [Apache OpenDAL](https://github.com/apache/incubator-opendal))

If you have more memory resources, you can generally achieve better caching and thus better performance, especially for demanding workloads. However, you can also save some costs by allocating limited memory resources to achieve moderate performance for medium or small workloads.
