---
id: sql-function-set-operators
slug: /sql-function-set-operators
title: Set operators
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-set-operators/" />
</head>

## UNION and UNION ALL

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

## INTERSECT

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