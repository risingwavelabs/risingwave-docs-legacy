---
id: faq
title: FAQ
slug: /faq
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/faq/" />
</head>

This topic addresses common queries related to resource allocation and adjustment for both streaming and batch queries. This will assist you in fine-tuning performance and maximizing efficiency.

## How to adjust the resources allocated to each streaming query?

There is one session variable called `streaming_parallelism` to adjust the parallelism of a streaming query. It affects all the streaming queries created after the variable is set to a certain number within the same session.

Suppose we have a RisingWave cluster that has 3 compute nodes, each with 8 CPUs. By default, the `streaming_parallelism` is set to 0, allowing a streaming query to access a maximum of 24 CPUs. However, reaching 100% CPU utilization may not occur in reality due to factors such as insufficient data ingestion or lightweight computations. If we change `streaming_parallelism` to 2, the maximum CPU resources streaming queries can use is `3*2=6` CPUs in total.

One may ask what if I have multiple streaming queries and all of them can use 24 CPUs at most? There are two cases:

1. If the real aggregated CPU utilization of all streaming queries does not exceed 24 CPUs, then there are more than enough CPU resources. Every query is happy.

2. If it does exceed, we can consider that each streaming query’ share of CPU resources is approximately proportional to the `streaming_parallelism` when the query is created. For example, one query can use at most 15 CPUs and the other query can use at most 24 CPUs. Then the first query gets `24*15/(15+24)~=9` CPUs, while the second query gets the rest 15 CPUs.

Don’t worry about setting a less ideal configuration variable for the streaming queries at the beginning. RisingWave will support runtime adjustment of the parallelism for streaming queries. This means you can tweak the variable constantly as you become more familiar with the resource requirements of your queries.

## How to adjust the resources allocated to each batch query?

There is another session variable called `batch_parallelism`. It works just like `streaming_parallelism` but is applicable to batch queries.

We remark that we don’t encourage users to **frequently** do **ad-hoc** OLAP queries that compute over a huge amount of input data by RisingWave. RisingWave has the ability to do so, but it will never outpace a column-based OLAP system. We suggest sinking output from RisingWave to a dedicated OLAP database to process such queries.

We encourage users to process batch queries that can be accelerated by indexes and/or take a relatively small number of rows as input. These queries typically complete within the range of single-digit milliseconds to single-digit seconds and do not require many CPU resources. We will discuss the good practice of creating indexes in detail later.

In short, it is rarely needed to change `batch_parallelism`.

## When to choose to deploy a dedicated batch-serving cluster?

By default, all the computes will run both streaming queries and batch queries. CPU and memory resources of each compute node are shared among both types of queries, leading to resource competition. Therefore, it is hard to guarantee the performance of both types of queries.

As mentioned earlier, batch queries suitable for RisingWave to process are those with sub-second latency. In production, it is intolerable to have huge latency fluctuation due to resource competition. This is when a dedicated batch-serving cluster can help.

Additionally, the failure of compute nodes for stream processing does not affect the availability of processing batch queries. 

## Is there any difference between configuring a CN for stream processing only and configuring a CN for batch serving only?

Yes. The default configuration, i.e., without providing a customized `toml` configuration file (examples can be found [here](https://github.com/risingwavelabs/risingwave/tree/main/src/config)), is mainly optimized for processing streaming queries. In essence, we allocate more memory for streaming queries’ operator cache to reduce fetching data and state from the object store, and less memory for storage’s block cache and meta cache.

When a CN is used for batch serving only, the operator cache is no longer needed. We can increase the memory size of the block cache and meta cache so that more data for batch queries can be cached to reduce the number of remote I/Os to S3. 

We recommend using this [configuration](https://github.com/risingwavelabs/risingwave/blob/main/src/config/serving-only.toml).

For any other questions or tips regarding performance tuning, feel free to join our [Slack Community](https://www.risingwave.com/slack) and become part of our growing network of users. Engage in discussions, seek assistance, and share your experiences with fellow users who can provide valuable insights and solutions.