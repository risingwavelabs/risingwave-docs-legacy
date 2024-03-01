---
id: dedicated-compute-node
title: Dedicated compute node
description: Set up dedicated compute nodes for streaming and serving.
slug: /dedicated-compute-node
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/dedicated-compute-node/" />
</head>

By default, a compute node can process both streaming jobs and ad-hoc queries (i.e. serving). Alternatively, you can process streaming and serving by different compute nodes respectively, to mitigate resource contention or to isolate streaming or serving failure. This guide introduces how to set up such dedicated compute nodes to decouple streaming and serving.

To decouple streaming and serving, you need at least one compute node with the `streaming` role and one compute node with the `serving` role.

When launching a compute node, its role can be specified via either the `--role` command-line argument, or `RW_COMPUTE_NODE_ROLE` environment variable.

You need to restart the node to update the role. A role can be one of:

- `both`: The default role, if not specified. Indicates that the compute node is available for both streaming and serving.
- `serving`: Indicates that the compute node is read-only and executes batch queries only.
- `streaming`: Indicates that the compute node is only available for streaming.

:::note
In a production environment, it's advisable to use separate nodes for batch and streaming operations. The `both` mode, which allows a node to handle both batch and streaming queries, is more suited for testing scenarios. While it's possible to execute batch and streaming queries concurrently, it's recommended to avoid running resource-intensive batch and streaming queries at the same time.
:::

For specific changes required in the YAML file, see [Separate batch streaming modes](https://github.com/risingwavelabs/risingwave-operator/blob/main/docs/manifests/risingwave/advanced/separate-batch-streaming-modes.yaml).

## Configuring a `serving` compute node for batch queries

You can use a TOML configuration file to configure a `serving` compute node. For detailed instructions, see [Configure node-specific parameters](/manage/configure-node-specific-parameters.md).

Unlike a general-purpose `both` compute node, a `serving` compute node doesn't require memory allocation or reservation for shared buffer and operator caches. Instead, it's more efficient to increase the sizes of the block and meta caches. However, making these caches too large can limit the scope of data that batch queries can execute.

Here's an example configuration for a `serving` compute node with 16GB of memory which you can find in `/risingwave/src/config/serving.toml`:

```toml
[storage]
# Shared buffer is not needed for a serving-only compute node.
shared_buffer_capacity_mb = 1

# Compactor is irrelevant to a serving-only compute node.
compactor_memory_limit_mb = 1

# Allocate 30% of total memory to block cache: 16GB * 0.3 = 4.8GB
block_cache_capacity_mb = 4800

# Allocate 10% of total memory to meta cache: 16GB * 0.1 = 1.6GB
meta_cache_capacity_mb = 1600
```

The remaining memory (16GB - 4.8GB - 1.6GB - reserved memory 16GB * 0.2) is used for executing serving queries. We call it "compute memory". If a batch query is resource-intensive and its runtime memory consumption exceeds the available compute memory, it will terminate itself automatically before triggering an out-of-memory (OOM) error.

While we don't recommend executing OLAP-style batch queries that require a large amount of input data, you can adjust the configuration if such a query is needed and the default configuration leaves too little compute memory. Feel free to allocate less memory for the block cache and meta cache to increase the compute memory.