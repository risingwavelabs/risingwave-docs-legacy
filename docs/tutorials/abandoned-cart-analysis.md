---
id: abandoned-carts
slug: /abandoned-carts
title: Abandoned Carts Analysis
description: Use RisingWave to process and prepare real-time events from multiple sources to analyze abandon cart data.
---

## Overview



## Step 1: Ingest data in RisingWave

In order to analyze abandoned cart data, we will need to process both real-time data from Kafka topics, and static data MySQL. 

### MySQL data

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

```sql
-- Create the user and product tables in RisingWave using MySQL as the source
CREATE TABLE users (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100)
) WITH (
  MYSQL_CONNECTION_URL = 'jdbc:mysql://mysql:3306/your_database',
  MYSQL_USERNAME = 'your_username',
  MYSQL_PASSWORD = 'your_password',
  MYSQL_TABLE_NAME = 'users'
);

CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  category VARCHAR(50)
) WITH (
  MYSQL_CONNECTION_URL = 'jdbc:mysql://mysql:3306/your_database',
  MYSQL_USERNAME = 'your_username',
  MYSQL_PASSWORD = 'your_password',
  MYSQL_TABLE_NAME = 'products'
);
```

### Kafka topics

```sql
-- Topic: abandoned_carts
{
  "cart_id": INT,
  "user_id": INT,
  "product_id": INT,
  "timestamp": TIMESTAMP
} 
```

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

In order to join the tables created, we can create a materialized view. The benefit of creating a materialized view is that the results will instantly update as new data is ingested. For more details about the syntax on how to create a materialized view, see [CREATE MATERIALIZED VIEW](/sql/commands/sql-create-mv.md). 

The following query joins relevant fields from the three tables created in Step 1 by using multiple joins. For more details on what type of joins RisingWave supports, see [Joins](/sql/query-syntax/query-syntax-join-clause.md).

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
  users u
ON
  a.user_id = u.id
JOIN
  products p
ON
  a.product_id = p.id;
```

