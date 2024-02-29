---
id: indexes
slug: /indexes
title: Indexes
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/indexes/" />
</head>

Indexes in a database are designed to increase the speed at which the database management system (DBMS) can locate and retrieve the desired data from a table or a materialized view. Indexes are usually created on one or more columns in a table and can greatly improve the performance of queries, particularly for tables that are large in size or accessed frequently. Indexes are usually created on non-primary columns to speed up point-select queries on those columns.

## Benefits of using indexes

In general, using indexes can significantly enhance the performance and efficiency of the system.

## When to use indexes

Indexes can be particularly useful for optimizing the performance of queries that retrieve a small number of records from a large dataset. In RisingWave, indexes can speed up batch queries.

## How to use indexes

You can use the [`CREATE INDEX`](/sql/commands/sql-create-index.md) command to construct an index on a table or a materialized view. The syntax is as follows:

```sql
CREATE INDEX [IF NOT EXISTS] index_name ON object_name ( index_column [ ASC | DESC ], [, ...] )
[ INCLUDE ( include_column [, ...] ) ]
[ DISTRIBUTED BY ( distributed_column [, ...] ) ];
```

Here is a simple example. Let's create two tables, `customers` and `orders`.

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

## How to decide which columns to include?

By default, RisingWave creates an index that includes all columns of a table or a materialized view if you omit the `INCLUDE` clause. This differs from the standard PostgreSQL. This is because RisingWave's design as a cloud-native streaming database includes several key differences from PostgreSQL, including the use of an object store for more cost-effective storage, and the desire to make index creation as simple as possible for users who are not experienced with database systems. 

By including all columns, RisingWave ensures that an index will cover all of the columns touched by a query and eliminates the need for a primary table lookup, which can be slower in a cloud environment due to network communication. However, RisingWave still provides the option to include only specific columns using the `INCLUDE` clause for users who wish to do so.

For example:

If your queries only access certain columns, you can create an index that includes only those columns. The RisingWave optimizer will automatically select the appropriate index for your query.

```sql
-- Create an index that only includes necessary columns
CREATE INDEX idx_c_phone1 ON customers(c_phone) INCLUDE (c_name, c_address);

-- RisingWave will automatically use index idx_c_phone1 for the following query since it only access the indexed columns.
SELECT c_name, c_address FROM customers WHERE c_phone = '123456789';
```

:::tip
You can use the [`EXPLAIN`](/sql/commands/sql-explain.md) command to view the execution plan.
:::

## How to decide the index distribution key?

RisingWave will use the first index column as the `distributed_column` by default if you omit the `DISTRIBUTED BY` clause. RisingWave distributes the data across multiple nodes and uses the `distributed_column` to determine how to distribute the data based on the index. If your queries intend to use indexes but only provide the prefix of the `index_column`, it could be a problem for RisingWave to determine which node to access the index data from. To address this issue, you can specify the `distributed_column` yourself, ensuring that these columns are the prefixes of the `index_column`.

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
## Indexes on expressions

RisingWave supports creating indexes on expressions. Indexes on expressions are normally used to improve the performance of queries for frequently used expressions. To create an index on an expression, use the syntax:

```sql
CREATE INDEX index_name ON object_name (expression(column_name));
```

For example, if you often perform queries like this:

```sql
SELECT * FROM people WHERE (first_name || ' ' || last_name) = 'John Smith';
```

Then you might want to create an index like the following to improve the performance of such queries:

```sql
CREATE INDEX people_names ON people ((first_name || ' ' || last_name));
```

## See also


[`CREATE INDEX`](/sql/commands/sql-create-index.md) - Create an in dex constructed on a table or a materialized view.
[`DROP INDEX`](/sql/commands/sql-drop-index.md) — Remove an index constructed on a table or a materialized view.
[`SHOW CREATE INDEX`](/docs/sql/commands/sql-show-create-index.md) - See what query was used to create the specified index.
[`ALTER INDEX`](/docs/sql/commands/sql-alter-create-index.md) - Modify an index.