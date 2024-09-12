---
id: cluster-limit
title: Cluster limit
description: Cluster limit on MVs, tables, and sinks.
slug: /cluster-limit
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/cluster-limit/" />
</head>

This guide introduces the cluster limit designed to enhance user experience when cluster resources are limited. It sets a limit on the number of actors per parallelism (i.e., CPU core). Exceeding this limit when you create materialized view, table, or sink will trigger a warning message.

## Limit types

- **Soft limit**: `meta_actor_cnt_per_worker_parallelism_soft_limit`, defaults to 100.
  
  If exceeding this limit, creating materialized view, table, or sink can still succeed but will generate a SQL notice message when the statement returns.

- **Hard limit**: `meta_actor_cnt_per_worker_parallelism_hard_limit`, defaults to 400.

  If exceeding this limit, creating materialized view, table, or sink will fail and generate an error message when the statement returns.

## Notes

- The limit applies only when you create new materialized view, table, or sink. Existing database objects are unaffected.

- To resolve issues related to these limits, consider scaling the cluster or reducing the streaming job parallelism.

- Default limits may be adjusted in future releases.

## Override cluster limits

If it's safe for the cluster to operate with limits exceeded, you can override the default behavior using one of the following methods:

1. Bypass the limit check via session variable: `SET bypass_cluster_limits TO true`.

2. Increase the limit via meta developer config:

  ```toml
  [meta.developer]
  meta_actor_cnt_per_worker_parallelism_soft_limit = 100
  meta_actor_cnt_per_worker_parallelism_hard_limit = 400
  ```

:::caution
Please be aware that once you bypass the check or increase the limits, the cluster could become overloaded, leading to issues with stability, availability, or performance.
:::

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