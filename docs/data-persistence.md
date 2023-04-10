---
id: data-persistence
title: Data persistence
slug: /data-persistence
---
When a checkpoint is created, the incremental states of streaming operators and output results are persisted in a durable and highly available remote storage. The default checkpoint interval is 10 seconds.

In RisingWave, compute nodes perform write batching by buffering dirty states in memory before creating a checkpoint. Dirty states refer to unsaved states since the last checkpoint.

When the memory buffer exceeds a certain memory threshold (configurable), or when a checkpoint is created, the dirty states will be flushed and persisted in remote storage.

RisingWave does not require all of the data to be kept in-memory in order to function. The data can be persisted to these destinations:

- Local drives
- S3, or S3-compatible object storage
- Google Cloud Storage, or HDFS/WebHDFS (support implemented via [Apache OpenDAL](https://github.com/apache/incubator-opendal))

If you have more memory resources, you can generally achieve better caching and thus better performance, especially for demanding workloads. However, you can also save some costs by allocating limited memory resources to achieve moderate performance for medium or small workloads.
