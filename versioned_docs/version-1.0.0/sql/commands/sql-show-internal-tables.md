---
id: sql-show-internal-tables
title: SHOW INTERNAL TABLES
description: Show internal tables to learn about the existing internal states.
slug: /sql-show-internal-tables
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-internal-tables/" />
</head>

Use the `SHOW INTERNAL TABLES` command to view the existing internal tables in RisingWave. Internal tables are tables that store intermediate results (also known as internal states) of queries.

## Syntax

```sql
SHOW INTERNAL TABLES [FROM schema_name];
```



## Parameters
|Parameter   | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema in which tables will be listed. If not given, tables from the default schema, `public`, will be listed.|


## Example
```sql
SHOW INTERNAL TABLES;
                   Name
------------------------------------------
 __internal_v_20_hashjoinright_1019
 __internal_v_20_hashjoindegreeleft_1018
 __internal_v_18_grouptopnnode_1011
 __internal_v_20_hashjoindegreeright_1020
 __internal_v_17_topnnode_1010
 __internal_v_19_hashjoindegreeleft_1014
 __internal_v_20_hashjoinleft_1017
 __internal_v_18_hashaggresult_1012
 __internal_v_19_hashjoinright_1015
 __internal_v_19_hashjoindegreeright_1016
 __internal_v_19_hashjoinleft_1013
(11 rows)
```

You can view the data in an internal table:
```sql
SELECT * FROM __internal_v_19_hashjoinleft_1013 LIMIT 5;

 orders.o_orderkey | orders.o_orderdate | orders.o_shippriority | customer.c_custkey | orders.o_custkey
-------------------+--------------------+-----------------------+--------------------+------------------
                69 | 1994-06-04         |                     0 |                 85 |               85
               256 | 1993-10-19         |                     0 |                125 |              125
              1154 | 1992-02-15         |                     0 |                 37 |               37
              1792 | 1993-11-09         |                     0 |                 49 |               49
              1894 | 1992-03-30         |                     0 |                 76 |               76
(5 rows)
```