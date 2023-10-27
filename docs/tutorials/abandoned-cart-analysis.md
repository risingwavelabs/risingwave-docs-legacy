---
id: abandoned-carts
slug: /abandoned-carts
title: Abandoned Carts Analysis
description: Use RisingWave to process and prepare real-time abandon cart data from multiple sources.
---

## Overview

Abandoned cart data refers to the data collected when customers begin making purchases on an e-commerce platform by adding items to their shopping carts, but do not complete the transaction. This is a valuable resource that businesses can leverage to improve their e-commerce strategies and customer retention rates. By knowing when a customer abandons their purchase, a business can set up real-time notifications to remind the customer to return to their cart and finish the purchase. Or, the business can offer the customer personalized discounts based on the items left in the cart to improve conversion rates.

To implement real-time capabilities or to perform real-time data transformations, a strong technological infrastructure is necessary. It may also be necessary to join existing batch data with data streams. This can be difficult to set up and maintain as there are numerous moving parts and many real-time data transformation tools are tricky to manage and use. However, RisingWave makes it simple to build real-time data pipelines. Both streaming data and batch data can be ingested into RisingWave, joined, transformed, and aggregated in real-time using SQL queries, and sinked to data warehouses and lakes. To see how easily you can run RisingWave, see [Quick start](/get-started.md).

This topic will introduce the idea of using RisingWave to process and transform abandoned cart data from multiple sources.

## Step 1: Ingest data in RisingWave

In order to analyze abandoned cart data, we will process both real-time data from Kafka topics, and CDC data from MySQL. With RisingWave, we can easily ingest data from numerous sources with SQL queries. 

### MySQL data

Let us start by ingesting data from two MySQL tables. The first table stores all user data and the second stores all product data for the business. Their schemas are shown below. 

```sql
-- User schema in MySQL
CREATE TABLE users (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100) UNIQUE
);

-- Product schema in MySQL
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  category VARCHAR(50)
);
```

To read data from these two tables into RisingWave, we can use the following queries. For details on the syntax and how to set up MySQL, see [Ingest data from MySQL CDC](/guides/ingest-from-mysql-cdc.md). As the source tables in MySQL are updated with new data entries, the sources in RisingWave will also instantaneously update. 

```sql
-- Create the user table in RisingWave with MySQL as the source
CREATE TABLE users (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100)
) WITH (
  connector = 'mysql-cdc',
  hostname = '127.0.0.1',
  port = '3306',
  uesrname = 'your_username',
  password = 'your_password',
  database.name = 'mydb',
  table.name = 'users',
  server.id = '5454'
);

-- Create the products table in RisingWave with MySQL as the source
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  category VARCHAR(50)
) WITH (
  connector = 'mysql-cdc',
  hostname = '127.0.0.1',
  port = '3306',
  uesrname = 'your_username',
  password = 'your_password',
  database.name = 'mydb',
  table.name = 'products',
  server.id = '5454'
);
```

### Kafka topics

As shoppers are updating their carts, being able to instantly receive and process that data allows us to extract valuable insights in a timely manner and immediately take action, if necessary. By connecting RisingWave to a Kafka broker, we can stream these events into RisingWave in real-time. The schema of an abandoned cart event is shown below. 

```sql
-- Topic: abandoned_carts
{
  "cart_id": INT,
  "user_id": INT,
  "product_id": INT,
  "timestamp": TIMESTAMP
} 
```

With the following query, RisingWave allows us to easily connect to a Kafka broker to read data. For specifics on the query syntax and how to specify security settings, see [Ingest data from Kafka](/create-source/create-source-kafka.md). If you want to set up Kafka clusters on Confluent cloud, see [Ingest data from Confluent Cloud](/guides/confluent-kafka-source.md). 

```sql
-- Define the abandoned cart stream in RisingWave
CREATE TABLE abandoned_carts (
  cart_id INT,
  user_id INT,
  product_id INT,
  timestamp TIMESTAMP
) WITH (
  KAFKA_BOOTSTRAP_SERVERS = 'kafka:9092',
  KAFKA_TOPIC = 'abandoned_carts'
);
```

## Step 2: Join tables by creating a materialized view

To consolidate the data we just ingested, we will join the tables above by creating a materialized view. This materialized view will provide a clear overall picture of what events are occurring on the e-commerce platform. The benefit of creating a materialized view is that the results will immediately update as new data is ingested. For more on the syntax of creating a materialized view, see [CREATE MATERIALIZED VIEW](/sql/commands/sql-create-mv.md). 

The following query joins relevant fields from the three tables created in Step 1 by using multiple joins. For more on what type of joins RisingWave supports, see [Joins](/sql/query-syntax/query-syntax-join-clause.md).

```sql
CREATE MATERIALIZED VIEW abandoned_cart_analysis AS
SELECT
  a.cart_id,
  a.timestamp AS abandonment_time,
  u.id AS user_id,
  u.first_name,
  u.last_name,
  u.email,
  p.id AS product_id,
  p.name AS product_name,
  p.description AS product_description,
  p.price,
  p.category
FROM
  abandoned_carts a
  JOIN
    users u ON a.user_id = u.id
  JOIN
    products p ON a.product_id = p.id;
```

If we query from the materialized view, the output might look like the following.

```
 cart_id |  abandonment_time   | user_id | first_name | last_name |          email          | product_id | product_name | product_description       | price  | category   
---------+---------------------+---------+------------+-----------+-------------------------+------------+------------- +---------------------------+--------+------------
       1 | 2023-10-25 10:15:00 |       1 | John       | Doe       | johndoe@example.com     |        101 | Product A    | Description of Product A  |  19.99 | Category 1
       2 | 2023-10-25 11:30:00 |       2 | Alice      | Smith     | alicesmith@example.com  |        102 | Product B    | Description of Product B  |  29.99 | Category 2
       3 | 2023-10-25 12:45:00 |       3 | Bob        | Johnson   | bobjohnson@example.com  |        103 | Product C    | Description of Product C  |   9.99 | Category 1
       4 | 2023-10-25 14:00:00 |       4 | Eve        | Williams  | evewilliams@example.com |        104 | Product D    | Description of Product D  |  39.99 | Category 3
       5 | 2023-10-26 15:15:00 |       1 | John       | Doe       | johndoe@example.com     |        102 | Product B    | Description of Product B  |  29.99 | Category 2
(5 rows)
```

## Summary

In this topic, we covered the process of ingesting data from a Kafka topic and two MySQL tables and creating a materialized view that joins the three data sources. With the materialized view, we can further transform and filter the data to extract valuable insights. For instance, from all the abandoned carts, we can find the most common products. From there, we can see if certain products are not selling as well as others and respond accordingly. Or, the transformed data can be sinked to an external system to create complex visualizations or for additional analysis. RisingWave provides the necessary features to allow users to easily process and transform streaming data. 