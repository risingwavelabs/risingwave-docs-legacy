---
id: transform-overview
slug: /transform-overview
title: Overview
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/transform-overview/" />
</head>

Data transformation is a critical process in converting raw data into valuable insights. It involves applying various operations such as filtering, aggregating, and joining data to derive meaningful information. The "Transform & query data" part will dive into the techniques used in the process of transforming and querying data. Before that, here is a simple introduction to data transformation for you.

## How transformation is performed

 Data transformation is performed normally via a materialized view, but can also be done via a sink. Let's understand how transformation logic is expressed with materialized views. 

 First, assume we have a `sales_data` table, which saves information about product ID (`product_id`) and product sales amount (`sales_amount`).

```sql title="sales_data"
product_id | sales_amount 
------------+--------------
          1 |           75
          2 |          150
          2 |          125
          1 |          100
          3 |          200
```

You can use the following statement to create this table.

```sql title="Create table and insert data"
CREATE TABLE sales_data (
    product_id INT,
    sales_amount INT
);

INSERT INTO sales_data (product_id, sales_amount) 
VALUES 
    (1, 100),
    (1, 75),
    (2, 150),
    (2, 125),
    (3, 200);
```

Based on this table, we create a materialized view `mv_sales_summary` to calculate total sales amount by product:


```sql
CREATE MATERIALIZED VIEW mv_sales_summary AS
SELECT product_id, SUM(sales_amount) AS total_sales
FROM sales_data
GROUP BY product_id;
```

Then we can query the materialized view to retrieve the transformed data:


```sql
SELECT * FROM mv_sales_summary;

----RESULT
 product_id | total_sales 
------------+-------------
          1 |         175
          2 |         275
          3 |         200
(3 rows)
```

By following the above steps, you have successfully transformed the data from the `sales_data` table into a materialized view `mv_sales_summary` that provides the total sales amount for each product. Materialized views offer a way to precompute and store aggregated data, improving query performance and simplifying data analysis tasks.