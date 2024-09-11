---
id: sql-begin
title: BEGIN
description: Start a transaction.
slug: /sql-begin
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-begin/" />
</head>

RisingWave supports read-only transactions. You can use the `BEGIN READ ONLY` command to start a read-only transaction. For more information about transactions in RisingWave, see [Transactions](/archived/transactions.md).

The `BEGIN` command starts the read-write transaction mode, which is not supported yet in RisingWave. For compatibility reasons, this command will still succeed but no transaction is actually started. That is why you need to specify the `READ ONLY` option to start a transaction in read-only mode.

The `BEGIN` command is the same as the `START TRANSACTION` command.

You can end a transaction by using the `COMMIT` command.

## Syntax

```sql
BEGIN READ ONLY;
-------RESULT
BEGIN
```

## Related topics

- [Transactions](/archived/transactions.md)
- [START TRANSACTION](/sql/commands/sql-start-transaction.md)
- [COMMIT](/sql/commands/sql-commit.md)
