---
id: sql-cancel-jobs
title: CANCEL JOBS
description: Cancel specific streaming jobs.
slug: /sql-cancel-jobs
keywords: [query progress, query status, cancel SQL query]
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-cancel-jobs/" />
</head>

Use `CANCEL JOBS/JOB` to cancel specific streaming jobs that are in progress. A streaming job is a job that creates an index, a materialized view, a table, a sink, or a source with connectors. You need to specify the IDs of the jobs that you want to cancel. You can use [`SHOW JOBS`](/sql/commands/sql-show-jobs.md) to get the IDs of the jobs that are in progress.

## Syntax

```sql
CANCEL [ JOBS | JOB ] job_id [,...];
```

## Examples

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
- [Monitor statement progress](/manage/view-statement-progress.md)
