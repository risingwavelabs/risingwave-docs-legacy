---
id: deletes-and-updates
slug: /deletes-and-updates
title: Deletes and updates
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/deletes-and-updates/" />
</head>


Similar to traditional databases, RisingWave supports data updates and deletions within tables. Additionally, when data in a table is modified or deleted, any materialized views built on that table will be updated accordingly.

A few details worth noting:

* Data on a table can be updated or deleted, even if the table was created using the `CREATE TABLE ... WITH ...` statement. Of course, since RisingWave does not support transactions, users need to be extra careful with data accuracy;


* A source does not hold any data, so users cannot perform any update or deletion operations on a source.


* Data on a materialized view cannot be directly updated or deleted by users, which aligns with the design of traditional databases.

## Examples

Let's quickly verify how RisingWave handles deletion or modification operations from upstream in materialized views.

First, we create a table `t` and a materialized view `mv`:

```sql
CREATE TABLE t (v1 int, v2 int);
insert into t values (1,10), (2,20), (3,30);
CREATE MATERIALIZED VIEW mv as select sum(v1) as v1_sum, sum(v2) as v2_sum from t;
```

Let's check the result in the materialized view:
```sql
select * from mv;
```

We get the following result:
```sql
 v1_sum | v2_sum
--------+--------
      6 |     60
(1 row)
```

We then add two rows:
```sql
insert into t values (4,40), (5,50);
```

Then let's check the result in the materialized view again:
```sql
select * from mv;
```

We should get:
```sql
 v1_sum | v2_sum
--------+--------
     15 |    150
(1 row)
```

Delete three rows:
```sql
delete from t where v1 <= 3;
```

and then check the result in the materialized view:
```sql
select * from mv;
```

We should get:
```sql
dev=> select * from mv;
 v1_sum | v2_sum
--------+--------
      9 |     90
(1 row)
```