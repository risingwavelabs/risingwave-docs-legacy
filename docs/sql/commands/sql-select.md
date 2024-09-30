---
id: sql-select
title: SELECT
description: Retrieve data from a table or a materialized view.
slug: /sql-select
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-select/" />
</head>

Use the `SELECT` command to retrieve rows from a table or materialized view. It returns the rows that satisfy the criteria that you specify with the clauses and conditions in your query.

## Syntax

```sql
[ WITH clause ]
SELECT [ ALL | DISTINCT [ ON ( expression [, ...] ) ]] [ [table_name.]* [ EXCEPT ( [table_name.]except_column, ... ] ) ] | expression [ AS output_name ] [ , expression [ AS output_name ] ... ] ]
    [ VALUES clause ]
    [ FROM from_item [ , from_item ...] ]
    [ WHERE condition ]
    [ GROUP BY grouping_expression [ , grouping_expression ... ] ]
    [ HAVING condition ]
    [ ORDER BY sort_expression [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [ , ... ] ]
    [ LIMIT count_number ]
    [ OFFSET start [ ROW | ROWS ] ];
```

Where `from_item` can be:

```sql
    table_name  [ [ AS ] alias [ ( column_alias_list ) ] ]
    window_type ( table_name, col_name, interval_expression ) [ [ AS ] alias [ ( column_alias_list ) ] ]
    ( SELECT ) [ [ AS ] alias [ ( column_alias_list ) ] ]
    from_item join_type from_item [ ON join_condition ]
```

## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**WITH** clause           | Provides a way to write supplemental statements for a larger query. For more information, see [`WITH` clause](/sql/query-syntax/query-syntax-with-clause.md). |
|**DISTINCT** clause|This clause eliminates duplicate rows from the result. `SELECT DISTINCT` eliminates duplicate rows based on **all selected columns**. `SELECT DISTINCT ON` allows you to specify expressions or columns and returns only the first row for each unique combination. It requires the use of the `ORDER BY` clause to determine the first row, and the `DISTINCT ON` expression must match the leftmost `ORDER BY` expression. The `ORDER BY` clause will normally contain additional expressions that determine the desired precedence of rows within each `DISTINCT ON` group. In this case, this expression can be an alternative with group [topN](/sql/syntax/sql-pattern-topn.md) when "N=1". See [examples of this clause](#distinct-clause) below to know more about it.|
|**EXCEPT** clause|Exclude one or more columns from the result set. By specifying *except_column*, the query will return all columns in the result set except those specified.|
|*expression*               |A column or an expression.|
|**VALUES** clause          | This clause generates one or more rows of data as a table expression. For details, see [VALUES clause](/sql/query-syntax/query-syntax-values-clause.md).|
|*alias*                    |A temporary alternative name for a table or materialized view in a query.|
|*table_name*                    |A table or materialized view.|
|*grouping_expression*      |<p>Values can be:</p><ul><li>Input column names</li><li>Input column expressions without subqueries or correlated columns</li></ul>|
|**ORDER BY** clause        | The default sort order is **ASC**, and NULLs are considered largest. See [`ORDER BY` clause](../query-syntax/query-syntax-order-by-clause.md) for more details.|
|*sort_expression*          |<p>Values can be:</p><ul><li>Output column names</li><li>Output column ordinal numbers</li><li>Hidden select expressions</li></ul>|
|*count_number*                    |The number of results you want to get. |
|**OFFSET** clause          |The `OFFSET` clause can only be used with the `LIMIT` and `ORDER BY` clauses.|
|*(SELECT)*                   |A `SELECT` command. You must enclose the subquery in parentheses, and specify an alias. When you include a subquery in the `FROM` clause, the output of the subquery is used as a temporary view that is only valid in the query.|
|*join_type*                |<p>Supported join types:</p> <ul><li>[INNER] JOIN</li><li>LEFT [OUTER] JOIN</li><li>RIGHT [OUTER] JOIN</li><li>FULL [OUTER] JOIN</li></ul><p>Currently, only the ON clause is supported for joins.</p>|
|*join_condition*           |Conditions for the `ON` clause that must be met before the two `from_items` can be joined.|
|*window_type*              |The type of the time window function. Possible values are `HOP` and `TUMBLE`.|
|*interval_expression*      |The interval expression, in the format of `INTERVAL '<interval>'`. For example: `INTERVAL '2 MINUTES'`. The standard SQL format, which places time units outside of quotation marks (for example, `INTERVAL '2' MINUTE`), is also supported. |
|**FROM** clause           | Specifies the source of the data on which the query should operate. For more information, see [`FROM` clause](/sql/query-syntax/query-syntax-from-clause.md). |
|**GROUP BY** clause           | Groups rows in a table with identical data, thus eliminating redundancy in the output and aggregates that apply to these groups. For more information, see [`GROUP BY` clause](/sql/query-syntax/query-syntax-group-by-clause.md). |
|**HAVING** clause           | Eliminates group rows that do not satisfy a given condition. For more information, see [`HAVING` clause](/sql/query-syntax/query-syntax-having-clause.md). |
|**LIMIT** clause           | When the `ORDER BY` clause is not present, the `LIMIT` clause cannot be used as part of a materialized view. For more information, see [`LIMIT` clause](/sql/query-syntax/query-syntax-limit-clause.md).|
|**WHERE** clause           | Specifies any conditions or filters to apply to your data. For more information, see [`WHERE` clause](/sql/query-syntax/query-syntax-where-clause.md). |

## Examples

### `DISTINCT` clause

Here is an example of `SELECT DISTINCT`. This query will return only the unique combinations of `first_name` and `last_name`, eliminating any duplicate rows.

```sql
-- Retrieve the names of employees.
SELECT DISTINCT first_name, last_name
FROM employees;
```

Here is an example of `SELECT DISTINCT ON`. The query returns the latest order for each unique `customer_id`. `ORDER BY` is used to ensure that the desired row, that is, the row with the latest order date, appears first; otherwise, the returned row will be unpredictable.

```sql
-- Retrieve the latest order for each unique customer.
SELECT DISTINCT ON (customer_id) order_id, customer_id, order_date, total_amount
FROM orders
ORDER BY customer_id, order_date DESC;
```


### Example of using several clauses

Below are the tables within the same schema that we will be writing queries from.

The table `taxi_trips` includes the columns `id`, `distance`, `duration`, and `fare`, where `id` identifies each unique trip.

```sql
{
  "id": VARCHAR,
  "distance": DOUBLE PRECISION,
  "duration": DOUBLE PRECISION,
  "fare": DOUBLE PRECISION
}
```

The table `taxi` includes the columns `taxi_id` and `trip_id`, where `trip_id` and `id` in `taxi_trips` are matching fields.

```sql
{
  "taxi_id": VARCHAR,
  "trip_id": VARCHAR
}
```

The table `company` includes the columns `company_id` and `taxi_id`, where `taxi_id` and `taxi_id` in `taxi` are matching fields.

```sql
{
  "company_id": VARCHAR,
  "taxi_id": VARCHAR
}
```

The following query returns the total distance and duration of trips that are beyond the initial charge ($2.50) of each taxi from the company "Yellow Taxi" and "FabCab".

```sql
SELECT
    taxi.taxi_id,
    sum(trips.distance) AS total_distance,
    sum(trips.duration) AS total_duration
FROM taxi_trips AS trips
LEFT JOIN taxi ON trips.id = taxi.trip_id
WHERE taxi_id IN (
          SELECT taxi_id
          FROM company
          WHERE company_id IN ('Yellow Taxi', 'FabCab')
      )
      AND trips.fare > 2.50
GROUP BY taxi_id
ORDER BY total_distance, total_duration;
```
