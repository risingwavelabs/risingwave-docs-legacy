---
id: sql-as-changelog
title: AS CHANGELOG
description: Convert stream into an append-only changelog. 
slug: /sql-as-changelog
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-as-changelog/" />
</head>

Use the `AS CHANGELOG` clause to convert a changelog operation in a stream into a column. This can be used to create materialized views and sinks. See the practice in [Sink data with upsert in Snowflake](/guides/sink-to-snowflake.md#sink-data-with-upsert).

## Syntax

```sql
WITH table_name AS CHANGELOG FROM source_table;
```

This is done using the CTE syntax. It converts the `source_table` change record to a column of `table_name`.

## Example

```sql title="Create MV"
CREATE MATERIALIZED VIEW ss_mv AS
WITH sub AS CHANGELOG FROM user_behaviors
SELECT
    user_id,
    target_id,
    event_timestamp AT TIME ZONE 'America/Indiana/Indianapolis' AS event_timestamp,
    changelog_op AS __op,
    _changelog_row_id::bigint AS __row_id
FROM
    sub;
```

```sql title="Changelog operation"
INSERT INTO user_behaviors (v1, v2) VALUES (1, 1);
INSERT INTO user_behaviors (v1, v2) VALUES (2, 2);

DELETE FROM user_behaviors WHERE v1 = 2;

UPDATE user_behaviors SET v2 = 100 WHERE v1 = 1;
```

```sql title="Query MV"
SELECT * FROM ss_mv;

-------RESULT
v1 v2 changelog_op
1   1    1
2    2    1
2    2    2
1    1    4
1   100  3
```
