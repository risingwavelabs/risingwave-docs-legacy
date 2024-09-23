---
id: sql-create-index
title: CREATE INDEX
description: Create an index on a column of a table or a materialized view to speed up data retrieval.
slug: /sql-create-index
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-index/" />
</head>

Use the `CREATE INDEX` command to construct an [index](/transform/indexes.md) on a table or a materialized view.

## Syntax

```sql
CREATE INDEX [ IF NOT EXISTS ] index_name ON object_name ( index_column [ ASC | DESC ], [, ...] )
[ INCLUDE ( include_column [, ...] ) ]
[ DISTRIBUTED BY ( distributed_column [, ...] ) ];
```

## Parameters

| Parameter or clause| Description|
|-----------|-------------|
|**IF NOT EXISTS**|This clause is used to check if an index with the specified name already exists before creating a new index. If the index already exists, the clause prevents an error from occurring and the index creation operation is skipped. A notice is issued in this case. Note that there is no guarantee that the existing index is anything like the one that would have been created. Index name is required when `IF NOT EXISTS` is specified.|
|*index_name*    |The name of the index to be created.|
|*object_name*    |The name of the table or materialized view where the index is created.|
|*index_column*   |The name of the column on which the index is created.|
|**DESC**   |Sort the data returned in descending order.|
|**INCLUDE** clause|Specify the columns to include in the index as non-key columns.<ul><li>An index-only query can return the values of non-key columns without having to visit the indexed table thus improving the performance.</li><li>If you omit the `INCLUDE` clause, all columns of the table or materialized view will be indexed. This is recommended in RisingWave.</li><li>If you only want to include the `index_column`, use `CREATE INDEX ON object_name(index_column) INCLUDE(index_column);`.</li><li>See [How to decide which columns to include](/transofrm/indexes.md#how-to-decide-which-columns-to-include) for more information.</li></ul>|
|**DISTRIBUTED BY** clause|Specify the index distribution key.<ul><li>As a distributed database, RisingWave distributes the data across multiple nodes. When an index is created, the distribution key is used to determine how the data should be distributed across these nodes.</li><li>If you omit the `DISTRIBUTED BY` clause, the first index column will be be used as the default distribution key.</li><li>`distributed_column` has to be the prefix of `index_column`.</li><li>See [How to decide the index distribution key](/transofrm/indexes.md#how-to-decide-the-index-distribution-key) for more information.</li></ul>|

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

RisingWave supports creating indexes on expressions. For more details, see [Indexes on expressions](/transform/indexes.md#Indexes-on-expressions).
