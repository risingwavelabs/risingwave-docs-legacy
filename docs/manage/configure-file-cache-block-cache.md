---
id: configure-file-cache-block-cache
title: Configure file cache and block cache
description: Configure file cache and block cache in RisingWave.
slug: /configure-file-cache-block-cache
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/configure-file-cache-block-cache/" />
</head>

In RisingWave, we provide node-specific configurations to control the refilling process of file cache and block cache.

For now, the file cache and cache refilling features are still in technical preview. The configuration items might change in future versions.

## What is the file cache and block cache refilling?

The file cache serves as an extension of the memory block cache for the LSM-tree, which is used to speed up storage IO-intensive workloads.

The file cache uses the disk to cache LSM-tree blocks. It offers a larger and more cost-effective storage capacity compared to memory, as well as lower latency and greater stability than S3. Besides, the disk provides more durability than memory. Therefore, implementing the file cache system can enhance RisingWave's storage system performance and mitigate the cold start problem between reboots.

The compaction operation of the LSM-tree may influence the effectiveness of the file cache. Therefore, block cache refilling should always be used to improve the effectiveness of the file cache. With block cache refilling, RisingWave will prefetch the latest version of recently-used blocks before metadata updates are applied after compaction, and then fill the file cache.

## When to use the file cache and the block cache refilling?

While the file cache can boost storage system performance, it's worth noting that it adds overhead, especially when enabling block cache refilling. Please refer to the following checklist to assess the suitability of the file cache for your workload and configuration:

- If the miss ratio and the miss rate of in-memory block cache or meta cache are high.
- If both of the CPU usage and the network bandwidth are not fully utilized.
- If there is spare disk space.

If all of the above conditions are met, the file cache and block cache refilling can be a good choice to improve performance.

## How to use the file cache and the block cache refilling?

The configuration of the file cache and the block cache refilling is separated into 3 parts:

1. Data file cache config: `[storage.data_file_cache]`

2. Meta file cache config: `[storage.meta_file_cache]`

3. Cache refill config: `[storage.cache_refill]`

Below is an example of the data file cache configuration for your reference. Please be aware that the data file cache configuration and the meta file cache configuration share the same options.

| Configuration | Default | Description |
| --- | --- | --- |
| `dir` | `""` | The directory for the file cache. If left empty, the file cache will be disabled. |
| `capacity_mb` | `1024` | The file cache capacity in MB. |
| `file_capacity_mb` | `64` | The capacity for each cache file in MB. |
| `flushers` | `4` | Worker count for concurrently writing cache files. |
| `reclaimers` | `4` | Worker count for concurrently reclaiming cache files. |
| `recover_concurrency` | `8` | Worker count for restoring cache when opening. |
| `insert_rate_limit_mb` | `0` | File cache insertion rate limit in MB/s. This option is important as disk bandwidth is usually lower than memory. |
| `indexer_shards` | `64` | TODO |
| `compression` | `"none"` | Compression algorithm for cached data. Supports `none`, `lz4`, and `zstd`. |

The cache refill configuration is responsible for managing the behavior of LSM-tree data block cache refilling after compaction. The data blocks are refilling at the unit level, where a unit refers to a range of continuous data blocks that be batched and refilled together in one request.

RisingWave uses a recent filter to decide whether to fill a block or unit. The recent filter is a multi-layer hash set. The first layer records the accessed block IDs within a time window. When each time window passes, the recent filter will add a new layer to record and evict the last layer. Blocks whose IDs appear in the recent filter will be treated as "recently used". When the "recently used" block ratio exceeds a threshold, the unit will be refilled.

Below is an example of the cache refill configuration for your reference.

| Configuration | Default | Description |
| --- | --- | --- |
| `data_refill_levels` | `[]` | Only blocks in the given levels will be refilled. |
| `timeout_ms` | `6000` | The metadata update will be delayed at most `timeout_ms` to wait for refilling. |
| `concurrency` | `10` | Block refilling concurrency (by unit level). |
| `unit` | `64` | The length of continuous data blocks that can be batched and refilled in one request. |
| `threshold` | `0.5` | Only units whose recently used block ratio exceeds the threshold will be refilled. |
| `recent_filter_layers` | `6` | Number of layers in the recent filter. |
| `recent_filter_rotate_interval_ms` | `10000` | Time interval for rotating recent filter layers. |
