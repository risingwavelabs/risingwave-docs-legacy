---
id: udf-python-embedded
slug: /udf-python-embedded
title: Embedded Python UDFs
description: Define embedded Python UDFs.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/udf-python-embedded/" />
</head>

You can define embedded Python UDFs, which will be executed in an embedded Python interpreter within RisingWave. The Python code is directly included within the [`CREATE FUNCTION`](/sql/commands/sql-create-function.md) statement.

Currently, embedded Python UDFs only support pure computational logic and do not support accessing external networks or file systems. If you need to access external services or resources, you can use [Python UDFs as external functions](/sql/udf/udf-python.md).

## Define your functions

You can create Python UDFs using the `CREATE FUNCTION` command. Refer to the syntax below:

```sql
CREATE FUNCTION function_name (arg_name arg_type [, ...])
    [RETURNS return_type | RETURNS TABLE (column_name column_type [, ...])]
    LANGUAGE python
    AS [$$ function_body $$ | 'function_body'];
```

For example, the scalar function `gcd` can be defined as follows:

```sql title="Create function"
CREATE FUNCTION gcd(a int, b int) RETURNS int LANGUAGE python AS $$
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a
$$;
```

The Python code must contain a function that has the same name as declared in the `CREATE FUNCTION` statement. The function's parameters and return type must match those declared in the `CREATE FUNCTION` statement, otherwise, an error may occur when the function is called.

See the correspondence between SQL types and Python types in the [Data type mapping](udf-python-embedded.md#data-type-mapping).

:::note
Due to the nature of Python, the correctness of the source code cannot be verified when creating a function. It is recommended to make sure your implementation is correct through batch query before using UDFs in materialized views. If an error occurs when executing UDF in materialized views, you will see that the output results are all NULL.
:::

```sql title="Call function"
SELECT gcd(15, 25);

-----RESULT
   5
(1 row)
```

For table functions, your function needs to return an iterator using the `yield` statement. For example, to generate a sequence from 0 to n-1:

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

If your function returns structured types, the Python function should return an object or dictionary containing structured data. For example, to parse key-value pairs in a string, both of the following implementations work:

```sql title="Create function"
CREATE FUNCTION key_value(varchar) RETURNS STRUCT<key varchar, value varchar> LANGUAGE python AS $$
def key_value(s: str):
    key, value = s.split('=')
    return {'key': key, 'value': value}
$$;
```

```sql title="Create function"
CREATE FUNCTION key_value(varchar) RETURNS STRUCT<key varchar, value varchar> LANGUAGE python AS $$
class KeyValue:
    def __init__(self, key, value):
        self.key = key
        self.value = value

def key_value(s: str):
    key, value = s.split('=')
    return KeyValue(key, value)
$$;
```

## Limitations

Currently, embedded Python UDFs are only allowed to use the following standard libraries: `json`, `decimal`, `re`, `math`, `datetime`. Other third-party libraries are not supported. Embedded Python UDFs cannot access external resources, and the following built-in functions are also not allowed: `breakpoint`, `exit`, `eval`, `help`, `input`, `open`, `print`.

## Data type mapping

The following table shows the data type mapping between SQL and Python:

| SQL Type         | Python Type                    | Notes              |
| ---------------- | -----------------------------  | ------------------ |
| BOOLEAN          | bool                           |                    |
| SMALLINT         | int                            |                    |
| INT              | int                            |                    |
| BIGINT           | int                            |                    |
| REAL             | float                          |                    |
| DOUBLE PRECISION | float                          |                    |
| DECIMAL          | decimal.Decimal                |                    |
| DATE             | datetime.date                  | Not supported yet. |
| TIME             | datetime.time                  | Not supported yet. |
| TIMESTAMP        | datetime.datetime              | Not supported yet. |
| TIMESTAMPTZ      | datetime.datetime              | Not supported yet. |
| INTERVAL         | MonthDayNano / (int, int, int) | Not supported yet. |
| VARCHAR          | str                            |                    |
| BYTEA            | bytes                          |                    |
| JSONB            | bool, int, float, list, dict   |                    |
| T[]              | list[T]                        |                    |
| STRUCT&lt;&gt;         | class or dict                  |                    |
| ...others        |                                | Not supported yet. |
