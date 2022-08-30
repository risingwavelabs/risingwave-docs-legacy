---
id: sql-explain
title: EXPLAIN
description: Show the execution plan of a statement.
slug: /sql-explain
---

Use the `EXPLAIN` command to show the execution plan of a statement. 

## Syntax

```sql
EXPLAIN statement;
```

## Parameters

|Parameter      | Description|
|---------------|------------|
|*statement*        | A statement that is executable in RisingWave.          |


## Examples

The following statement shows the execution plan of a `SELECT` statement.

```sql
EXPLAIN SELECT
    o_orderpriority,
    count(*) AS order_count
FROM
    orders
WHERE
    o_orderdate >= date '1997-07-01'
    and o_orderdate < date '1997-07-01' + interval '3' month
    and exists (
        SELECT
            *
        FROM
            lineitem
        WHERE
            l_orderkey = o_orderkey
            and l_commitdate < l_receiptdate
    )
GROUP BY
    o_orderpriority
ORDER BY
    o_orderpriority;
```

The execution plan looks like this:

```
 BatchExchange { order: [orders.o_orderpriority ASC], dist: Single }
   BatchSort { order: [orders.o_orderpriority ASC] }
     BatchHashAgg { group_key: [orders.o_orderpriority], aggs: [count] }
       BatchExchange { order: [], dist: HashShard(orders.o_orderpriority) }
         BatchHashJoin { type: LeftSemi, predicate: orders.o_orderkey = lineitem.l_orderkey }
           BatchExchange { order: [], dist: HashShard(orders.o_orderkey) }
             BatchProject { exprs: [orders.o_orderkey, orders.o_orderpriority] }
               BatchFilter { predicate: (orders.o_orderdate >= '1997-07-01':Varchar::Date) AND (orders.o_orderdate < ('1997-07-01':Varchar::Date + '3 mons 00:00:00':Interval)) }
                 BatchScan { table: orders, columns: [o_orderkey, o_orderpriority, o_orderdate] }
           BatchExchange { order: [], dist: HashShard(lineitem.l_orderkey) }
             BatchProject { exprs: [lineitem.l_orderkey] }
               BatchFilter { predicate: (lineitem.l_commitdate < lineitem.l_receiptdate) }
                 BatchScan { table: lineitem, columns: [l_orderkey, l_commitdate, l_receiptdate] }
(13 rows)
```

<!-- Previous example. Before this change: https://github.com/singularity-data/risingwave/pull/4253 

```sql
EXPLAIN SELECT P.name, P.city, P.state, A.id
   FROM auction AS A INNER JOIN person AS P on A.seller = P.id
   WHERE A.category = 10 and (P.state = 'OR' OR P.state = 'ID' OR P.state = 'CA');
```

The execution plan looks like this:

```
                        QUERY PLAN
-----------------------------------------------------------
 BatchExchange { order: [], dist: Single }
   BatchProject { exprs: [$3, $4, $5, $0] }
     BatchHashJoin { type: Inner, predicate: $1 = $2 }
       BatchProject { exprs: [$0, $1] }
         BatchExchange { order: [], dist: HashShard([1]) }
           BatchFilter { predicate: ($2 = 10:Int32) }
             BatchScan { table: auction, columns: [id, seller, category] }
       BatchExchange { order: [], dist: HashShard([0]) }
         BatchFilter { predicate: ((($3 = 'OR':Varchar) OR ($3 = 'ID':Varchar)) OR ($3 = 'CA':Varchar)) }
           BatchScan { table: person, columns: [id, name, city, state] }
```
-->

The following statement shows the execution plan of a `CREATE MATERIALIZED VIEW` statement.

```sql
EXPLAIN CREATE MATERIALIZED VIEW nexmark_q3 AS
     SELECT P.name, P.city, P.state, A.id
     FROM auction AS A INNER JOIN person AS P on A.seller = P.id
     WHERE A.category = 10 and (P.state = 'OR' OR P.state = 'ID' OR P.state = 'CA');
                                                          
```

The execution plan of the statement above looks like this:

```
                      QUERY PLAN
-----------------------------------------------------------
 StreamMaterialize { columns: [name, city, state, id, _row_id(hidden), _row_id#1(hidden)], pk_columns: [_row_id, _row_id#1] }
   StreamExchange { dist: HashShard([4, 5]) }
     StreamProject { exprs: [$4, $5, $6, $0, $2, $7] }
       StreamHashJoin { type: Inner, predicate: $1 = $3 }
         StreamProject { exprs: [$0, $1, $3] }
           StreamExchange { dist: HashShard([1]) }
             StreamFilter { predicate: ($2 = 10:Int32) }
               StreamTableScan { table: auction, columns: [id, seller, category, _row_id], pk_indices: [3] }
         StreamExchange { dist: HashShard([0]) }
           StreamFilter { predicate: ((($3 = 'OR':Varchar) OR ($3 = 'ID':Varchar)) OR ($3 = 'CA':Varchar)) }
             StreamTableScan { table: person, columns: [id, name, city, state, _row_id], pk_indices: [4] }
```
