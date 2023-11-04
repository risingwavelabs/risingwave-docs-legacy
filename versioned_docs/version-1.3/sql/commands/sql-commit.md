---
id: sql-commit
title: COMMIT
description: Commit the current transaction.
slug: /sql-commit
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-commit/" />
</head>

RisingWave supports read-only transactions. You can use the `COMMIT` command to commit the current transaction. For more information about transactions in RisingWave, see [Transactions](/concepts/tranactions.md).

You can start a read-only transaction by using the `BEGIN READ ONLY` or `START TRANSACTION READ ONLY` command.

:::caution Experimental feature

Read-only transactions is currently an experimental feature in RisingWave, and its functionality is subject to change. We cannot guarantee its continued support in future releases, and it may be discontinued without notice. You may use this feature at your own risk.

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
