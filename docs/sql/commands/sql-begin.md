---
id: sql-begin
title: BEGIN
description: Start a transaction.
slug: /sql-begin
---

Use the `BEGIN` command to start a transaction. Currently, only read-only transactions are supported. For more information about transactions in RisingWave, see [Transactions](/concepts/tranactions.md).

The `BEGIN` command is the same as the `START TRANSACTION` command.

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
        rr.Terminal('BEGIN'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />

## Related topics

- [Transactions](/concepts/transactions.md)
- [START TRANSACTION](/sql/commands/sql-start-transaction.md)
- [COMMIT](/sql/commands/sql-commit.md)
