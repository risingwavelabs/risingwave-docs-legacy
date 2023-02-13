---
id: sql-pattern-dynamic-filter
slug: /sql-pattern-dynamic-filter
title: Dynamic filter
---

Dynamic filter functions as a filter operator, but the filter condition contains a dynamic variable determined by the inner stream.

The terms "outer" and "inner" come from the concept of nested-loop join operator, which uses a 2-layer nested looping process. These terms describe the relationship between the two tables being joined, with the "outer" table providing the data for each iteration of the inner loop and the "inner" table being the one used to match and return the corresponding data for each iteration. Dynamic filter is a specialized subset of nested-loop join.

Dynamic filter enables filtering data streams in real-time. It allows a condition to be defined that incoming data must meet in order to be processed.

A streaming query is a type of query that processes incoming data in real-time as it arrives instead of waiting for all data to be loaded into the database in bulk before processing it all at once, as is done with a batch query. This enables continuous, low-latency processing of data streams, allowing applications to respond quickly to new data as it arrives. 

General non-equal joins are not supported in streaming, except for one special case. If a query with non-equal conditions meets the conditions below:

- The inner side always contains exactly one row.
- None of the columns from the inner side is required to output.
- The filter condition can be incrementally evaluated when the inner row changes.



The following example query calculates the parts that cost more than 0.01% of the total money spent.

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

The query above retrieves the sum of the product of `ps_supplycost` and `ps_availqty` for each unique `ps_partkey` value in the `partsupp` table. The result is grouped by `ps_partkey` and filtered by a condition in the `HAVING` clause, where the sum of the product of `ps_supplycost` and `ps_availqty` must be greater than 0.01% of the sum of the product of `ps_supplycost` and `ps_availqty` for all rows in the `partsupp` table.

The query returns two columns: `ps_partkey` and `value`, where `value` is the sum of the product of `ps_supplycost` and `ps_availqty` for each unique `ps_partkey`.




The following example query returns the name of all products whose profit margin is greater than the maximum profit margin recorded in the `sales` table.



```sql
WITH max_profit AS (SELECT max(profit_margin) max FROM sales) 
SELECT product_name FROM products, max_profit 
WHERE product_profit > max;
```


In the example above, the subquery `max_profit` calculates the maximum profit margin recorded in the `sales` table. The main query selects the product name and compares it to the maximum profit margin to determine if it is greater.

The dynamic filter in this query is in the `WHERE` clause. The filter condition `product_profit > max` compares the `product_profit` column from the `products` table to the maximum value of the `profit_margin` column from the `sales` table, which is stored in the subquery `max_profit`. The value of the maximum profit margin is dynamic and changes based on the values in the `sales` table.









