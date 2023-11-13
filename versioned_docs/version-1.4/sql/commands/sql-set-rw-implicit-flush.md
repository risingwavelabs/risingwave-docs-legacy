---
id: sql-set-rw-implicit-flush
title: SET RW_IMPLICIT_FLUSH
description: Enable or disable implicit flushes after batch operations.
slug: /sql-set-rw-implicit-flush
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-set-background-ddl/" />
</head>

The `RW_IMPLICIT_FLUSH` configuration option controls the behavior of implicit flushes after batch operations.

## Syntax

```sql
SET RW_IMPLICIT_FLUSH = { true | false };
```

## Purpose

The `FLUSH` command commits any pending data changes and forces RisingWave to persist updated data to storage, which guarantees subsequent reads can access the latest data. See details in [`FLUSH`](/sql/commands/sql-flush.md).

However, when the `RW_IMPLICIT_FLUSH` option is enabled, explicit use of the `FLUSH` command is not required in most cases, as data changes are implicitly flushed and made visible after batch operations.

## Behavior

- When `RW_IMPLICIT_FLUSH` is set to `true`, 

  - Data changes through `INSERT`, `UPDATE`, and `DELETE` are implicitly flushed and made visible after batch operations.
  - RisingWave ensures that data consistency and visibility are maintained similar to traditional databases, where read-after-write guarantees are provided.

- When `RW_IMPLICIT_FLUSH` is set to `false` (default behavior),

  - RisingWave does not guarantee read-after-write consistency — a write may not be visible to subsequent reads immediately.
  - You need to call `FLUSH` explicitly after batch operations to immediately persist the changes to storage.

## Example

```sql
-- Enable RW_IMPLICIT_FLUSH
SET RW_IMPLICIT_FLUSH TO true;

-- Perform batch operations
INSERT INTO users (id, name) VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie');
UPDATE users SET name = 'David' WHERE id = 2;
DELETE FROM users WHERE id = 3;

-- Data changes are implicitly flushed and immediately visible
SELECT * FROM users;
```