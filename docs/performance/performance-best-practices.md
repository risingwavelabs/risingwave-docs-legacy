---
id: performance-best-practices
title: Best practices for optimizing performance
slug: /performance-best-practices
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/performance-best-practices/" />
</head>

This topic outlines best practices for optimizing RisingWave performance.

## When to create indexes

Indexes in RisingWave are used to accelerate batch queries. See the basics of indexes in [`CREATE INDEX`](/sql/commands/sql-create-index.md).

We determine how the index should be created by checking:

1. Which columns of the materialized views are used in the `SELECT` statement? These columns should all appear in the `INCLUDE` clause when creating the index.

2. Which columns of the materialized views are included in an optional `WHERE` condition in the batch queries? Suppose the batch query filters a column named timestamp with the condition `timestamp between t1 and t2`, then the column `timestamp` should be included in the `index_column`.  The same principle applies to any other filter conditions such as equality and inequalities.

We remark that the incremental maintenance of indexes in RisingWave is similar to the incremental maintenance of materialized views but with minimal computation. Therefore, it is cost-effective to create indexes in RisingWave. We encourage users to detect the patterns in batch queries and create indexes if the pattern occurs frequently or/and a batch query is slow.

## When to use MVs on MVs

When building a materialized view (MV), it is possible to build more MVs on top of the existing one. This approach is similar to creating complex functionalities by composing simple functions in a codebase. The benefits of building MVs on MVs include:

- Simplifying complex queries, reducing redundancy, and thus lowering the amount of resources needed. A typical use case arises when aggregating certain metrics along different time dimensions. For example, tracking the number of orders per minute, hour, and day. We can build an MV that aggregates by minute, build another MV on top of it that aggregates by hour, and finally, add yet another MV on top of the hourly one that aggregates by day.
- Providing a consistent interface for users to access frequently used data, while also shielding them from the underlying complexity of the schema changes of the source data in third-party systems.

Users may have concerns if decomposing a complex pipeline into multiple MVs introduces additional performance overhead. We remark that more decomposition does not lead to more computation overhead but only more storage space. Since RisingWave is typically deployed with cheap object store on the public cloud to store large amounts of data, we generally consider it a less crucial factor in most cases. We are planning to introduce a new feature that allows users to remove an intermediate MV if it's considered unnecessary and poses a significant storage space concern.

### Optimize backfilling of MV on MV

During the backfilling process of the MV on MV, the data from the upstream MV may not have good locality. To optimize this, we recommend modifying the SQL query so that the order key of the upstream table aligns with the group key of the downstream MV. This alignment improves the performance of the backfilling process and ensures better efficiency.

Suppose we create a table `t` using `create table t(v1 int, v2 varchar, v3 timestamp);`. This table contains a large amount of historical data. When creating a new MV on top of this table, it requires backfilling all the historical data, which can be a time-consuming process. Then we create an MV called `m` using `create materialized view m as select v1, sum(v2) from t group by v1;`. The challenge during backfilling is that when reading data from table `t` to build the MV `m`, the order of the `v1` values may be random. This randomness can lead to poor cache locality and trigger remote I/O, ultimately decreasing performance.

However, if we use `create table t(v1 int primary key, v2 varchar);` instead to create a table, or define an intermediate mv like `create materialized view tmp as select * from t order by v1;`. The storage of RisingWave will order rows by `v1`, which means that rows with same `v1` will be read consecutively. This adjustment enhances cache locality and thereby improves performance.

## When to scale up or scale out computation and compaction resources?

The discussion is limited to compute nodes and compactor nodes as other components are not involved in processing in most cases.

RisingWave was built as a scalable distributed processing system from day one. However, just like any other distributed system, being a distributed system introduces extra overhead as there is more network communication among different machines. Moreover, resource fragmentation is more likely to appear with more machines splitting the same total amount of resources. We remark that this is the intrinsic nature of a distributed system but not a special limitation of RisingWave itself.

Therefore, we generally prefer scaling up over scaling out for compute nodes. If the streaming queries are mostly stateless (i.e., those without aggregation, join, or over window functions) and do not involve data shuffling, then scaling up and scaling out is the same.

In terms of compactor nodes, we favor scaling up when the resources of the compactor node are less than 4 CPU and 8 GB memory. This is because some compaction tasks can occasionally be quite resource-intensive and use up to 4 CPU and 8 GB memory. However, once the resource of the compactor node exceeds this threshold, both scaling up and scaling out are equally fine.

## When to create a source or declare `append only` on a table?

In RisingWave, we can declare a source, a table, and an append-only table when connecting to an external upstream system.

The difference between the source and the two types of tables is that a source does not persist the ingested data within RisingWave while the tables do. When the data is stored within RisingWave, it gives users the ability to insert, delete, and update data to a table and only insert data to an append-only table. Therefore, users make a tradeoff between taking up more storage space and giving up the ability to modify source data within RisingWave. See details in [`CREATE SOURCE`](/sql/commands/sql-create-source.md).

Another difference is the performance implication. Unlike the table, the source and the append-only table will never process any updates or deletes. This gives us opportunities for optimization.

Suppose we have a materialized view that tracks the maximal account balance among all the clients at a retail bank, e.g., `CREATE MATERIALIZED VIEW max_account_balance AS SELECT max(balance) FROM account_table`. Since the account balance of each client is frequently changing, we cannot declare it as a source or an append-only table. Then RisingWave has to persist the balances from all the accounts to maintain the result, such as finding how much the second largest balance is when the first largest balance decreases.

Suppose we have another materialized view that tracks the time of the latest transaction among all the transactions, e.g., `CREATE MATERIALIZED VIEW time_latest_transaction AS SELECT max(timestamp) FROM transactions`. Since the transaction is irreversible (even if one transaction is a mistake, we correct it with a new transaction), it is perfect for us to declare transactions as a source or an append-only table. Then RisingWave only needs to keep a single data point, i.e., the timestamp of the latest transaction, and simply compare it with the timestamp of a new transaction to update the result.

This append-only versus non-append-only difference can make an impact in a few use cases:

1. Over-window functions with an `ORDER BY` clause and are only interested in the top N rows.

2. Deduplication.

3. Join.

This is an advanced feature that is still in the experimental stage, which may or may not exist in the future version of RisingWave. Feel free to raise the question in RisingWave’s Slack channel before making a decision.

For any other questions or tips regarding performance tuning, feel free to join our [Slack community](https://www.risingwave.com/slack) and become part of our growing network of users. Engage in discussions, seek assistance, and share your experiences with fellow users and our engineers who are eager to provide insights and solutions.
