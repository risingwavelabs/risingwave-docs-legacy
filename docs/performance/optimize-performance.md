---
id: optimize-performance
title: Optimize performance
slug: /optimize-performance
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/optimize-performance/" />
</head>

This topic delves into crucial aspects of RisingWave's performance tuning, offering guidance on refining performance and optimizing efficiency. It guides you through addressing common queries, deciphering important metrics, and adopting best practices for optimal system performance. Armed with this knowledge, you'll be well-prepared to elevate your RisingWave deployment to its peak potential.


## FAQ

This section addresses common queries related to resource allocation and adjustment for both streaming and batch queries.

**How can I adjust the resources allocated to each streaming query?**

There is one session variable called `streaming_parallelism` to adjust the parallelism of a streaming query. It affects all the streaming queries created after the variable is set to a certain number within the same session.

Suppose we have a RisingWave cluster that has 3 compute nodes, each with 8 CPUs. By default, the `streaming_parallelism` is set to 0, allowing a streaming query to access a maximum of 24 CPUs. However, reaching 100% CPU utilization may not occur in reality due to factors such as insufficient data ingestion or lightweight computations.

If we change `streaming_parallelism` to 2, the maximum CPU resources streaming queries can use is 3*2 = 6 CPUs in total.

One may ask what if I have multiple streaming queries and all of them can use 24 CPUs at most? There are two cases:

1. If the real aggregated CPU utilization of all streaming queries does not exceed 24 CPUs, then there are more than enough CPU resources. Every query is happy.
2. If it does exceed, we can consider that each streaming query’ share of CPU resources is approximately proportional to the `streaming_parallelism` when the query is created. For example, one query can use at most 15 CPUs and the other query can use at most 24 CPUs. Then the first query gets 24*15/(15+24) ~= 9 CPUs, while the second query gets the rest 15 CPUs.

Don’t worry about setting a less ideal configuration variable for the streaming queries at the beginning. RisingWave will support runtime adjustment of the parallelism for streaming queries. This means you can tweak the variable constantly as you become more familiar with the resource requirements of your queries.

**How can I adjust the resources allocated to each batch query?**

There is another session variable called `batch_parallelism`. It works just like `streaming_parallelism` but is applicable to batch queries.

We remark that we don’t encourage users to **frequently** do **ad-hoc** OLAP queries that compute over a huge amount of input data by RisingWave. RisingWave has the ability to do so, but it will never outpace a column-based OLAP system. We suggest sinking output from RisingWave to a dedicated OLAP database to process such queries.

We encourage users to process batch queries that can be accelerated by indexes and/or take a relatively small number of rows as input. These queries typically complete within the range of single-digit milliseconds to single-digit seconds and do not require many CPU resources. We will discuss the good practice of creating indexes in detail later.

In short, it is rarely needed to change `batch_parallelism`.

**When should I choose to deploy a dedicated batch-serving cluster?**

By default, all the computes will run both streaming queries and batch queries. CPU and memory resources of each compute node are shared among both types of queries, leading to resource competition. Therefore, it is hard to guarantee the performance of both types of queries.

As mentioned earlier, batch queries suitable for RisingWave to process are those with sub-second latency. In production, it is intolerable to have huge latency fluctuation due to resource competition. This is when a dedicated batch-serving cluster can help.

Additionally, the failure of compute nodes for stream processing does not affect the availability of processing batch queries. 

**Is there any difference between configuring a CN for stream processing only and configuring a CN for batch serving only?**

