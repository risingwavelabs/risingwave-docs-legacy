---
id: query-syntax-set-operations
slug: /query-syntax-set-operations
title: Set operations
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-set-operations/" />
</head>

The results of two queries can be combined using the set operations `UNION` and `INTERSECT`.

## `UNION` and `UNION ALL`

The UNION operator combines the result sets of 2 or more SELECT statements and removes duplicate rows between the various SELECT statements.

The UNION ALL operator combines the result sets of 2 or more SELECT statements and returns all rows from the query. It does not remove duplicate rows between the various SELECT statements.

Each SELECT statement within the UNION operator must have the same number of fields in the result sets with similar data types.

The syntax for the `UNION ALL` operator is as follows:

```sql
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions]
UNION ALL
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions];
```

*expression1, expression2, ... expression_n* are the columns or calculations you wish to retrieve.

*tables* are the tables that you wish to retrieve records from. There must be at least one table listed in the FROM clause.

*WHERE conditions* are optional. These conditions must be met for the records to be selected.

Suppose that we have a table,`points_scored_current_week`, that consists of these columns: `id`, `first_half`, and `second_half`.

|  id   |first_half|second_half|
|-------|----------|-----------|
|   1   |    10    |    20     |

Next, suppose that we have a second table, `points_scored_last_week`, that consists of these columns: `id`, `first_half`, and `second_half`.

|  id   |first_half|second_half|
|-------|----------|-----------|
|   1   |    10    |    20     |

Here is an example that uses the UNION operator:

```sql
SELECT *
FROM points_scored_current_week
UNION
SELECT *
FROM points_scored_last_week;
```

The result looks like this:

```
|  id   |first_half|second_half|
|-------|----------+-----------+
|   1   |    10    |    20     |
```

Here is an example that uses the UNION ALL operator:

```sql
SELECT *
FROM points_scored_current_week
UNION ALL
SELECT *
FROM points_scored_last_week;
```

The result looks like this:

```
|  id   |first_half|second_half|
|-------|----------+-----------+
|   1   |    10    |    20     |
|   2   |    10    |    20     |
```

:::note

UNION and UNION ALL operators are both supported for streaming queries.

:::

## `INTERSECT`

The `INTERSECT` operator combines the result sets of 2 or more `SELECT` statements and returns only the rows that are common to all the `SELECT` statements. It removes duplicate rows from the final result set.

Each `SELECT` statement within the `INTERSECT` operator must have the same number of fields in the result sets with similar data types.

The syntax for the `INTERSECT` operator is as follows:

```sql
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions]
INTERSECT
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions];
```

*expression1, expression2, ... expression_n* are the columns or calculations you wish to retrieve.

*tables* are the tables that you wish to retrieve records from. There must be at least one table listed in the `FROM` clause.

*WHERE conditions* are optional. These conditions must be met for the records to be selected.

Suppose that we have a table,`points_scored_current_week`, that consists of these columns: `id`, `first_half`, and `second_half`.

|  id   |first_half|second_half|
|-------|----------|-----------|
|   1   |   10     |    20     |

Next, suppose that we have a second table, `points_scored_last_week`, that consists of these columns: `id`, `first_half`, and `second_half`.

|  id   |first_half|second_half|
|-------|----------|-----------|
|   1   |   10     |    20     |

Here is an example that uses the `INTERSECT` operator:

```sql
SELECT *
FROM points_scored_current_week
INTERSECT
SELECT *
FROM points_scored_last_week;
```

The result looks like this:

```
|  id   |first_half|second_half|
|-------|----------+-----------+
|   1   |    10    |    20     |
```

In this case, the `INTERSECT` operator returned the rows that are common to both the `points_scored_current_week` and `points_scored_last_week` tables. If there were no common rows, the `INTERSECT` operator would return an empty set.

:::note

`INTERSECT` operator is supported for streaming queries.

:::

## `CORRESPONDING` in set operations

Set operations (`UNION`, `INTERSECT`, and `EXCEPT`) require that the two queries return the same number of columns, and that the columns must match in left-to-right order (by column index).

You can use the `CORRESPONDING` keyword in these operations to match columns by name instead of relying on a strict column order. This approach only overlays columns that exist on both sides of the set operation. It ignores columns that aren't present in both sets. Columns are considered matching if they have the same name or alias.

Assuming we are obtaining data from two tables, the syntax for using `CORRESPONDING` is:

```sql
SELECT column1, column2, ...
FROM table1
<operation> CORRESPONDING [BY (column_name1, column_name2, ...)]
SELECT column1, column2, ...
FROM table2;
```

`<operation>` is one of the below operations:

```sql
UNION [ALL] | INTERSECT | EXCEPT
```

If you want to explicitly specify the columns to match, use the `CORRESPONDING BY` clause. Only columns that are on both sides and specified will be overlaid. For example:

```sql
-- Not specifying the columns to match. Columns id, name, gender will be overlaid.
SELECT id, name, age, gender
FROM employees
UNION CORRESPONDING
SELECT id, name, salary, gender
FROM managers;

-- Specify the columns to match. Only id and name columns will be overlaid.
SELECT id, name, age, gender
FROM employees
UNION CORRESPONDING BY (id, name)
SELECT id, name, salary, gender
FROM managers;
```