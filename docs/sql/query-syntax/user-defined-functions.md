---
id: user-defined-functions
slug: /user-defined-functions
title: User-defined functions
---

You can define your own functions (including table functions) in Python, and call these functions in RisingWave.

## Install the RisingWave UDF API for Python

```shell
pip install risingwave
```

## Define your functions in a Python file

Start a new Python file:

```python
# udf.py
from risingwave.udf import udf, udtf, UdfServer

# Define a scalar function
@udf(input_types=['INT', 'INT'], result_type='INT')
def gcd(x, y):
    while y != 0:
        (x, y) = (y, x % y)
    return x

# Define a table function
@udtf(input_types='INT', result_types='INT')
def series(n):
    for i in range(n):
        yield i

# Start a UDF server
if __name__ == '__main__':
    server = UdfServer(location="0.0.0.0:8815")
    server.add_function(gcd)
    server.add_function(series)
    server.serve()
```

## Start a UDF server
```shell
python3 udf.py
```

## Declare your functions in RisingWave

After a function is defined in the Python file, you need to declare it in RisingWave.


```sql
CREATE FUNCTION <function_name> ( <arg_data_type> [, ...] )
    [ RETURNS <return_type> | RETURNS TABLE ( <column_name> <column_type> [, ...] ) ]
    LANGUAGE python AS <function_name_defined_in_server>
    USING link '<udf_server_address>';
```
:::note

Currently, only `python` is supported as the value of `LANGUAGE`.

:::



## Use your functions in RisingWave