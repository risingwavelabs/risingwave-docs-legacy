---
id: node-specific-configurations
title: Node-specific configurations
description: Node-specific configuration file and items in RisingWave.
slug: /node-specific-configurations
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/node-specific-configurations/" />
</head>

In RisingWave, certain configurations are node-specific and can vary between different nodes. These configurations are stored in a [TOML file](https://github.com/risingwavelabs/risingwave/tree/0be5d74f26526bcaa0b6d18a0cedd627d23cedf7/src/config), which is read at system startup.

## Setting up node-specific configurations

Node-specific configurations can be set in the `risingwave.toml` configuration file. Here's the steps on how to set them up:

1. Create or locate your `risingwave.toml` file.

   This file will contain all your node-specific configurations. If it doesn't exist, create a new one.

2. Edit the `risingwave.toml` file.

   Open the file in a text editor. Each configuration item should be specified in the format `config_name = value`. For example:

   ```toml
   [storage.data_file_cache]
   dir = "/risingwave/foyer/meta"
   capacity_mb = 20480
   ```

3. Save your changes.

   After editing, save the `risingwave.toml` file.

4. Provide the configuration file to the node.

   You can do this via the `--config-path` command-line argument when starting the node. For example:

   ```shell
   risingwave --config-path=/path/to/risingwave.toml
   ```

   Alternatively, you can set the `RW_CONFIG_PATH` environment variable to the path of your `risingwave.toml` file.

   For example, in a Kubernetes environment, you can copy the configuration file into the Docker container, or mount a path containing the configuration file into the pod. Then, specify the path to the configuration file using the `RW_CONFIG_PATH` environment variable or the `--config-path` command-line argument.

5. Restart the node.

   For the changes to take effect, you must restart the node.

Any items present in `risingwave.toml` will override the default values in the source code. If no configuration file is specified, the default values in `/risingwave/src/common/src/config.rs` will be used.

To know more details about the parameters in the configuration file, you can visit the [RisingWave configuration files directory](https://github.com/risingwavelabs/risingwave/tree/0be5d74f26526bcaa0b6d18a0cedd627d23cedf7/src/config). You will find various information there, like the [definitions and default values of these parameters](https://github.com/risingwavelabs/risingwave/blob/0be5d74f26526bcaa0b6d18a0cedd627d23cedf7/src/config/docs.md).

## Node-specific configurations

Configurations for different components lie under different TOML sections. Here's an example:

```toml
[system]
barrier_interval_ms = 1000
checkpoint_frequency = 1
state_store = "hummock+minio://hummockadmin:hummockadmin@127.0.0.1:9301/hummock001"
data_directory = "hummock_001"
backup_storage_url = "minio://hummockadmin:hummockadmin@127.0.0.1:9301/hummock001"
backup_storage_directory = "hummock_001/backup"

[storage.cache_refill]
data_refill_levels = []
timeout_ms = 6000
concurrency = 10
unit = 64
threshold = 0.5
recent_filter_layers = 6
recent_filter_rotate_interval_ms = 10000
```

When setting up configurations, please be extra careful with those items prefixed by `unsafe_`. Typically these configurations can cause system or data damage if wrongly configured. You may want to contact our technical support before changing the `unsafe_` prefixed configurations.

### System configurations

System configurations are used to **initialize** the [system parameters](./view-configure-system-parameters.md) at the first startup. Once the system has started, the system parameters are managed by Meta service and can be altered using the `ALTER SYSTEM SET` command.

Example for the system configuration section:

```toml
[system]
barrier_interval_ms = 1000
checkpoint_frequency = 1
state_store = "hummock+minio://hummockadmin:hummockadmin@127.0.0.1:9301/hummock001"
data_directory = "hummock_001"
backup_storage_url = "minio://hummockadmin:hummockadmin@127.0.0.1:9301/hummock001"
backup_storage_directory = "hummock_001/backup"
```

For more information on system parameters, please refer to [View and configure system parameters](./view-configure-system-parameters.md).

### Streaming configurations

Streaming configurations can be set in `[streaming]` section in the configuration file. For example:

```toml
[streaming]
unsafe_enable_strict_consistency = true
```

RisingWave now supports the following configurations:

| Configuration | Default | Description |
| --- | --- | --- |
| `unsafe_enable_strict_consistency` | `true` | Control the strictness of stream consistency. When set to `false`, data inconsistency like double-insertion or double-deletion with the same primary keys will be tolerated. |

### Storage configurations

Storage configurations can be set in `[storage]` and `[storage.xxx]` sections.

#### File cache and block cache

In RisingWave, several node-specific configurations are provided to control the refilling process of file cache and block cache.

For now, the file cache and cache refilling features are still in technical preview. The configuration items might change in future versions.

<details>
  <summary>What is the file cache and block cache refilling?</summary>
  <div>
  <p>
  The file cache serves as an extension of the memory block cache for the LSM-tree, which is used to speed up storage IO-intensive workloads.
  </p>
  <p>
  The file cache uses the disk to cache LSM-tree blocks. It offers a larger and more cost-effective storage capacity compared to memory, as well as lower latency and greater stability than S3. Besides, the disk provides more durability than memory. Therefore, implementing the file cache system can enhance RisingWave's storage system performance and mitigate the cold start problem between reboots.
  </p>
  <p>
  The compaction operation of the LSM-tree may influence the effectiveness of the file cache. Therefore, block cache refilling should always be used to improve the effectiveness of the file cache. With block cache refilling, RisingWave will prefetch the latest version of recently-used blocks before metadata updates are applied after compaction, and then fill the file cache.
  </p>
  </div>
</details>

<details>
  <summary>When to use the file cache and the block cache refilling?</summary>
  <div>
  <p>
  While the file cache can boost storage system performance, it's worth noting that it adds overhead, especially when enabling block cache refilling. Please refer to the following checklist to assess the suitability of the file cache for your workload and configuration:
  </p>
  <ul>
    <li>If the miss ratio and the miss rate of in-memory block cache or meta cache are high.</li>
    <li>If both of the CPU usage and the network bandwidth are not fully utilized.</li>
    <li>If there is spare disk space.</li>
  </ul>
  <p>
  If all of the above conditions are met, the file cache and block cache refilling can be a good choice to improve performance.
  </p>
  </div>
</details>

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
| `indexer_shards` | `64` | The shard number of the indexer. |
| `compression` | `"none"` | Compression algorithm for cached data. Supports `none`, `lz4`, and `zstd`. |

The cache refill configuration is responsible for managing the behavior of LSM-tree data block cache refilling after compaction. The data blocks are refilling at the unit level, where a unit refers to a range of continuous data blocks that are batched and refilled together in one request.

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

#### Other storage configurations

Except for the above, RisingWave also provides some other storage configurations to help control the overall buffer and cache limits. Please see [Dedicated compute node](./dedicated-compute-node.md) for more.
