By default, a compute node can process both streaming jobs and ad-hoc queries (i.e. serving). Alternatively, you can process streaming and serving by different compute nodes respectively, in order to mitigate resource contention, or to isolate streaming/serving failure. This guides introduces how to setup such dedicated compute nodes to decouple streaming and serving.

## 1. Specify Compute Node Role

To decouple streaming and serving, you need at least 1 compute node with `streaming` role and 1 compute node with `serving` role.

When launching a compute node, its role can be specified via either `--role` command line argument, or `RW_COMPUTE_NODE_ROLE` environment variable. Role is updatable via restarting the node. A role can be one of:
- `both`. It's the default role if not specified. It means the compute node is available for both streaming and serving.
- `serving`. It means the compute node is only available for serving.
- `streaming`. It means the compute node is only available for streaming;

## 2. Specify Visibility Mode

To decouples streaming and serving, session variable [`visibility_mode`](#about-visibility-mode) must be `checkpoint`, in order to schedule ad-hoc queries to compute nodes with `serving` role. Otherwise, ad-hoc queries are still served by compute nodes with `streaming` role by default (i.e. `visibility_mode` is `all`):

- Preferably, you can change the default `visibility_mode` to `checkpoint` for all new sessions of a frontend node, via either `--enable-barrier-read=false` command line argument or environment variable `RW_ENABLE_BARRIER_READ=false` when launching frontend nodes.
- Besides, as a session variable, you can always modify it inside a session. This can be useful when no compute node with `serving` role is available for some reason, by setting `visibility_mode` to `all` temporarily, ad-hoc queries from this session can be served by compute nodes with `streaming` role.

### About Visibility Mode
Data visibility mode determines the data freshness perceived in serving. It can be one of:
- `all`. It's the default mode. It indicates better data freshness, with the risk of reading data that may not be eventually persisted if a cluster recovery happens later. Under this mode, ad-hoc queries are scheduled to compute nodes with either `both` and `streaming` role.
- `checkpoint`. It ensures data that you read must have been persisted. Under this mode, ad-hoc queries are scheduled to compute nodes with either `both` and `serving` role.

