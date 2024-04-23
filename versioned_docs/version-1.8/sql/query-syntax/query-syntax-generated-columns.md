---
id: query-syntax-generated-columns
slug: /query-syntax-generated-columns
title: Generated columns
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-generated-columns/" />
</head>

A generated column is a special column that is always computed from other columns. In RisingWave, you can create a generated column when creating a table or source.

To create a generated column, use the `AS <generation_expression>` clause in `CREATE TABLE` or `CREATE SOURCE` statements, for example:

```sql
CREATE TABLE t1 (v1 int AS v2-1, v2 int, v3 int AS v2+1);
```

Note that a generation expression cannot reference another generated column.

A generated column in a table is slightly different from one in a source.

- A generated column in a table is stored in the created table, and computed when it is inserted. This is equivalent to the `STORED` type of generated columns in PostgreSQL. If a table contains a generated column, the table cannot be updated or deleted in RisingWave.

- A generated column in a source is not stored in the created source, and is computed when the source is queried. This is equivalent to the `VIRTUAL` type of generated columns in PostgreSQL.

To create a generated column as the processing time of a message, use the `proctime()` function, for example:

```sql
CREATE TABLE t1 (v1 int, proc_time timestamptz as proctime());
```

See also [`proctime()`](/sql/functions-operators/sql-function-datetime.md#proctime).