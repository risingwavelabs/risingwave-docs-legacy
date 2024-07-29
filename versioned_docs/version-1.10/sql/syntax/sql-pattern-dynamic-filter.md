---
id: sql-pattern-dynamic-filters
slug: /sql-pattern-dynamic-filters
title: Dynamic filters
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-pattern-dynamic-filters/" />
</head>

Dynamic filters function as filter operators, but the filter condition contains a dynamic variable. They enable filtering data streams in real-time and allow a condition to be defined that incoming data must meet in order to be processed.

An valid dynamic filter comprises the following components:

- A comparison operator including `<`, `>`, `<=`, `>=` and `BETWEEN`
- A column as the left side 
- A scalar subquery as the right side

Additionally, the dynamic filter condition must not be part of an `OR` expression. For example, `v > (select max(v) from t2) OR a > 0` is invalid.

The following query returns the name of all products whose profit margin is greater than the maximum profit margin recorded in the `sales` table.

```sql
WITH max_profit AS (SELECT max(profit_margin) max FROM sales) 
SELECT product_name FROM products, max_profit 
WHERE product_profit > max;
```

The dynamic filter in this query is in the `WHERE` clause. The filter condition `product_profit > max` compares the `product_profit` column from the `products` table to the maximum value of the `profit_margin` column from the `sales` table, which is stored in the subquery `max_profit`. The value of the maximum profit margin is dynamic and changes based on the values in the `sales` table.


The following query calculates the parts that cost more than 0.01% of the total money spent.

```sql
CREATE MATERIALIZED VIEW mv1 AS
SELECT
  ps_partkey,
  sum(ps_supplycost * ps_availqty) AS value
FROM
  partsupp
GROUP BY
  ps_partkey
HAVING
  sum(ps_supplycost * ps_availqty) > (
    SELECT
      sum(ps_supplycost * ps_availqty) * 0.0001
    FROM
      partsupp
  )
```

Under the hood, RisingWave maintains this materialized view with a continuous streaming job that filters the aggregation results according to the `HAVING` clause. Note that the subquery result, which is 0.01% of the total cost, is constantly changing, either increasing or decreasing, depending on the incoming changes to the `partsupp` table.

As this value increases, more results will satisfy this condition and be output; conversely, as this value decreases, more rows are filtered out, and fewer results will be output.

RisingWave implements this using dynamic filters, internal stateful operators that keep a full set of results before filtering and decides which changes should be output.
