---
id: sql-declare
title: DECLARE
description: Create a cursor for the subscription queue.
slug: /sql-declare
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-declare/" />
</head>

Currently, you can use the `DECLARE` command to create a cursor for the subscription queue. A cursor is a mechanism that allows reading query results in smaller batches instead of executing the entire query at once. By encapsulating the query, a cursor enables fetching a few rows at a time. This approach is particularly useful when dealing with large result sets to avoid memory overflow.

## Syntax

```sql
DECLARE cursor_name [SUBSCRIPTION] CURSOR FOR { subscription_name | query };
```

## Parameters

|Parameter                      | Description           |
|-------------------------------|-----------------------|
|*cursor_name*              |The name of the cursor to be created.|
|*subscription_name*        |The name of the subscription you want to creat a cursor for.|
|*query*                       |A `SELECT` or `VALUES` command used to specify the rows that will be returned by the cursor.|

## Examples

```sql 
create table t1(v1 int, v2 int, v3 int);
insert into t1 values(1,1,1);
create subscription sub from t1 with (retention = '1D');
```
Then we can create a cursor `cur`.

```sql
declare cur subscription cursor for sub;
```
After the creation, we can use the `FETCH` command to retrieve the row from the cursor `cur`.

```sql
fetch next from cur;
   
----RESULT
v1 | v2 | v3 | op | rw_timestamp 
----+----+----+----+--------------
  1 |  1 |  1 |  1 |             
(1 row)

update t1 set v3 = 10 where v1 = 1;

fetch next from cur => 

 t1.v1 | t1.v2 | t1.v3 | t1.op | rw_timestamp  
-------+-------+-------+-------+---------------
     1 |     1 |     1 |     4 | 1715669376304
(1 row)

fetch next from cur => 
 t1.v1 | t1.v2 | t1.v3 | t1.op | rw_timestamp  
-------+-------+-------+-------+---------------
     1 |     1 |    10 |     3 | 1715669376304
(1 row)

```
op = 1 insert
op = 2 delete
op = 3 update_insert
op = 4 update_insert

about since :
since now()/proctime(). crate cursor since now;
without since. create cursor with snapshot
since begin(). create cursor since logstore's begin
since unix_ms. create cursor since unix_ms. now - subscription's retention <= unix_ms <= now