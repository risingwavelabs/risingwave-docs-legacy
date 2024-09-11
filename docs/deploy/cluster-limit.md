---
id: cluster-limit
title: Cluster limit
description: Cluster limit on MVs, tables, and sinks.
slug: /cluster-limit
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/cluster-limit/" />
</head>

We add the cluster limit feature to enhance user experience when cluster resources are limited. This feature adds a limit on the number of actors per parallelism (i.e. CPU core). If you exceed this limit when using `CREATE MATERIALIZED VIEW`, `CREATE TABLE`, or `CREATE SINK` statements, you'll receive a warning message.

Both a soft and hard limit are introduced:

- `meta_actor_cnt_per_worker_parallelism_soft_limit` (defaults to 100): if the limit is exceeded,  `CREATE MATERIALIZED VIEW/TABLE/SINK` can still succeed but an SQL notice message will be included when the statement returns. For example:

- `meta_actor_cnt_per_worker_parallelism_hard_limit` (defaults to 400): if the limit is exceeded,  `CREATE MATERIALIZED VIEW/TABLE/SINK` will fail and an error message will be included when the statement returns.

## Notes

- The limit will not affect existing database objects in the cluster. In other words, there will be no disruption on MVs/TABLEs/SINKs that are already created. It will only affect future `CREATE MATERIALIZED VIEW/TABLE/SINK`.

- Scaling the cluster or reducing the streaming job parallelism is the preferred way to resolve the limits.

- The default limits are subject to change in future releases.

- If you believe it is safe for the cluster to run with the limits exceeded, there are two ways to override the behavior:

  - Bypass the check via session variable: `SET bypass_cluster_limits TO true`.

  - Increase the limit via meta developer config:

  ```toml
  [meta.developer]
  meta_actor_cnt_per_worker_parallelism_soft_limit = 100
  meta_actor_cnt_per_worker_parallelism_hard_limit = 400
  ```

  However, please keep in mind, if you bypass the check or increase the limits, the cluster could become overloaded, leading to problems with stability, availability, or performance. Please be careful and proceed at your own risk.

## Examples

```sql title="Create a materialized view exceeding the soft limit"
CREATE MATERIALIZED VIEW test_cluster_limit_exceed_soft AS SELECT * FROM test;

----RESULT
NOTICE:  
- Actor count per parallelism exceeds the recommended limit.
- Depending on your workload, this may overload the cluster and cause performance/stability issues. Scaling the cluster is recommended.
- Contact us via Slack or https://risingwave.com/contact-us/ for further enquiry.
- You can bypass this check via SQL `SET bypass_cluster_limits TO true`.
- You can check actor count distribution via SQL `SELECT * FROM rw_worker_actor_count`.
ActorCountPerParallelism { critical limit: 8, recommended limit: 7. worker_id_to_actor_count: ["1 -> WorkerActorCount { actor_count: 32, parallelism: 4 }"] }
CREATE_MATERIALIZED_VIEW
```


```sql title="Create a materialized view exceeding the hard limit"
CREATE MATERIALIZED VIEW test_cluster_limit_exceed_hard AS SELECT * FROM test;

----RESULT
ERROR:  Failed to run the query

Caused by:
  Protocol error: 
- Actor count per parallelism exceeds the critical limit.
- Depending on your workload, this may overload the cluster and cause performance/stability issues. Please scale the cluster before proceeding!
- Contact us via Slack or https://risingwave.com/contact-us/ for further enquiry.
- You can bypass this check via SQL `SET bypass_cluster_limits TO true`.
- You can check actor count distribution via SQL `SELECT * FROM rw_worker_actor_count`.
ActorCountPerParallelism { critical limit: 7, recommended limit: 6. worker_id_to_actor_count: ["1 -> WorkerActorCount { actor_count: 32, parallelism: 4 }"] }
```