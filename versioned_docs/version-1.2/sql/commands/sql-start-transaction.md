---
id: sql-start-transaction
title: START TRANSACTION
description: Start a transaction.
slug: /sql-start-transaction
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-start-transaction/" />
</head>

RisingWave supports read-only transactions. You can use the `START TRANSACTION READ ONLY` command to start a read-only transaction. For more information about transactions in RisingWave, see [Transactions](/concepts/transactions.md).

The `START TRANSACTION` command starts the read-write transaction mode, which is not supported yet in RisingWave. For compatibility reasons, this command will still succeed but no transaction is actually started. That is why you need to specify the `READ ONLY` option to start a transaction in read-only mode.

The `START TRANSACTION` command is the same as the `BEGIN` command.

You can end a transaction by using the `COMMIT` command.

:::note Beta Feature

Read-only transactions are currently in Beta. Please contact us if you encounter any issues or have feedback.

:::

## Syntax

```sql
START TRANSACTION;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('START TRANSACTION READ ONLY'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />

## Example

```sql
START TRANSACTION READ ONLY;
-------RESULT
START_TRANSACTION
```

## Related topics

- [Transactions](/concepts/transactions.md)
- [BEGIN](/sql/commands/sql-begin.md)
- [COMMIT](/sql/commands/sql-commit.md)
