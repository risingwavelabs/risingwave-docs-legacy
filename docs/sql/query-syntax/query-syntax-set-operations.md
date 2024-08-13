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

Set operations (`UNION`, `INTERSECT`, and `EXCEPT`) typically require:

- Both queries to return the same number of columns
- Columns to match in left-to-right order (by column index)

However, you can use the `CORRESPONDING` keyword to match columns by name instead of order. This approach:

- Only combines columns that exist in both sets
- Ignores columns not present in both sets
- Considers columns matching if they have the same name or alias

Overall, using `CORRESPONDING` gives you more flexibility when performing set operations, as it doesn't rely on strict column ordering.


The syntax for using `CORRESPONDING` is as below:

```sql
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions]
<operation> CORRESPONDING [BY (column_name1, column_name2, ...)]
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions];
```

`<operation>` is one of the below operations:

```sql
UNION [ALL] | INTERSECT | EXCEPT
```

If you want to explicitly specify the columns to match, use the `CORRESPONDING BY` specification. Only columns that are specified and exist on both sides will be overlaid.

Here is a simple example. First, let's create two tables `employees` and `managers`, and insert some data. Then you can use the `CORRESPONDING` keyword.

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR,
    age INT,
    gender VARCHAR
);

CREATE TABLE managers (
    id INT PRIMARY KEY,
    name VARCHAR,
    salary DECIMAL,
    gender VARCHAR
);

INSERT INTO employees (id, name, age, gender) VALUES
(1, 'Alice', 30, 'Female'),
(2, 'Bob', 25, 'Male'),
(3, 'Charlie', 28, 'Male');

INSERT INTO managers (id, name, salary, gender) VALUES
(1, 'David', 80000, 'Male'),
(2, 'Eve', 90000, 'Female'),
(3, 'Frank', 75000, 'Male');
```

```sql
-- Not specifying the columns to match. Columns id, name, gender will be overlaid.
SELECT id, name, age, gender
FROM employees
UNION CORRESPONDING
SELECT id, name, salary, gender
FROM managers;

----RESULT
id |  name   | gender 
----+---------+--------
  1 | Alice   | Female
  3 | Frank   | Male
  1 | David   | Male
  3 | Charlie | Male
  2 | Eve     | Female
  2 | Bob     | Male
(6 rows)
```

```sql
-- Specify the columns to match. Only id and name columns will be overlaid.
SELECT id, name, age, gender
FROM employees
UNION CORRESPONDING BY (id, name)
SELECT id, name, salary, gender
FROM managers;

----RESULT
 id |  name   
----+---------
  3 | Charlie
  1 | Alice
  3 | Frank
  1 | David
  2 | Eve
  2 | Bob
(6 rows)
```