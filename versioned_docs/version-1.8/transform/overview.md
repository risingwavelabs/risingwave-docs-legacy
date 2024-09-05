---
id: transform-overview
slug: /transform-overview
title: Overview
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/transform-overview/" />
</head>

Data transformation is a crucial step in converting raw data into valuable insights. It involves applying various operations such as filtering, aggregating, and joining data to derive meaningful information. In the upcoming section, we will delve into the techniques used in the process of transforming and querying data. But first, let's provide you with a simple introduction to data transformation.

## How transformation is performed

Normally, data transformation is accomplished through the use of materialized views, although it can also be done via a sink. Let's focus on how transformation logic is expressed using materialized views.

To illustrate, let's consider a hypothetical scenario where we have a table called `sales_data`. This table stores information about product IDs (`product_id`) and their corresponding sales amounts (`sales_amount`).

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

Based on the `sales_data` table, we can create a materialized view called `mv_sales_summary` to calculate the total sales amount for each product.


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

By following the steps outlined above, you have successfully transformed the data from the `sales_data` table into a materialized view called `mv_sales_summary`. This materialized view provides the total sales amount for each product. Utilizing materialized views allows for precomputing and storing aggregated data, which in turn improves query performance and simplifies data analysis tasks.