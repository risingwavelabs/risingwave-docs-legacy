---
id: sql-flush
title: FLUSH
description: Commit pending data changes and persists updated data to storage.
slug: /sql-flush
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-flush/" />
</head>

The `FLUSH` command commits any pending data changes and forces RisingWave to persist updated data to storage, which guarantees subsequent reads can access the latest data.

## Syntax

```sql
FLUSH;
```

## Purpose of `FLUSH`

RisingWave uses a snapshot-based mechanism for data durability. Periodically, a snapshot is triggered which flushes operator state to storage like S3. If a failure occurs, operators recover from the latest snapshot.

However, snapshots are asynchronous. By default, RisingWave does not guarantee read-after-write consistency — a write may not be visible to subsequent reads immediately.

The `FLUSH` command provides a way to synchronously persist pending changes and ensure subsequent reads reflect the latest data. It blocks until the changes are durable.

## When to use `FLUSH`

`FLUSH` should be used after any statements that change data, including:

- DML like `INSERT`, `UPDATE`, or `DELETE`.

- DDL creating objects that query the data.

In the example below, `FLUSH` ensures the pending data changes from the `INSERT` are persisted, and the new materialized view has been populated before querying it:

```sql
CREATE TABLE users (id INT, name VARCHAR(50));

INSERT INTO users VALUES (1, 'Alice');

FLUSH;

CREATE MATERIALIZED VIEW user_count AS 
  SELECT COUNT(*) AS total_users FROM users;

FLUSH;

SELECT * FROM user_count;
```

## Related topics

- 
