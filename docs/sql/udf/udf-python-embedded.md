---
id: udf-python-embedded
slug: /udf-python-embedded
title: Embedded Python UDFs
description: Define embedded Python UDFs.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/udf-python-embedded/" />
</head>

You can define embedded Python UDFs, which will be run in an embedded Python interpreter in RisingWave. The Python code is inlined in the [`CREATE FUNCTION`](/sql/commands/sql-create-function.md) statement.

Here are some examples:

- Scalar function example

```sql title="Create function"
CREATE FUNCTION gcd(a int, b int) RETURNS int LANGUAGE python AS $$
def gcd(a, b):
    WHILE b != 0:
        a, b = b, a % b
    RETURN a
$$;
```

```sql sql title="Call function"
SELECT gcd(15, 25);

-----RESULT
   5
(1 row)
```

- Table function example

```sql title="Create function"
CREATE FUNCTION series(n int) RETURNS TABLE (x int) LANGUAGE python AS $$
def series(n):
    for i in range(n):
        yield i
$$;
```

```sql title="Call function"
SELECT * FROM series(5);

-----RESULT
 0
 1
 2
 3
 4
(5 rows)
```

:::note
We use [pyo3](https://pyo3.rs/) to embed a Python library into RisingWave. The minimum supported Python version is 3.12. Because we require [sub-interpreters and per-interpreter GIL](https://realpython.com/python312-subinterpreters/) to run different UDFs in parallel.

For safety reasons, functions are limited to pure computational logic. We only allow importing packages in a whitelist and have removed some builtin functions such as `exit` and `open`. The goal is to create a sandbox for untrusted code. 
:::

