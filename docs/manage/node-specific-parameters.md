---
id: node-specific-parameters
title: Node-specific parameters
description: Node-specific parameters.
slug: /node-specific-parameters
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/node-specific-parameters/" />
</head>

In RisingWave, node-specific parameters can vary different nodes. These parameters are typically stored in a TOML configuration file, which is read at system startup.

The node-specific parameters typically need to be adjusted based on the configuration of each node itself. Currently, the node-specific parameters are mainly used to configure the parameters related to the file cache and block cache refilling.

For now, the file cache and the cache refilling features are still experimental. The configration items might be changed in the future verions.

## The file cache and the block cache refilling

### What is the file cache and the block cache refillling?

The file cache serves as an extension of the memory block cache for the LSM-tree, which is used to speed up storage IO intensive workloads.

The file cache use the disk to cache LSM-tree blocks, which provies larger and cheaper volume than the memory and lower and more stable latency than S3. Besides, the disk provides more durability than the memory. Therefore, the file cache system can be used to improve the performance of the storage system of RisingWave and mitigate the cold start problem between reboots.

The compaction operation of the LSM-tree may influence the effectivity of the file cache. Therefore, the block cache refilling should always be used to improve the effectivity of the file cache. With the block cache refilling, RisingWave will prefetch the latest version of the blocks that are recently used before the metadata updates are applied after the compaction, and fill the file cache.

### When to use the file cache and the block cache refilling?

While the file cache can improve the preformance of the storage system, it also introduces more overhead, especially when enabling the block cache refilling. The use of the file cache should be based on the workload and the system configuration.

The following checklist can be used to decide whether the file cache is appropriate for your workload and configuration:

- The miss ratio and the miss rate of in-memory block cache or meta cache are high.
- Both of the CPU usage and the network bandwidth and the network bandwidth are not fully utilized.
- There is spare disk space.

If all of the above conditions are meet, the file cache and the block cache refiling can be a good choice to improve the performance.

### How to use the file cache and the block cache refilling?

The configuration of the file cache and the block cache refilling are seperated into 3 parts:

1. data file cache config: `[storage.data_file_cache]`
2. meta file cache config: `[storage.meta_file_cache]`
3. cache refill config: `[storage.cache_refill]`

The data file cache config and the meta file cache config share the same options.

TODO: Refine this part!!!


```toml
dir = "" # the directory for the file cach, if left empty, the file cache will be disabled
capacity_mb = 1024 # the file cache capacity in MB
file_capacity_mb = 64 # tie capacity for each cache file in MB
device_align = 4096 # the io alignment of the device, typecially 4KB
device_io_size = 16384 # the optimized io size of the device, typecially 16KB ~ 128KB
flushers = 4 # worker count for concurrently writing cache files
reclaimers = 4 # worker count for concurrently reclaiming cache files
recover_concurrency = 8 # worker count for restoring cache when opening 
lfu_window_to_cache_size_ratio = 1 # lfu window to cache size ratio used by cache file eviction
lfu_tiny_lru_capacity_ratio = 0.01 # lfu tiny queue capacity ratio used by cache file eviction
insert_rate_limit_mb = 0 # file cache insertion rate limit in MB/s, this option is important for the disk bandwidth is always lower than memory
catalog_bits = 6 # catalog sharding bit count, `catelog shard count = 1 << catalog_bits`
compression = "none" # compression algorithm for cached data, support "none", "lz4" and "zstd".
```

The cache refill config is used to control the behavior of LSM-tree data block cache refilling after compaction. The data blocks are refilling in unit level. A unit is a range of continuous data blocks that be batched and refilled together in one request. 

RisingWave uses a recent filter to decide whether to fill a block or unit. The recent filter is a multi-layer hash set. The first layer records the accessed block ids within a time window. When each tim window passes, the recent filter will put a new layer to record and evict the last layer. Blocks whose ids appear in the recent filter will be treat as "recent used". A unit with "recent used" block ratio over a threshold will be refilled.

```toml
data_refill_levels = [] # only block in the given levels will be refilled
timeout_ms = 6000 # the meta data update will be delayed at most `timeout_ms` to wait for refilling
concurrency = 10 # block refilling concurrency (by unit level)
unit = 64 # the length of continuous data blocks that can be batched and refilling in one request
threshold = 0.5 # only units whose recent used block ratio over threshold will be refilled
recent_filter_layers = 6 # recent filter layers
recent_filter_rotate_interval_ms = 10000 # recent filter layers rotate time window
```