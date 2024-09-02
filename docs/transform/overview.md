---
id: transform-overview
slug: /transform-overview
title: Overview
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/transform-overview/" />
</head>

Data transformation is a crucial step in converting raw data into valuable insights. It involves applying various operations such as filtering, aggregating, and joining data to derive meaningful information. In the upcoming section, we will delve into the techniques used in the process of transforming and querying data.

## Declare Data Transformation in SQL

Easy to use: RisingWave uses Postgres-compatible SQL as the interface for declaring transformations. By aligning with PostgreSQL's syntax, functions, and data types, RisingWave eases the learning curve and enhances accessibility for users.
Powerful: RisingWave fully supports and optimizes a variety of SQL features, including advanced features such OVER window and different kinds of JOINs. At the same time, we are also committed to expanding the expressive power of SQL, such as by adding semi-structured data types and corresponding expressions.

## When is Transformation Performed? Batch(On Read) v.s. Streaming(On Write)

There are 2 execution modes in our system serving different analytics purposes. The results of these two modes are the same and the difference lies in the timing of data processing, whether it occurs at the time of data ingestion(on write) or when the query is executed(on read).

- **Batch**: Just like traditional databases, RisingWave allows users to send `SELECT` statement to query the result. At this point, RisingWave reads the data from the current snapshot, processes it, and returns the results.
- **Streaming**: More powerful, RisingWave allows users to predefine SQL queries with `CREATE MATERIALIZED VIEW` statement. When the base tables (in the `FROM` clause) in the query are updated, RisingWave will incrementally update the results automatically.

Both modes have their unique advantages. Here are some considerations:

- **Cost & Performance**: Streaming mode can pre-compute and store results, which may improve query performance since the heavy lifting is done upfront. 
- **Flexibility**: The streaming mode is less flexible to changes in query requirements. Especially for ad-hoc queries, the batch mode is still necessary.

<details>
<summary>ad-hoc query</summary>
An ad-hoc query refers to a query that is created on-the-fly to fulfill immediate and specific information needs. Unlike predefined queries, ad-hoc queries are generated in real-time based on your current requirements. They are commonly used in data analysis, decision-making, and exploratory data tasks, where flexibility and quick access to information are crucial..
</details>


## Example

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

At this point, an example where batch mode is more appropriate is when an analyst or an application needs to query how many products have higher sales volumes than a specific product.

```sql
dev=> SELECT count(*) FROM mv_sales_summary where mv_sales_summary.total_sales >
    (SELECT total_sales FROM mv_sales_summary where product_id = 1);

----RESULT
 count
-------
     2
(1 row)```