Yes. The default configuration, i.e., without providing a customized `toml` configuration file (examples can be found: https://github.com/risingwavelabs/risingwave/tree/main/src/config), is mainly optimized for processing streaming queries. In essence, we allocate more memory for streaming queries’ operator cache to reduce fetching data and state from the object store, and less memory for storage’s block cache and meta cache.

When a CN is used for batch serving only, the operator cache is no longer needed. We can increase the memory size of the block cache and meta cache so that more data for batch queries can be cached to reduce the number of remote I/Os to S3. 

We recommend this configuration: https://github.com/risingwavelabs/risingwave/blob/main/src/config/serving-only.toml

## Understanding performance metrics

Here we list some notable metrics shown on the Risingwave’s Grafana dashboard that can help us diagnose potential problems. The details of the dashboard can be found at: https://github.com/risingwavelabs/risingwave/tree/main/grafana. In particular, there are two files:

1. https://github.com/risingwavelabs/risingwave/blob/main/grafana/risingwave-dev-dashboard.dashboard.py implements a dev-facing dashboard. It includes finer-grained metrics. Many of them may only make sense to the developers of a specific component.
2. https://github.com/risingwavelabs/risingwave/blob/main/grafana/risingwave-user-dashboard.dashboard.py implements a user-facing dashboard. It summarizes some high-level metrics.

### CPU Usage

![SCR-20230818-oak.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0347a23d-b9c4-4a5f-aae3-b6f4d679deb5/SCR-20230818-oak.png)

Among all of the components, we primarily focus on the CPU usage of compute nodes and compactor nodes. In the setting of the figure above, we have allocated 8 CPUs for the compute node and 8 CPUs for the compactor node. 

### Takeaway:

1. When the CPU usage of the compute node is close to the total number of CPUs this compute node has (i.e., 800% in this case), we can likely improve the performance, e.g., throughput, by adding more CPUs to the compute node.
2. We can apply the same reasoning to compactor nodes. We will revisit this when we introduce the metrics “LSM Compact Pending Bytes”, which suggests the ideal number of CPUs to reserve for compaction workload.

### Memory Usage

![SCR-20230821-nt8.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/41b1f31b-c89a-4341-89a9-2865a93b394e/SCR-20230821-nt8.png)

A simplified description of Risingwave’s memory control mechanism:

1. RW calculates and monitors the memory usage of each component.
2. RW reserves 20% of the total memory, i.e., reserved memory, as a buffer. In case of a sudden spike in input data, RW has enough time to adjust its memory usage.
3. RW periodically checks the current memory usage against the rest 80% of the total memory, i.e., usable memory, and decides if it should evict data. If it exceeds 70% of usable memory, it gracefully evicts. The eviction will be further intensified if it exceeds 80% and 90%.

In the figure above, we have allocated 12GB of memory to the CN node. The real memory usage keeps fluctuating around 8.64GB(90% of usable memory). This suggests that the eviction is triggered constantly as RW tries to use more memory.

### Takeaway:

1. If the memory is kept below 6.72G(70% of usable memory), we can be sure that the workload only asks for this amount. In other words, the data/state is completely kept in memory, as the eviction is never triggered. As a result, we can tune down the memory resources to save costs.
2. If the memory is higher than 70% of the usable memory, we consider allocating more memory to speed up if the extra cost is acceptable. Additionally, we recommend taking the cache miss ratio below into consideration when making this decision.

### Cache Miss

Operators such as Join and Aggregation are stateful. They maintain intermediate states in their operator cache to facilitate incremental computation.

For example, the following are the cache miss ratio metrics of the join operator, showing the metrics at the actor level. Each operator is parallelized by multiple actors, whose number is equal to the `streaming_parallelism`. By default, the parallelism is the same as the number of CPUs on CN.

![SCR-20230822-iug.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1773f433-7d4f-4d14-a1c1-38dce767accb/SCR-20230822-iug.png)

The `total lookups` metric denotes how many lookups a join operator performs per second. 

The `cache miss` metric denotes how many times the key does not exist in the memory and RW has to fetch it from the storage engine.

In the case above, the cache miss rate is 707/10.8K ~= 6%, which is quite low. Increasing memory may not do too much good.

Below is the same metric but for the aggregation operator.

![SCR-20230822-pw7.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/27a1856b-a538-4663-8dec-2a1936f8f487/SCR-20230822-pw7.png)

The cache miss rate of actor 25 is 658/2.45K ~= 27%, which is relatively high. It indicates that we are likely to improve the performance if we increase the memory.

Other than the operator cache, the storage engine named Hummock on each Compute Node maintains the block (data) cache and meta cache. 

The data cache stores data. Unlike the operator cache, the block (data) cache stores everything in its binary/serialized format. And all the operators share the same block cache.

The meta cache stores metadata. Hummock requires metadata to locate the data files it needs to read from S3.

We also track the cache miss ratio of these two caches:

![SCR-20230823-hco.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/43d27fac-7352-48a1-8191-cb0acb6e682a/SCR-20230823-hco.png)

We calculate the cache miss rate of the block(data) cache to be 9.52/401 = 2% and the cache miss rate of the meta cache to be 0.203/90.2K ~= 0.0002%.

We notice that the number of total lookups to the meta cache is much higher than the number of total lookups to the data cache. This is because every lookup into the storage requires going through the meta cache, but it does not necessarily access the data cache or remote object storage every time. The meta cache has a bloom filter to check if the data actually exists, reducing the number of remote fetches happening.

It implies that even just a small percentage of cache misses in the meta cache can induce significant performance overhead due to the large total number of misses.

### Takeaway:

1. Monitor the cache miss metrics of the meta cache, the block(data) cache, and all the operator caches (ordered by importance) to estimate the potential room for improvement.
2. The number of cache misses is as important as the cache miss ratio because the latency of remote I/Os to object store such as 3 is incurred on each cache miss.
3. Whether we want to increase memory to improve performance is both user-dependent and workload-dependent:
    1. How much extra cost the user can afford
    2. The number of cache misses may be reduced a little (a lot) if the workload has a weak (strong) data locality.

### LSM Tree Compact Pending Bytes

As described in the CPU usage section, we can estimate the ideal CPU resources allocated for compactors by considering the LSM Tree Compact Pending Bytes.

![SCR-20230823-ju2.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b6a063a2-6840-4ac4-b348-735187fafd59/SCR-20230823-ju2.png)

This metric illustrates the amount of pending workload from the compactor’s perspective. Due to the bursty nature of the compactor’s workload, we recognize the urgency to make a change only if the pending bytes have remained above a certain threshold for more than 10 minutes.

### Takeaway:

1. Since the total pending bytes keep changing, we first calculate its average over a time period of more than 10 minutes. As a general rule of thumb, we then divide the average over 4GB to estimate the ideal number of CPUs.

### Barrier Latency and Barrier Number

![SCR-20230823-ksp.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a4d418a3-f0c6-4f1a-bc1e-753e611c94ab/SCR-20230823-ksp.png)

![SCR-20230823-ksm.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4182557c-a0a6-4c30-acc9-2519c8fcfa30/SCR-20230823-ksm.png)

RisingWave by default generates a barrier every second and ingests it into the source operator (e.g., operators that read data from upstream) among regular input data. The barrier serves multiple purposes when it flows through each operator, e.g. triggering the computation of the delta between the current barrier and the last barrier, flushing new states into the storage engine, determining the completion of a checkpoint etc.

In a perfect world, the barrier latency should stay at 1 second. But in reality, we may observe two phenomena in general:

1. The barrier latency keeps climbing and never enters a stabilized phase. At the same time, the number of barriers also keeps increasing. This implies that the system is in serious congestion, i.e. the current resource falls short of handling the workload. We likely need to increase CPU or memory resources by checking the other metrics mentioned above.
2. The barrier latency and the barrier number fluctuate but still stabilize around a certain level. This is not abnormal. Due to the dynamic nature of streaming data and RW’s dynamic back-pressure mechanism, it is fine to experience such phenomena as RW keeps adjusting at any given second.

### Takeaway:

1. We typically check them out first when we log into Grafana to diagnose any performance issues or even bugs. We further investigate which resources we need to increase once we run into the phenomena (1).

### Source Throughput

![SCR-20230823-mg6.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3d690f56-923d-4ad4-91bc-cca08fc9f093/SCR-20230823-mg6.png)

Particularly among stateless queries (e.g., simple ETL queries that transform data but do not involve stateful computation), we often find that RW can be bottlenecked by the limitation of RW’s upstream system. 

For example, RW may ingest data from an upstream message queue. Either the disk bandwidth of the message queue or the network bandwidth between RW and the message queue is too low, the source throughput may not fully leverage RW’s resources.

### Takeaway:

1. We suggest users also monitor the CPU utilization, disk I/O, and network I/O of RW’s upstream systems, e.g. message queues or databases, to determine the end-to-end bottleneck. 

## Best practices

This section outlines best practices for optimizing RisingWave performance.

### When to create indexes

Indexes in RisingWave are used to accelerate batch queries. The basics of indexes can be found on our documentation page: https://docs.risingwave.com/docs/current/sql-create-index/.

We determine how the index should be created by checking:

1. Which columns of the materialized views are used in the `select` statement. These columns should all appear in the `include` clause when creating the index.
2. Which columns of the materialized views are included in an optional `where` condition in the batch queries. Suppose the batch query filters a column named timestamp with the condition `timestamp between t1 and t2`, then the column `timestamp` should be included in the `index_column`.  The same principle applies to any other filter conditions such as equality and inequalities.

We remark that the incremental maintenance of indexes in RisingWave is similar to the incremental maintenance of materialized views but with minimal computation. Therefore, it is cost-effective to create indexes in RisingWave. We encourage users to detect the patterns in batch queries and create indexes if the pattern occurs frequently or/and a batch query is slow.

### When to use MVs on MVs

When building an MV, it is possible to build more MVs on top of the existing one. This approach is similar to creating complex functionalities by composing simple functions in a codebase. The benefits of building MVs on MVs include:

- Simplifying complex queries, reducing redundancy, and thus lowering the amount of resources needed. A typical use case arises when aggregating certain metrics along different time dimensions. For example, tracking the number of orders per minute, hour, and day. We can build an MV that aggregates by minute, build another MV on top of it that aggregates by hour, and finally, add yet another MV on top of the hourly one that aggregates by day.
- Providing a consistent interface for users to access frequently used data, while also shielding them from the underlying complexity of the schema changes of the source data in third-party systems.

Users may have concerns if decomposing a complex pipeline into multiple MVs introduces additional performance overhead. We remark that more decomposition does not lead to more computation overhead but only more storage space. Since RisingWave is typically deployed with cheap object store on the public cloud to store large amounts of data, we generally consider it a less crucial factor in most cases. We are planning to introduce a new feature that allows users to remove an intermediate MV if it's considered unnecessary and poses a significant storage space concern.

### When to scale up or scale out computation and compaction resources?

The discussion is limited to compute nodes and compactor nodes as other components are not involved in processing in most cases.

RisingWave was built as a scalable distributed processing system from day one. However, just like any other distributed system, being a distributed system introduces extra overhead as there is more network communication among different machines. Moreover, resource fragmentation is more likely to appear with more machines splitting the same total amount of resources. We remark that this is the intrinsic nature of a distributed system but not a special limitation of RisingWave itself.

Therefore, we generally prefer scaling up over scaling out for compute nodes. If the streaming queries are mostly stateless queries (i.e., those without aggregation, join, or over window functions) that do not involve data shuffling, then scaling up and scaling out is the same.

In terms of compactor nodes, we favor scaling up when the resources of the compactor node are less than 4 CPU and 8 GB memory. This is because some compaction tasks can occasionally be quite resource-intensive and use up to 4 CPU and 8 GB memory. However, once the resource of the compactor node exceeds this threshold, both scaling up and scaling out are equally fine.

### When to create a source or declare `append only` on a table?

In RisingWave, we can declare a source, a table, and an append-only table when connecting to an external upstream system.

The difference between the source and the two types of tables is that a source does not persist the ingested data within RisingWave while the tables do. When the data is stored within RisingWave, it gives users the ability to insert, delete, and update data to a table and only insert data to an append-only table. Therefore, users make a tradeoff between taking up more storage space and giving up the ability to modify source data within RisingWave. More details can be found at: https://docs.risingwave.com/docs/dev/sql-create-source/

Another difference is the performance implication. Unlike the table, the source and the append-only table will never process any updates or deletes. This gives us opportunities for optimization.

Suppose we have a materialized view that tracks the maximal account balance among all the clients at a retail bank, e.g., `create materialized view max_account_balance as select max(balance) from account_table`. Since the account balance of each client is frequently changing, we cannot declare it as a source or an append-only table. Then RisingWave has to persist the balances from all the accounts to maintain the result, such as finding how much the second largest balance is when the first largest balance decreases.

Suppose we have another materialized view that tracks the time of the latest transaction among all the transactions, i.e. `create materialized view time_latest_transaction as select max(timestamp) from transactions`. Since the transaction is irreversible (even if one transaction is a mistake, we correct it with a new transaction), it is perfect for us to declare transactions as a source or an append-only table. Then RisingWave only needs to keep a single data point, i.e. the timestamp of the latest transaction, and simply compares it with the timestamp of a new transaction to update the result.

This append-only versus non-append-only difference can make an impact in a few use cases:

1. Over-window functions with an `order by` clause and are only interested in the top N rows.
2. Deduplication. 
3. Join.

This is an advanced feature that is still in the experimental stage, which may or may not exist in the future version of RisingWave. Feel free to raise the question in RW’s Slack channel before making a decision.

To join our Slack Community, simply click the [RisingWave Slack Community invitation link](https://www.risingwave.com/slack) and become part of our growing network of users. Engage in discussions, seek assistance, and share your experiences with fellow users who can provide valuable insights and solutions.
