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

## 1. Specify compute node role

To decouple streaming and serving, you need at least one compute node with the `streaming` role and one compute node with the `serving` role.

When launching a compute node, its role can be specified via either the `--role` command line argument, or `RW_COMPUTE_NODE_ROLE` environment variable.

You need to restart the node to update the role. A role can be one of:

- `both`: The default role if not specified. Indicates that the compute node is available for both streaming and serving.
- `serving`: Indicates that the compute node is only available for serving.
- `streaming`: Indicates that the compute node is only available for streaming.

## 2. Specify visibility mode

To decouple streaming and serving, the session variable [`visibility_mode`](#about-visibility-mode) must be `checkpoint`, in order to schedule ad-hoc queries to compute nodes with `serving` role. Otherwise, ad-hoc queries are still served by compute nodes with the `streaming` role by default (i.e. `visibility_mode` is `all`):

- Preferably, you can change the default `visibility_mode` to `checkpoint` for all new sessions of a frontend node, via either the `--enable-barrier-read=false` command line argument or the environment variable `RW_ENABLE_BARRIER_READ=false` when launching frontend nodes.
- As a session variable, you can modify it during a session. This can be useful when no compute node with the `serving` role is available. By setting `visibility_mode` to `all` temporarily, ad-hoc queries from this session can be served by compute nodes with the `streaming` role.

### About visibility mode

Data visibility mode determines the data freshness perceived in serving. It can be one of:

- `all`: The default mode. It indicates better data freshness, with the risk of reading data that may not be eventually persisted if a cluster recovery happens later. Under this mode, ad-hoc queries are assigned to compute nodes with either the `both` or the `streaming` role.
- `checkpoint`: It ensures data that you read must be persisted. Under this mode, ad-hoc queries are scheduled to compute nodes with either the `both` or the `serving` role.

