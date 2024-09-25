---
id: troubleshoot-high-latency
title: High latency
slug: /troubleshoot-high-latency
---

High latency is a prevalent performance problem in streaming systems, and it can have multiple underlying causes. Excessive latency not only affects the freshness of data but also poses a risk to the overall stability of the system, potentially leading to out-of-memory (OOM) errors.

This guide aims to help you identify the root causes of high latency and provide effective solutions to address these issues.

## Symptoms

To identify barrier latency, navigate to the **Grafana dashboard (dev)** and access the **Streaming** section. From there, locate the **Barrier Latency** panel. The figure below is an example of what you will see. The latency curve in it is extremely high, indicating that the barrier is getting stuck.

![An example of extremely high latency](../images/example_bad_barrier_latency.png)

## Diagnosis

Some tools can be helpful in troubleshooting this issue:

- Observe backpressure: Go to **Grafana dashboard (dev)** > **Streaming Actors** > **Actor Output Blocking Time Ratio (Backpressure)** panel, and analyze backpressure between fragments (actors). High backpressure between 2 fragments indicates that the downstream one is unable to process the data promptly, thereby slowing down the entire streaming job.

- Check Await Tree Dump: Check the Await Tree Dump of all compute nodes in **RisingWave Dashboard** hosted on `http://meta-node:5691`. If the barrier is stuck, the Await Tree Dump will reveal the barrier waiting for a specific operation to finish. This fragment is likely to be the bottleneck of the streaming job.

With these tools, you can identify the bottleneck fragments (actors) and the materialized views they belong to. Additionally, refer to the RisingWave Dashboard for the detailed information on materialized views, such as the streaming execution graph or the SQL query.

## Solutions

Once you've pinpointed the bottleneck fragment, consider the following actions to resolve the issue:

- Enhance the streaming query performance by removing or rewriting the bottleneck part of the SQL query.

- Increase the parallelism by adding more nodes into the cluster, or check the SQL query to see if there is any room for optimization.

## Example

High latency can be caused by high join amplification.

### Identify high join amplification

Using low-cardinality columns as equal conditions in joins can result in high join amplification, leading to increased latency.

:::info
The term "Cardinality" describes how many distinct values exist in a column. For example, "nation" often has a lower cardinality, while "user_id" often has a higher cardinality.

When using a low-cardinality column as the equal condition for a join, such as `A join B on A.nation = B.nation`, any operation on a row in A or B will be amplified by the join to potentially thousands or millions of rows, depending on how many rows share that nation. This could lead to extremely high latency.
:::

For example, the following figure shows a materialized view with extremely high latency caused by high join amplification. You can find this panel through **Grafana dashboard (dev)** > **Streaming** > **Join Executor Matched Rows**, which indicates the number of matched rows from the opposite side in the streaming join executors.

![An example of extremely high latency](../images/example_high_join_matched_rows.png)

To solve the issue, consider rewriting the SQL query to reduce join amplification, such as using better equal conditions on the problematic join to reduce the number of matched rows. See [Maintain wide table with table sinks](/transform/multiple-table-sink.md) for details.

At the same time, a log of `high_join_amplification` with the problematic join keys will be printed, such as

```
hash_join_amplification: large rows matched for join key matched_rows_len=200000 update_table_id=31 match_table_id=33 join_key=OwnedRow([Some(Int32(1)), Some(Utf8("abc"))]) actor_id=119 fragment_id=30
```

To address this problem, it is advisable to refactor the SQL query in order to minimize join amplification. This can be achieved by improving the equal conditions used in the problematic join, thereby reducing the number of matched rows.

The downstream processing latency can spike as well, since the number of chunks going downstream will be amplified. This will turn the downstream executors into the main bottleneck. For example, in hash aggregation, a sudden update of numerous group keys takes a long time to process, as aggregation must occur for each key. To mitigate this, you can scale the cluster resource to parallelize the processing.

### Workaround for high join amplification

If scaling up or out the resources doesn't work, the join actor itself might be the bottleneck.

Suppose there are several join keys that can trigger high join amplification. This may lead to congestion in the entire job because a single key with high join amplification produces a large number of results, and they must be processed by a single actor in the join operator.

Therefore, we can split the original MV into multiple MVs by adding filtering conditions. If the data pattern and workload allow such partitioning, this approach distributes data for the same key across multiple actors.

For example, let's consider the original join condition:

```sql
SELECT * FROM orders
INNER JOIN product_description
ON orders.product_id = product_description.product_id
```

Suppose `product_id = 1` is a hot-selling product, an update from stream `product_description` with `product_id=1` can match 100K rows from `t1`.

We can split the MV into multiple MVs:

1. Create one MV with the filtering condition `orders.user_id % 7 = 0` and perform the join.

2. Create a second MV with the filtering condition `orders.user_id % 7 = 1`.

3. Repeat this process until the n'th MV with the filtering condition `orders.user_id % 7 = 6`. In total, we will have 7 MVs.

If `user_id` cannot be directly applied with the modulo operation, it needs to be processed by a hash function first. In cases where the hash function can return a negative value, it's worth noting that in both PostgreSQL and RisingWave, `-1 % 7 = -1` instead of `6`. Therefore, we need to include additional MVs where `hash_function(orders.user_id) % 7 = -1/-2/-3/-4/-5/-6`.

Finally, we can union the results from all 7 MVs. If `user_id` is uniformly distributed given `product_id = 1`, the join amplification in each actor is reduced by a factor of 7.

Please note that it depends on finding a `user_id` column that is highly cardinality and as uniformly distributed as possible.
