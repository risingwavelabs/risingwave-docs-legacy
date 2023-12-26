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

## Configuring node-specific parameters

There are two ways to specify the path to the TOML configuration file:

- Use the `--config-path` command-line argument when starting the compute node.

- Set the `RW_CONFIG_PATH` environment variable.

For example, in a Kubernetes environment, you can copy the configuration file into the Docker container, or mount a path containing the configuration file into the pod. Then, specify the path to the configuration file using the `RW_CONFIG_PATH` environment variable or the `--config-path` command-line argument.

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
reclaim_rate_limit_mb = 0
ring_buffer_capacity_mb = 256
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
reclaim_rate_limit_mb = 0
ring_buffer_capacity_mb = 256
catalog_bits = 6
compression = "none"
```