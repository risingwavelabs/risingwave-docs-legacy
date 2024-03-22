---
id: query-syntax-with-ordinality-clause
slug: /query-syntax-with-ordinality-clause
title: WITH ORDINALITY clause
---

The `WITH ORDINALITY` clause can be used with set functions in the `FROM` clause of a query. An additional integer column will be added to the table, which numbers the rows returned by the function, starting from 1. By default, the generated column is named `ordinality`. 

See [Set functions](/sql/functions-operators/sql-function-set-functions.md) for a list of supported set functions.

Here is a simple example of how the `WITH ORDINALITY` clause works. 

```sql
SELECT * FROM unnest(array[0,1,2]) WITH ORDINALITY;
```

The output will be as follows.

```bash
 unnest | ordinality 
--------+------------
      0 |          1
      1 |          2
      2 |          3
```

If we have a table `t` like so:

```bash
   arr   
---------
 {a,b,c}
 {d,e}
```

We can use the `unnest` function on the column `arr`, call `WITH ORDINALITY`, and rename the newly generated columns.

```sql
SELECT * FROM t CROSS JOIN unnest(t.arr) WITH ORDINALITY AS x(elts, num);
```

The results will be as follows. 

```bash
   arr   | elts | num 
---------+------+-----
 {a,b,c} | c    |   3
 {a,b,c} | b    |   2
 {a,b,c} | a    |   1
 {d,e}   | e    |   2
 {d,e}   | d    |   1
```