---
id: sql-commit
title: COMMIT
description: Commit the current transaction.
slug: /sql-commit
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-commit/" />
</head>

RisingWave supports read-only transactions. You can use the `COMMIT` command to commit the current transaction. For more information about transactions in RisingWave, see [Transactions](/concepts/transactions.md).

You can start a read-only transaction by using the `BEGIN READ ONLY` or `START TRANSACTION READ ONLY` command.

:::note Beta Feature

Read-only transactions are currently in Beta. Please contact us if you encounter any issues or have feedback.

:::

## Syntax

```sql
COMMIT;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('COMMIT'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />

## Example

```sql
COMMIT;
-------RESULT
COMMIT
```

## Related topics

- [Transactions](/concepts/transactions.md)
- [BEGIN](/sql/commands/sql-begin.md)
- [START TRANSACTION](/sql/commands/sql-start-transaction.md)
