---
id: configure-node-specific-parameters
title: Configure node-specific parameters
description: Configure node-specific parameters in RisingWave.
slug: /configure-node-specific-parameters
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/configure-node-specific-parameters/" />
</head>

In RisingWave, certain parameters are node-specific and can vary between different nodes. These parameters are typically stored in a TOML configuration file, which is read at system startup.

## Setting up node-specific parameters

Node-specific parameters can be configured in the `risingwave.toml` configuration file. Here's the steps on how to set them up:

1. Create or locate your `risingwave.toml` file.
   
   This file will contain all your node-specific configurations. If it doesn't exist, create a new one.

2. Edit the `risingwave.toml` file.
   
   Open the file in a text editor. Each parameter should be specified in the format `parameter_name = value`. For example:

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
   
   For the changes to take effect, you may need to restart the node.

Any items present in `risingwave.toml` will override the default values in the source code. If no configuration file is specified, the default values in `/risingwave/src/common/src/config.rs` will be used.

## Node-specific parameters

See [Node-specific parameters](/manage/node-specific-parameters.md) for a list of node-specific parameters. 

The parameters can vary between different nodes, depending on the disk configuration of each machine.

Here's an example of these parameters:

```
[storage.data_file_cache]
dir = ""
capacity_mb = 1024
file_capacity_mb = 64
device_align = 4096
device_io_size = 16384
flushers = 4
reclaimers = 4
recover_concurrency = 8
lfu_window_to_cache_size_ratio = 1
lfu_tiny_lru_capacity_ratio = 0.01
insert_rate_limit_mb = 0
catalog_bits = 6
compression = "none"

[storage.meta_file_cache]
dir = ""
capacity_mb = 1024
file_capacity_mb = 64
device_align = 4096
device_io_size = 16384
flushers = 4
reclaimers = 4
recover_concurrency = 8
lfu_window_to_cache_size_ratio = 1
lfu_tiny_lru_capacity_ratio = 0.01
insert_rate_limit_mb = 0
catalog_bits = 6
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