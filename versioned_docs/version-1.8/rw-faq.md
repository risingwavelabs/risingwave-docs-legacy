---
id: rw-faq
title: RisingWave frequently asked questions
description: RisingWave frequently asked questions
slug: /rw-faq
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/rw-faq/" />
</head>

This topic lists two categories of frequently asked questions. The first category is about when to use RisingWave. The second category is about how to use RisingWave.

## When to use RisingWave

### Can RisingWave replace Flink SQL?

RisingWave is a superset of Flink SQL in terms of capabilities. Users of Flink SQL can easily migrate to RisingWave. However, RisingWave also offers additional features that are not present in Flink SQL, such as cascading materialized views.

<img
  src={require('./images/RisingWave vs Flink.png').default}
  alt="RisingWave vs Flink"
/>

RisingWave uses PostgreSQL syntax, which lowers the learning curve and makes it more accessible compared to Flink SQL. However, it's important to note that there are still some minor syntax differences between RisingWave and Flink SQL, so users may need to modify certain queries.

### Is RisingWave a unified batch and streaming system?

The term "unified batch and streaming" was originally used to describe computing platforms like Apache Spark and Apache Flink, rather than databases. However, if we apply this concept to databases, stream processing refers to continuous incremental computation on newly inserted data, while batch processing refers to computation on already stored data. RisingWave fully supports both stream processing and batch processing.

It's important to highlight that RisingWave shines in stream processing. Regarding storage format, RisingWave utilizes a row-based storage, which is more suitable for point queries on stored data rather than full table scans. Therefore, if users have a significant need for ad-hoc full-table analytical queries, we recommend leveraging OLAP databases like ClickHouse or Apache Pinot.

### Does RisingWave support transaction processing?

RisingWave does not support read-write transaction processing, but it does provide support for read-only transactions. It is important to note that RisingWave cannot replace PostgreSQL for transaction processing. This design choice is primarily driven by the fact that, in real-world scenarios, dedicated transactional databases are typically required to support online business operations. Combining transaction processing and stream processing within the same database would introduce complexity in workload management and make it challenging to optimize for both aspects.

As a best practice, in production environments, it is recommended to position RisingWave downstream from the transactional database. RisingWave utilizes change data capture (CDC) to read serialized data from the transactional database.

### Why does RisingWave use row-based storage for tables?

RisingWave employs row-based storage for its tables because it utilizes the same storage system for both internal state management and data storage. Row-based storage is well-suited for storing different types of operators in internal state management. Additionally, for data storage, row-based storage is more suitable as users tend to perform ad-hoc point queries. However, it is worth mentioning that in the future, RisingWave may consider periodic transformations of row-based storage into columnar storage to enhance support for ad-hoc analytical queries.

### Can a streaming database be considered as a combination of a stream processing engine and a database?

No, a streaming database is not simply the merging of a stream processing engine (e.g., Apache Flink) and a database (e.g., PostgreSQL). Here are the main reasons:

Design: A streaming database uses a unified storage system for managing internal state, storing results, and executing random queries. In contrast, an independent database is unsuitable for storing internal state due to the high overhead and latency associated with frequent cross-system data access. Earlier attempts to combine distributed stream processing engines like Apache Storm and Apache S4 with independent databases did not succeed.

Functionality: Cascading materialized views are a key feature of streaming databases. To emulate this functionality, additional components like Kafka message queues would be required outside of the stream processing engine and database to facilitate message passing between materialized views.

Implementation: Ensuring consistency across multiple independent systems necessitates establishing a framework that guarantees consistency, even in the event of a system failure. This requires significant engineering effort.

Operations: Managing multiple independent systems incurs higher operational costs compared to a single integrated system.

User Experience: There is a notable difference between using multiple systems and utilizing a single integrated system, impacting the overall user experience.

In summary, a streaming database goes beyond being a combination of a stream processing engine and a database, as it requires a unified storage system, specific functionality, implementation considerations, operational efficiency, and a seamless user experience.

### What are the differences between streaming databases and real-time OLAP databases?

Mainstream streaming databases, such as RisingWave and KsqlDB, are commonly used for monitoring, alerting, real-time dashboards, and similar business purposes. On the other hand, mainstream real-time OLAP databases, like ClickHouse and Apache Pinot, are primarily used for interactive reporting and similar business purposes. Streaming databases are also utilized for streaming ETL operations.

