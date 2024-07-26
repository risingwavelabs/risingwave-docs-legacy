---
id: sql-show-cluster
title: SHOW CLUSTER
description: Show the details of your RisingWave cluster.
slug: /sql-show-cluster
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-cluster/" />
</head>

Use the `SHOW CLUSTER` command to display various details of your cluster, such as the cluster's address, type, state, and starting time. It will also indicate the number of parallel units the cluster is utilizing and whether it is currently streaming data, serving data, or unschedulable.

## Syntax

```sql
SHOW CLUSTER;
```

## Examples

```sql
SHOW CLUSTER;

------RESULT
 Id |      Addr      |           Type           |  State  | Parallel Units | Is Streaming | Is Serving | Is Unschedulable |        Started At
----+----------------+--------------------------+---------+----------------+--------------+------------+------------------+---------------------------
  0 | 127.0.0.1:5690 | WORKER_TYPE_META         | RUNNING |                |              |            |                  | 2024-05-07 07:57:18+00:00
  1 | 127.0.0.1:5688 | WORKER_TYPE_COMPUTE_NODE | RUNNING | 0, 1, 2, 3     | t            | t          | f                | 2024-05-07 07:57:21+00:00
  2 | 127.0.0.1:4566 | WORKER_TYPE_FRONTEND     | RUNNING |                |              |            |                  | 2024-05-07 07:57:24+00:00
  3 | 127.0.0.1:6660 | WORKER_TYPE_COMPACTOR    | RUNNING |                |              |            |                  | 2024-05-07 07:57:24+00:00
(4 rows)
```
