---
id: udf-python
slug: /udf-python
title: Use UDFs in Python
description: Define your own functions with the help of the RisingWave UDF API for Python.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/udf-python/" />
</head>

This article provides a step-by-step guide for installing the RisingWave UDF API, defining functions in a Python file, starting the UDF server, and declaring and using UDFs in RisingWave.

## Prerequisites

- Ensure that you have [Python](https://www.python.org/downloads/) (3.8 or later) installed on your computer.

- Ensure that you have [started and connected to RisingWave](get-started.md#run-risingwave).

## 1. Install the RisingWave UDF API for Python

Run the following command to download and install the RisingWave UDF API package and its dependencies.

```shell
pip install arrow-udf
```

<details>
<summary>Cannot run this command?</summary>
If "command not found: pip" is returned, <a href="https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line">check if pip is available</a> in your environment and <a href="https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-pip-setuptools-and-wheel-are-up-to-date">ensure it is up to date</a>.
</details>

:::note
The current Python UDF SDK is supported since version 1.10 and is not supported in older versions.
If you are using an older version of RisingWave, please refer to the historical version of the documentation.
If you have used an older version of the RisingWave UDF SDK (risingwave 0.1), we strongly encourage you to update to the latest version.
You can refer to the [migration guide](#migration-guide-from-risingwave-01-to-arrow-udf-02) for upgrading.
Older versions are still supported but will not receive new features or bug fixes.
:::

## 2. Define your functions in a Python file

To better demonstrate this step, we have prepared a sample script for you to try out. Please create a Python file with the name `udf.py` and insert the script below.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details>
<summary>How?</summary>
Here are a few methods for creating a Python file.
<Tabs>
<TabItem value="code" label="Code editor">
Here we take VS Code as an example.

1. Open VS Code and create a new file by selecting **File** from the top menu and clicking on **New File**.

1. Type `udf.py` as the name and extension of the file.

1. Copy and paste the script below into the newly created file.

1. Save the edits.

</TabItem>

<TabItem value="terminal" label="Terminal">
Here we take the Vim text editor as an example.

1. Open a terminal window.

1. Run `vim udf.py` to create the file and open it in Vim.

1. Press `I` to enter insert mode in Vim.

1. Copy and paste the script below into the editor.

1. Press `Esc` to exit insert mode.

1. Enter `:wq` to save the file and exit Vim.

</TabItem>
</Tabs>
</details>

```python title="udf.py"
# Import components from the arrow-udf module
from arrow_udf import udf, udtf, UdfServer

# Define a scalar function that returns a single value
@udf(input_types=['INT', 'INT'], result_type='INT')
def gcd(x, y):
    while y != 0:
        (x, y) = (y, x % y)
    return x

# Define a scalar function to perform some blocking operation, setting the `io_threads` parameter to run multiple function calls concurrently on a thread pool
@udf(input_types=["INT"], result_type="INT", io_threads=32)
def blocking(x):
    time.sleep(0.01) 
    return x

# Define a scalar function that returns multiple values within a struct
@udf(input_types=['VARCHAR'], result_type='STRUCT<key: VARCHAR, value: VARCHAR>')
def key_value(pair: str):
    key, value = pair.split('=')
    return {'key': key, 'value': value}

# Define a table function over a Python generator function
@udtf(input_types='INT', result_types='INT')
def series(n):
    for i in range(n):
        yield i

# Start a UDF server
if __name__ == '__main__':
    server = UdfServer(location="0.0.0.0:8815") # You can use any available port in your system. Here we use port 8815.
    server.add_function(gcd)
    server.add_function(key_value)
    server.add_function(series)
    server.serve()
```

<details>
<summary>See code explanation</summary>

The script first imports the `struct` and `socket` modules and three components from the `risingwave.udf` module - `udf`, `udtf`.

`udf` and `udtf` are decorators used to define scalar and table functions respectively.

The code defines three scalar functions and one table function:

- The scalar function `gcd`, decorated with `@udf`, takes two integer inputs and returns the greatest common divisor of the two integers. 
- The scalar function `blocking`, decorated with `@udf`. The `io_threads` parameter specifies the number of threads that the Python UDF will use during execution to enhance processing performance of IO-intensive functions. Please note that multithreading can not speed up compute-intensive functions due to the GIL.
- The scalar function `key_value`, decorated with `@udf`, takes a single string input and returns a structured output.
- The table function `series`, decorated by `@udtf`, takes an integer input and yields a sequence of integers from 0 to `n-1`.

Finally, the script starts a UDF server using `UdfServer` and listens for incoming requests on port 8815 of the local machine. It then adds the `gcd`, `key_value` and `series` functions to the server and starts the server using the `serve()` method. The `if __name__ == '__main__':` conditional is used to ensure that the server is only started if the script is run directly, rather than being imported as a module.

</details>

:::info
New sample functions are frequently added to `udf.py`, such as JSONB functions. See the [source file](https://github.com/risingwavelabs/risingwave/blob/main/e2e_test/udf/test.py).

Some of the sample functions are still being tested and may not be fully functional or optimized.
:::

## 3. Start the UDF server

1. In a terminal window, navigate to the directory where `udf.py` is saved.

1. Run this command to execute `udf.py`.

    ```shell
    python3 udf.py
    ```

The UDF server will start running, allowing you to call the defined UDFs from RisingWave.

## 4. Declare your functions in RisingWave

In RisingWave, use the [`CREATE FUNCTION`](/sql/commands/sql-create-function.md) command to declare the functions you defined.

Here are the SQL statements for declaring the four UDFs defined in [step 2](#2-define-your-functions-in-a-python-file).

```sql
CREATE FUNCTION gcd(int, int) RETURNS int
LANGUAGE python AS gcd USING LINK 'http://localhost:8815'; -- If you are running RisingWave using Docker, replace the address with 'http://host.docker.internal:8815'.

CREATE FUNCTION blocking(int) RETURNS int
LANGUAGE python AS blocking USING LINK 'http://localhost:8815'; -- If you are running RisingWave using Docker, replace the address with 'http://host.docker.internal:8815'.

CREATE FUNCTION key_value(bytea) RETURNS struct<key varchar, value varchar> -- the field names must exactly match the ones in Python decorator
LANGUAGE python AS key_value USING LINK 'http://localhost:8815'; -- If you are running RisingWave using Docker, replace the address with 'http://host.docker.internal:8815'.

CREATE FUNCTION series(int) RETURNS TABLE (x int)
LANGUAGE python AS series USING LINK 'http://localhost:8815'; -- If you are running RisingWave using Docker, replace the address with 'http://host.docker.internal:8815'.
```

## 5. Use your functions in RisingWave

Once the UDFs are created in RisingWave, you can use them in SQL queries just like any built-in functions.

#### Example

```sql
SELECT gcd(25, 15);
---
5

SELECT blocking(2);
---
2

SELECT key_value('a=b');
---
(a,b)

SELECT * FROM series(5);
---
0
1
2
3
4
```

## 6. Scale the UDF Server

Due to the limitations of the Python interpreter's [Global Interpreter Lock (GIL)](https://realpython.com/python-gil/), the UDF server can only utilize a single CPU core when processing requests. If you find that the throughput of the UDF server is insufficient, consider scaling out the UDF server.

:::info
How to determine if the UDF server needs scaling?

You can use tools like `top` to monitor the CPU usage of the UDF server. If the CPU usage is close to 100%, it indicates that the CPU resources of the UDF server are insufficient, and scaling is necessary.
:::

To scale the UDF server, you can launch multiple UDF servers on different ports and use a load balancer to distribute requests among these servers.

The specific code is as follows:

```python title="udf.py"
from multiprocessing import Pool

def start_server(port: int):
    """Start a UDF server listening on the specified port."""
    server = UdfServer(location=f"localhost:{port}")
    # add functions ...
    server.serve()

if __name__ == "__main__":
    """Start multiple servers listening on different ports."""
    n = 4
    with Pool(n) as p:
        p.map(start_server, range(8816, 8816 + n))
```

Then, you can start a load balancer, such as Nginx. It listens on port 8815 and forwards requests to UDF servers on ports 8816-8819.

## Data Types

The RisingWave Python UDF SDK supports the following data types:

| SQL Type         | Python Type                    | Notes              |
| ---------------- | -----------------------------  | ------------------ |
| BOOLEAN          | bool                           |                    |
| SMALLINT         | int                            |                    |
| INT              | int                            |                    |
| BIGINT           | int                            |                    |
| REAL             | float                          |                    |
| DOUBLE PRECISION | float                          |                    |
| DECIMAL          | decimal.Decimal                |                    |
| DATE             | datetime.date                  |                    |
| TIME             | datetime.time                  |                    |
| TIMESTAMP        | datetime.datetime              |                    |
| INTERVAL         | MonthDayNano / (int, int, int) | Fields can be obtained by `months()`, `days()` and `nanoseconds()` from `MonthDayNano` |
| VARCHAR          | str                            |                    |
| BYTEA            | bytes                          |                    |
| JSONB            | any                            | Parsed / Serialized by `json.loads` / `json.dumps` |
| T[]              | list[T]                        |                    |
| STRUCT&lt;&gt;   | dict                           |                    |
| ...others        |                                | Not supported yet. |

## Migration Guide from risingwave 0.1 to arrow-udf 0.2

If you have used the Python UDF SDK in RisingWave 1.9 or earlier versions, please refer to the following steps for upgrading.

Import the `arrow_udf` package instead of `risingwave.udf`.

```shell
pip install arrow-udf
```

```diff
- from risingwave.udf import udf, udtf, UdfServer
+ from arrow_udf import udf, udtf, UdfServer
```

The type aliases `FLOAT4` and `FLOAT8` are removed and replaced by `REAL` and `DOUBLE PRECISION`.

```diff
- @udf(input_types=['FLOAT4', 'FLOAT8'], result_type='INT')
+ @udf(input_types=['REAL', 'DOUBLE PRECISION'], result_type='INT')
```

The `STRUCT` type now requires field names. The field names must exactly match the ones defined in `CREATE FUNCTION`.
The function that returns a struct type now returns a dict instead of a tuple. The field names of the dictionary must match the definition in the signature.

```diff
- @udf(input_types=['VARCHAR'], result_type='STRUCT<VARCHAR, VARCHAR>')
+ @udf(input_types=['VARCHAR'], result_type='STRUCT<key: VARCHAR, value: VARCHAR>')
  def key_value(pair: str):
      key, value = pair.split('=')
-     return (key, value)
+     return {'key': key, 'value': value}
```
