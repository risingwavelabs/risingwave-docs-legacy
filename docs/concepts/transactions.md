---
id: transactions
title: Transactions
slug: /transactions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/transactions/" />
</head>

Transactions in databases refer to logical units of work that consist of one or more database operations. A transaction is a sequence of database operations, such as reads (queries) and writes (updates or inserts), that are treated as a single indivisible and consistent unit. The main purpose of transactions is to ensure data integrity and maintain the ACID (Atomicity, Consistency, Isolation, Durability) properties of the database.

## Read-only transactions

RisingWave supports read-only transactions, where all reads within a transaction are executed against the consistent Hummock snapshot. Hummock is the LSM-Tree-based storage engine in RisingWave that is specifically optimized for streaming workloads.

To initiate a transaction, use either the `START TRANSACTION READ ONLY` or `BEGIN READ ONLY` command. Subsequently, you can execute queries to read data from the consistent snapshot. To finalize the transaction and submit the queries as a single unit, use the `COMMIT` command.

Please note that data modifications are not allowed while a transaction is initiated but not yet committed. The statements listed below are not allowed within a transaction:

- All DDL statements (`CREATE`, `ALTER`, and `DROP`)
- Most of DML statements (`INSERT`, `UPDATE`, and `DELETE`)
- Statements related to `USER`. This category may overlap with DDL statements.
- All privilege-related statements, including `GRANT` and `REVOKE`.

## Transactions within a CDC table

RisingWave supports transactions within a CDC table as a Beta feature. When you create a table to ingest CDC streams, you can enable this feature by setting `transactional` to `true` in the WITH clause of the `CREATE TABLE` statement. Note that this feature is only available if you are using the native [MySQL CDC](/guides/ingest-from-mysql-cdc.md), [PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md), or [Citus CDC](/guides/ingest-from-citus-cdc.md) connectors.

For performance considerations, transactions involving changes to more than 4096 rows cannot be guaranteed.
