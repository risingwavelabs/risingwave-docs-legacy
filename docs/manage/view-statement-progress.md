---
id: view-statement-progress
title: View statement progress
description: View the progress of a statement and abort it if it takes too long.
slug: /view-statement-progress
---

This topic talks about how to view the progress of a DDL statement. A DDL (Data Definition Language) statement is a statement used to define a database schema. 

In RisingWave, DDL statements include:

- `CREATE`
- `DROP`
- `ALTER`

To view the progress of a DDL statement, run the following command:

```sql
SELECT * FROM rw_catalog.rw_ddl_progress;

 ddl_id |         ddl_statement         | progress
--------+-------------------------------+----------
   1026 | CREATE INDEX idx ON sbtest1(c) | 69.02%
(1 row)

```

For a streaming statement that already takes too long, you can abort it by pressing `CTRL+C` (or `Control+C`). A streaming statement is a statement that creates or modifies a source, materialized view, index, or sink.

For example:

```sql
CREATE MATERIALIZED VIEW mv2 AS SELECT * FROM mv1;
------------------------
^CCancel request sent
ERROR:  QueryError: Scheduler error: Cancelled: create
```
