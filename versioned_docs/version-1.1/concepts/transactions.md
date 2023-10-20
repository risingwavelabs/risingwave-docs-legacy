---
id: transactions
title: Transactions
slug: /transactions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/transactions/" />
</head>

Transactions in databases refer to logical units of work that consist of one or more database operations. A transaction is a sequence of database operations, such as reads (queries) and writes (updates or inserts), that are treated as a single indivisible and consistent unit. The main purpose of transactions is to ensure data integrity and maintain the ACID (Atomicity, Consistency, Isolation, Durability) properties of the database.

RisingWave supports read-only transactions, where all reads within a transaction are executed against the consistent Hummock snapshot. Hummock is the LSM-Tree-based storage engine in RisingWave that is specifically optimized for streaming workloads.

:::caution Experimental feature

Read-only transactions is currently an experimental feature, and its functionality is subject to change. We cannot guarantee its continued support in future releases, and it may be discontinued without notice. You may use this feature at your own risk.

:::

To initiate a transaction, use either the `START TRANSACTION READ ONLY` or `BEGIN READ ONLY` command. Subsequently, you can execute queries to read data from the consistent snapshot. To finalize the transaction and submit the queries as a single unit, use the `COMMIT` command.

Please note that data modifications are not allowed while a transaction is initiated but not yet committed. The statements listed below are not allowed within a transaction:

- All DDL statements (`CREATE`, `ALTER`, and `DROP`)
- Most of DML statements (`INSERT`, `UPDATE`, and `DELETE`)
- Statements related to `USER`. This category may overlap with DDL statements.
- All privilege-related statements, including `GRANT` and `REVOKE`.
