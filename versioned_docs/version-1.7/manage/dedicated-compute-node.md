---
id: dedicated-compute-node
title: Dedicated compute node
description: Set up dedicated compute nodes for streaming and serving.
slug: /dedicated-compute-node
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/dedicated-compute-node/" />
</head>

By default, a compute node can process both streaming jobs and ad-hoc queries (i.e. serving). Alternatively, you can process streaming and serving by different compute nodes respectively, in order to mitigate resource contention, or to isolate streaming or serving failure. This guides introduces how to set up such dedicated compute nodes to decouple streaming and serving.

To decouple streaming and serving, you need at least one compute node with the `streaming` role and one compute node with the `serving` role.

When launching a compute node, its role can be specified via either the `--role` command line argument, or `RW_COMPUTE_NODE_ROLE` environment variable.

You need to restart the node to update the role. A role can be one of:

- `both`: The default role if not specified. Indicates that the compute node is available for both streaming and serving.
- `serving`: Indicates that the compute node is only available for serving.
- `streaming`: Indicates that the compute node is only available for streaming.

For specific changes required in the YAML file, see [Separate batch streaming modes](https://github.com/risingwavelabs/risingwave-operator/blob/main/docs/manifests/risingwave/advanced/separate-batch-streaming-modes.yaml).
