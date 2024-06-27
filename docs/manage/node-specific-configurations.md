---
id: node-specific-configurations
title: Node-specific configurations
description: Node-specific configuration file and items in RisingWave.
slug: /node-specific-configurations
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/node-specific-configurations/" />
</head>

In RisingWave, certain configurations are node-specific and can vary between different nodes. These configurations are stored in a TOML file, which is read at system startup.

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

## Node-specific configurations

Configurations for different components lies under different TOML section. Here's an example:

```toml
[storage.data_file_cache]
dir = ""
capacity_mb = 1024
file_capacity_mb = 64
flushers = 4
reclaimers = 4
recover_concurrency = 8
insert_rate_limit_mb = 0
indexer_shards = 64
compression = "none"

[storage.meta_file_cache]
dir = ""
capacity_mb = 1024
file_capacity_mb = 64
flushers = 4
reclaimers = 4
recover_concurrency = 8
insert_rate_limit_mb = 0
indexer_shards = 64
compression = "none"

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

### Streaming configurations

Streaming configurations can be set in `[streaming]` section in the configuration file. For example:

```toml
[streaming]
unsafe_enable_strict_consistency = true
```

We now support the following configurations:

| Configuration | Default | Description |
| --- | --- | --- |
| `unsafe_enable_strict_consistency` | `true` | Control the strictness of stream consistency. When set to `false`, data inconsistency like double-insertion or double-deletion with the same primary keys will be tolerated. |

### Storage configurations

Storage configurations can be set in `[storage]` and `[storage.xxx]` sections. Currently we support configuring the file and block cache refilling, and memory usage limitation for different components. Please see [Configure file cache and block cache](./configure-file-cache-block-cache.md) and [Dedicated compute node](./dedicated-compute-node.md) for more.
