---
id: view-statement-progress
title: Monitor statement progress
description: View the progress of a statement in RisingWave and abort it if it takes too long.
slug: /view-statement-progress
keywords: [monitor progress, SQL, query progress]
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

Alternatively, you can use the [`SHOW JOBS`](/sql/commands/sql-show-jobs.md) command to get all streaming jobs (that is, the creation of a materialized view) that are in progress. The IDs, specific statements, and their progresses will be returned in the result. You can then cancel specific jobs by their IDs using the [`CANCEL JOBS`](/sql/commands/sql-cancel-jobs.md) command. The `CANCEL JOBS` command will return IDs of the jobs that are canceled successfully.

```sql title="Show all jobs"
SHOW JOBS;
------RESULT
  Id  |                     Statement                     | Progress
------+---------------------------------------------------+----------
 1010 | CREATE MATERIALIZED VIEW mv3 AS SELECT *FROM mv1  | 2.21%
 1012 | CREATE MATERIALIZED VIEW mv2 AS SELECT* FROM mv1  | 0.86%
```

```sql title="Cancel jobs"
CANCEL JOBS 1010, 1012;
------RESULT
Id
------
 1012
 1010
 ```

## Related topics

- [`SHOW JOBS`](/sql/commands/sql-show-jobs.md)
- [`CANCEL JOBS`](/sql/commands/sql-cancel-jobs.md)
