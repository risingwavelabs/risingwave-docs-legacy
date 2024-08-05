---
id: sql-as-changelog
title: AS CHANGELOG
description: Convert stream into an append-only changelog. 
slug: /sql-as-changelog
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-as-changelog/" />
</head>

Use `AS CHANGELOG` clause to convert any stream into an append-only changelog. This feature is particularly useful when sinking data to append-only sinks like Snowflake using Snowpipe.

## Syntax

```sql
WITH table_name AS CHANGELOG FROM source_table;
```

- The AS CHANGELOG clause is typically used when creating materialized views that need to be compatible with append-only sinks.
- The resulting changelog includes additional columns such as `changelog_op` and `_changelog_row_id` to track changes.

## Example

```sql
  CREATE MATERIALIZED VIEW ss_mv AS
  WITH sub AS CHANGELOG FROM user_behaviors
  SELECT
      user_id,
      target_id,
      event_timestamp AT TIME ZONE 'America/Indiana/Indianapolis' as event_timestamp,
      changelog_op AS __op,
      _changelog_row_id::bigint AS __row_id
  FROM
      sub;
```
