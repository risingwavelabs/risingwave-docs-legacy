---
id: sql-show-cluster
title: SHOW CLUSTER
description: Show the details of your RisingWave cluster.
slug: /sql-show-cluster
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-cluster/" />
</head>

Use the `SHOW CLUSTER` command to show the details of your RisingWave cluster, including the address of the cluster, its state, the parallel units it is using, and whether it's streaming data, serving data or unschedulable.

## Syntax

```sql
SHOW CLUSTER;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW CLUSTER'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />

## Example

```sql
SHOW CLUSTER;
------RESULT
Addr            |  State  |     Parallel Units     | Is Streaming | Is Serving | Is Unschedulable
----------------+---------+------------------------+--------------+------------+------------------
 127.0.0.1:5688 | RUNNING | 3000, 3001, 3002, 3003 | true         | true       | false
(1 row)
```
