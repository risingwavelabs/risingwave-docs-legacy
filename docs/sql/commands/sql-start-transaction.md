---
id: sql-start-transaction
title: START TRANSACTION
description: Start a transaction.
slug: /sql-start-transaction
---

Use the `START TRANSACTION` command to start a transaction. Currently, only read-only transactions are supported. For more information about transactions in RisingWave, see [Transactions](/concepts/tranactions.md).

The `START TRANSACTION` command is the same as the `BEGIN` command.

You can end a transaction by using the `COMMIT` command.

:::caution Experimental feature

Read-only transactions is currently an experimental feature in RisingWave, and its functionality is subject to change. We cannot guarantee its continued support in future releases, and it may be discontinued without notice. You may use this feature at your own risk.

:::

## Syntax

```sql
BEGIN;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('START TRANSACTION'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />

## Related topics

- [Transactions](/concepts/transactions.md)
- [BEGIN](/sql/commands/sql-begin.md)
- [COMMIT](/sql/commands/sql-commit.md)
