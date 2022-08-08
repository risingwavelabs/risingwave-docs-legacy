---
id: sql-function-value
slug: /sql-function-value
title: Value expressions
---

## Row constructor
A row constructor is an expression that builds a row value.

```sql
[ ROW ] ( expression [ , ... ] ) → ( value1, value2, ... )
```

#### Example
Let's first create a table and add some values to it.
```sql
CREATE TABLE t (v1 int, v2 int);
INSERT INTO t VALUES (1,12), (2,13), (3,30);
```

In the following statement, the row constructor returns all rows in table 't' in the form of row values '(,)'.
```sql
SELECT row (v1, v2) AS demo FROM t;
```
```
  demo  
--------
 (3,60)
 (2,26)
 (1,24)
(3 rows)
```