---
id: sql-show-jobs
title: SHOW JOBS
description: Show all streaming jobs.
slug: /sql-show-jobs
keywords: [monitor query progress, query status]
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-jobs/" />
</head>

Use `SHOW JOBS` to get all streaming jobs that are in progress, including their IDs, the specific statements, and their progresses. In RisingWave, a streaming job refers to the creation of a materialized view, an index, a table, a sink or a source with connectors. If a streaming job takes too long, you can use the [`CANCEL JOBS`](/sql/commands/sql-cancel-jobs.md) to cancel it.

## Syntax

```sql
SHOW JOBS [ LIKE_expression ];
```

## Parameters
|Parameter   | Description           |
|---------------------------|-----------------------|
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|

## Example

```sql
SHOW JOBS;
------RESULT
  Id  |                     Statement                     | Progress
------+---------------------------------------------------+----------
 1010 | CREATE MATERIALIZED VIEW mv3 AS SELECT *FROM mv1  | 2.21%
 1012 | CREATE MATERIALIZED VIEW mv2 AS SELECT* FROM mv1  | 0.86%
```

## Related topics

- [Monitor statement progress](/manage/view-statement-progress.md)
- [`CANCEL JOBS`](/sql/commands/sql-cancel-jobs.md)