In terms of functionality, both streaming databases and OLAP databases support predefined queries through materialized views and can handle ad-hoc queries. However, streaming databases excel in supporting predefined queries, while OLAP databases excel in handling ad-hoc queries.

When it comes to design, streaming databases and OLAP databases optimize for different aspects. In the [Napa paper](http://www.vldb.org/pvldb/vol14/p2986-sankaranarayanan.pdf) by Google engineers, they proposed the system's trade-off triangle. According to this triangle, any system can only optimize two out of the three aspects: freshness of results, performance of ad-hoc queries, and resource costs. It is not possible to optimize all aspects simultaneously.

Assuming fixed resource costs, streaming databases inherently optimize for result freshness, while OLAP databases optimize for the performance of ad-hoc queries. The diagram below illustrates the design trade-offs between streaming databases, OLAP databases, and data warehouses.

<img
  src={require('./images/tradeoff_triangle.png').default}
  alt="Tradeoff Triangle"
/>

### How do materialized views in streaming databases differ from those in OLAP databases?

Materialized views in streaming databases, such as RisingWave, differ significantly from those in OLAP databases due to their distinct focuses and requirements.

In streaming databases, materialized views are a core capability and play a crucial role in presenting consistent and up-to-date computation results after stream processing. For example, RisingWave ensures that materialized views are updated synchronously, providing users with the freshest query results. Even for complex queries involving joins and windowing, RisingWave efficiently handles synchronous processing to maintain the freshness of materialized views. Additionally, materialized views in streaming databases implement advanced semantics specific to stream processing.

On the other hand, materialized views in OLAP databases, like ClickHouse, are a supplemental capability. OLAP databases often update materialized views using a "best effort" approach, which may not guarantee immediate consistency or real-time updates. While OLAP databases support materialized views, their primary focus is on interactive reporting and ad-hoc query performance rather than real-time consistency.

In summary, materialized views in streaming databases, such as RisingWave, possess the following important characteristics:

- **Real-time**: RisingWave updates materialized views synchronously, ensuring users always query the freshest results, even for complex queries involving joins and windowing.

- **Consistency**: Materialized views in RisingWave are consistent, providing correct results across multiple materialized views, even when different refresh strategies are employed.

- **High availability**: RisingWave persists materialized views and implements frequent checkpoints for fast failure recovery, recovering from failures within seconds and updating calculation results to the latest state.

- **High concurrency**: RisingWave supports high-concurrency ad-hoc queries by persistently storing data in remote object storage in real-time and dynamically configuring the number of query nodes based on workload.

- **Stream processing semantics**: RisingWave includes various complex stream processing semantics, allowing users to operate on data streams using SQL statements, incorporating features like time windows and watermarks.

- **Resource isolation**: To avoid interference between materialized view computations and other computations, some users transfer materialized view functionality from OLTP or OLAP databases to RisingWave, achieving resource isolation.

In contrast, materialized views in OLAP databases may not prioritize real-time updates, consistency, or advanced stream processing semantics.

## Using RisingWave

### Why the memory usage is so high?

Don't worry, this is by design. RisingWave uses memory for in-memory cache of streaming queries, such as data structures like hash tables, etc., to optimize streaming computation performance. By default, RisingWave will utilize all available memory (unless specifically configured through `RW_TOTAL_MEMORY_BYTES`/`--total-memory-bytes`). This is why setting memory limits is required in Kubernetes/Docker deployments. 

During the instance running, RisingWave will keep memory usage below this limit. If you encounter unexpected issues like OOM (Out-of-memory), please refer to [Troubleshoot out-of-memory](/troubleshoot/troubleshoot-oom.md) for assistance.

<details>
<summary>I'd like to explore more questions.</summary>

If you can't find the questions you're looking for on this FAQ page, we recommend visiting [the community-version of FAQ](https://risingwave-community.snowshoe.dev/). It collects questions posed by users and answers provided by our developers in our [Slack channel](https://www.risingwave.com/slack). Please note that the community version is organized by AI and the answers are not manually reviewed. We will regularly select the most frequently asked questions there and add them to this FAQ page, ensuring that valuable information becomes readily available to all users. We appreciate your understanding as we work on improving the community to provide the best user experience possible.

</details>
