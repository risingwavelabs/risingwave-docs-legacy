---
id: sql-begin
title: BEGIN
description: Start a transaction.
slug: /sql-begin
---

RisingWave supports read-only transactions. You can use the `BEGIN READ ONLY` command to start a read-only transaction. For more information about transactions in RisingWave, see [Transactions](/concepts/tranactions.md).

The `BEGIN` command starts the read-write transaction mode, which is not supported yet in RisingWave. For compatibility reasons, this command will still succeed but no transaction is actually started. That is why you need to specify the `READ ONLY` option to start a transaction in read-only mode.

The `BEGIN` command is the same as the `START TRANSACTION` command.

You can end a transaction by using the `COMMIT` command.

:::caution Experimental feature

Read-only transactions is currently an experimental feature in RisingWave, and its functionality is subject to change. We cannot guarantee its continued support in future releases, and it may be discontinued without notice. You may use this feature at your own risk.

:::

## Syntax

```sql
BEGIN READ ONLY;
-------RESULT
BEGIN
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('BEGIN READ ONLY'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />

## Related topics

- [Transactions](/concepts/transactions.md)
- [START TRANSACTION](/sql/commands/sql-start-transaction.md)
- [COMMIT](/sql/commands/sql-commit.md)
