---
id: sql-start-transaction
title: START TRANSACTION
description: Start a read-only transaction.
slug: /sql-start-transaction
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-start-transaction/" />
</head>

RisingWave supports read-only transactions. You can use the `START TRANSACTION READ ONLY` command to start a read-only transaction. For more information about transactions in RisingWave, see [Transactions](/archived/transactions.md).

The `START TRANSACTION` command starts the read-write transaction mode, which is not supported yet in RisingWave. For compatibility reasons, this command will still succeed but no transaction is actually started. That is why you need to specify the `READ ONLY` option to start a transaction in read-only mode.

The `START TRANSACTION` command is the same as the `BEGIN` command.

You can end a transaction by using the `COMMIT` command.


:::info Public Preview
Read-only transactions is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

## Syntax

```sql
START TRANSACTION;
```

## Example

```sql
START TRANSACTION READ ONLY;
-------RESULT
START_TRANSACTION
```

## Related topics

- [Transactions](/archived/transactions.md)
- [BEGIN](/sql/commands/sql-begin.md)
- [COMMIT](/sql/commands/sql-commit.md)
