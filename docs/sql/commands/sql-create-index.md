---
id: sql-create-index
title: CREATE INDEX
description: Create an index on a column of a table or a materialized view to speed up data retrieval.
slug: /sql-create-index
---

Use the `CREATE INDEX` command to construct an index on a table or a materialized view.

## About indexes

### What are indexes?

Indexes in a database are designed to increase the speed at which the database management system (DBMS) can locate and retrieve the desired data from a table or a materialized view. Indexes are usually created on one or more columns in a table and can greatly improve the performance of queries, particularly for tables that are large in size or accessed frequently. Indexes are usually created on non-primary columns to speed up point-select queries on those columns.

### Benefits of using indexes

In general, using indexes can significantly enhance the performance and efficiency of the system.

### When to use indexes

Indexes can be particularly useful for optimizing the performance of queries that retrieve a small number of records from a large dataset. In RisingWave, indexes can speed up the batch query.


## Syntax

```sql
CREATE INDEX index_name ON object_name ( index_column [, ...] )
[ INCLUDE ( include_column [, ...] ) ]
[ DISTRIBUTED BY ( distributed_column [, ...] ) ];
```

### Parameters

| Parameter or clause| Descriptiion|
|-----------|-------------|
|*index_name*    |The name of the index to be created.|
|*object_name*    |The name of the table or materialized view where the index is created.|
|*index_column*   |The name of the column on which the index is created.|
|**INCLUDE** clause|Specify the columns to include in the index as non-key columns.<ul><li>An index-only query can return the values of non-key columns without having to visit the indexed table thus improving the performance.</li><li>If you omit the `INCLUDE` clause, all columns of the table or materialized view will be indexed. This is recommended in RisingWave.</li><li>If you only want to include the `index_column`, use `CREATE INDEX ON object_name(index_column) INCLUDE(index_column);`.</li><li>See [How to decide which columns to include](#how-to-decide-which-columns-to-include) for more information.</li></ul>|
|**DISTRIBUTED BY** clause|Specify the index distribution key.<ul><li>As a distributed database, RisingWave distributes the data across multiple nodes. When an index is created, the distribution key is used to determine how the data should be distributed across these nodes.</li><li>If you omit the `DISTRIBUTED BY` clause, `index_column` will be be used as the default distribution key.</li><li>`distributed_column` has to be the prefix of `index_column`.</li><li>See [How to decide the index distribution key](#how-to-decide-the-index-distribution-key) for more information.</li></ul>|

## Examples

Let's create two tables, `customers` and `orders`.

```sql
CREATE TABLE customers (
    c_custkey INTEGER,
    c_name VARCHAR,
    c_address VARCHAR,
    c_nationkey INTEGER,
    c_phone VARCHAR,
    c_acctbal NUMERIC,
    c_mktsegment VARCHAR,
    c_comment VARCHAR,
    PRIMARY KEY (c_custkey)
);

CREATE TABLE orders (
    o_orderkey BIGINT,
    o_custkey INTEGER,
    o_orderstatus VARCHAR,
    o_totalprice NUMERIC,
    o_orderdate DATE,
    o_orderpriority VARCHAR,
    o_clerk VARCHAR,
    o_shippriority INTEGER,
    o_comment VARCHAR,
    PRIMARY KEY (o_orderkey)
);
```

If you want to speed up the query of fetching a customer record by the phone number, you can build an index on the `c_phone` column in the `customers` table.

```sql
CREATE INDEX idx_c_phone on customers(c_phone);

SELECT * FROM customers where c_phone = '123456789';

SELECT * FROM customers where c_phone in ('123456789', '987654321');
```

If you want to speed up the query of fetching all the orders of a customer by the customer key, you can build an index on the `o_custkey` column in the `orders` table.

```sql
CREATE INDEX idx_o_custkey ON orders(o_custkey);

SELECT * FROM customers JOIN orders ON c_custkey = o_custkey 
WHERE c_phone = '123456789';
```

### How to decide which columns to include?

By default, RisingWave creates an index that includes all columns of a table or a materialized view if you omit the `INCLUDE` clause. This differs from the standard PostgreSQL. Why? RisingWave's design as a cloud-native streaming database includes several key differences from PostgreSQL, including the use of an object store for more cost-effective storage and the desire to make index creation as simple as possible for users who are not experienced with database systems. By including all columns, RisingWave ensures that an index will cover all of the columns touched by a query and eliminates the need for a primary table lookup, which can be slower in a cloud environment due to network communication. However, RisingWave still provides the option to include only specific columns using the `INCLUDE` clause for users who wish to do so.

For example:

If your queries only access certain columns, you can create an index that includes only those columns. The RisingWave optimizer will automatically select the appropriate index for your query.

```sql
-- Create an index that only includes necessary columns
CREATE INDEX idx_c_phone1 ON customers(c_phone) INCLUDE (c_name, c_address);

-- RisingWave will automatically use index idx_c_phone1 for the following query since it only access the indexed columns.
SELECT c_name, c_address FROM customers WHERE c_phone = '123456789';
```
:::tip
You can use the [`EXPLAIN`](sql-explain.md) statement to view the execution plan.
:::

### How to decide the index distribution key?

RisingWave will use the `index_column` to be the `distributed_column` by default if you omit the `DISTRIBUTED BY` clause. RisingWave distributes the data across multiple nodes and uses the `distributed_column` to determine how to distribute the data based on the index. If your queries intend to use indexes but only provide the prefix of the `index_column`, it could be a problem for RisingWave to determine which node to access the index data from. To address this issue, you can specify the `distributed_column` yourself, ensuring that these columns should be the prefix of the `index_column`.

For example:

```sql
-- Create an index with specified distributed columns
CREATE INDEX idx_c_phone2 ON customers(c_name, c_nationkey) DISTRIBUTED BY (c_name);

SELECT * FROM customers WHERE c_name = 'Alice';
```

<!--- original examples
The following statement creates an index on the `id` column in the `taxi_trips` table and includes the `distance` and `city` columns as non-key columns in the index.

```sql
CREATE INDEX id_index ON taxi_trips(id) INCLUDE (distance, city);
```

To see the indexes of a table, run the `DESCRIBE` statement. For example:

```sql
DESCRIBE taxi_trips;
```
```
   Name   |               Type                
----------+-----------------------------------
 id       | Int32
 distance | Float64
 city     | Varchar
 id_index | index(id) include(distance, city)
(4 rows)
```

The following statement creates an index on the `ad_id` column in the `ad_ctr_5min` materialized view:
```sql
CREATE INDEX ad_id_index ON ad_ctr_5min(ad_id);
```

Alternatively, you can create a materialized view to improve query performance:
```sql
CREATE MATERIALIZED VIEW ad_id_index_mv AS 
    SELECT ad_id FROM ad_ctr_5min
    ORDER BY ad_id;
```
-->

## See also

[`DROP INDEX`](sql-drop-index.md) — Remove an index constructed on a table or a materialized view.