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

- Ensure that you have [started and connected to RisingWave](get-started.md).

## 1. Install the RisingWave UDF API for Python

Run the following command to download and install the RisingWave UDF API package and its dependencies.

```shell
pip install risingwave
```

<details>
<summary>Cannot run this command?</summary>
If "command not found: pip" is returned, <a href="https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line">check if pip is available</a> in your environment and <a href="https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-pip-setuptools-and-wheel-are-up-to-date">ensure it is up to date</a>.
</details>

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
# Import components from the risingwave.udf module
from risingwave.udf import udf, udtf, UdfServer
import struct
import socket

# Define a scalar functio that returns a single value
@udf(input_types=['INT', 'INT'], result_type='INT')
def gcd(x, y):
    while y != 0:
        (x, y) = (y, x % y)
    return x

# Define a scalar function that returns multiple values (within a struct)
@udf(input_types=['BYTEA'], result_type='STRUCT<VARCHAR, VARCHAR, SMALLINT, SMALLINT>')
def extract_tcp_info(tcp_packet: bytes):
    src_addr, dst_addr = struct.unpack('!4s4s', tcp_packet[12:20])
    src_port, dst_port = struct.unpack('!HH', tcp_packet[20:24])
    src_addr = socket.inet_ntoa(src_addr)
    dst_addr = socket.inet_ntoa(dst_addr)
    return src_addr, dst_addr, src_port, dst_port

# Define a table function
@udtf(input_types='INT', result_types='INT')
def series(n):
    for i in range(n):
        yield i

# Start a UDF server
if __name__ == '__main__':
    server = UdfServer(location="0.0.0.0:8815") # You can use any available port in your system. Here we use port 8815.
    server.add_function(gcd)
    server.add_function(extract_tcp_info)
    server.add_function(series)
    server.serve()
```

<details>
<summary>See code explanation</summary>

The script first imports the `struct` and `socket` modules and three components from the `risingwave.udf` module - `udf`, `udtf`.

`udf` and `udtf` are decorators used to define scalar and table functions respectively.

The code defines two scalar functions and one table function:

- The scalar function `gcd`, decorated with `@udf`, takes two integer inputs and returns the greatest common divisor of the two integers.
- The scalar function `extract_tcp_info`, decorated with `@udf`, takes a single binary input and returns a structured output.

    The function takes a single argument `tcp_packet` of type bytes and uses the struct module to unpack the source and destination addresses and port numbers from `tcp_packet`, and then converts the binary IP addresses to strings using `socket.inet_ntoa`.

    The function returns a tuple containing the source IP address, destination IP address, source port number, and destination port number, all converted to their respective types. The return type is specified as a struct with four fields using the `result_type` argument.

- The table function `series`, decorated by `@udtf`, takes an integer input and yields a sequence of integers from 0 to n-1.

Finally, the script starts a UDF server using `UdfServer` and listens for incoming requests on port 8815 of the local machine. It then adds the `gcd`, `extract_tcp_info` and `series` functions to the server and starts the server using the `serve()` method. The `if __name__ == '__main__':` conditional is used to ensure that the server is only started if the script is run directly, rather than being imported as a module.

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

Here are the SQL statements for declaring the three UDFs defined in [step 2](#2-define-your-functions-in-a-python-file).

```sql
CREATE FUNCTION gcd(int, int) RETURNS int
LANGUAGE python AS gcd USING LINK 'http://localhost:8815'; -- If you are running RisingWave using Docker, replace the address with 'http://host.docker.internal:8815'.

CREATE FUNCTION extract_tcp_info(bytea)
RETURNS struct<src_ip varchar, dst_ip varchar, src_port smallint, dst_port smallint>
LANGUAGE python AS extract_tcp_info USING LINK 'http://localhost:8815'; -- If you are running RisingWave using Docker, replace the address with 'http://host.docker.internal:8815'.

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

SELECT extract_tcp_info(E'\\x45000034a8a8400040065b8ac0a8000ec0a80001035d20b6d971b900000000080020200493310000020405b4' :: bytea);
---
(192.168.0.14,192.168.0.1,861,8374)

SELECT * FROM series(10);
---
0
1
2
3
4
5
6
7
8
9
```