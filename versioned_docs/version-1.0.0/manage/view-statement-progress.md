---
id: view-statement-progress
title: View statement progress
description: View the progress of a statement in RisingWave and abort it if it takes too long.
slug: /view-statement-progress
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/view-statement-progress/" />
</head>

SQL statements like `CREATE MATERIALIZED VIEW`, `CREATE INDEX`, or `CREATE SINK` might take a while to complete, because they may consume a lot of data. In RisingWave, you can view the progress of such a statement, and abort it if necessary.

To view the progress of a running `CREATE MATERIALIZED VIEW`, `CREATE INDEX`, or `CREATE SINK` statement, run the following command:

```sql
SELECT * FROM rw_catalog.rw_ddl_progress;

 ddl_id |         ddl_statement         | progress
--------+-------------------------------+----------
   1026 | CREATE INDEX idx ON sbtest1(c) | 69.02%
(1 row)

```

To abort a running `CREATE MATERIALIZED VIEW`, `CREATE INDEX`, or `CREATE SINK` statement, press `CTRL+C` (or `Control+C`). 

For example:

```sql
CREATE MATERIALIZED VIEW mv2 AS SELECT * FROM mv1;
------------------------
^CCancel request sent
ERROR:  QueryError: Scheduler error: Cancelled: create
```
