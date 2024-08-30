---
id: user-defined-functions
slug: /user-defined-functions
title: User-defined functions
description: Define your own functions with the help of the RisingWave UDF API for Python.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/user-defined-functions/" />
</head>

You can define your own functions (including table functions) and call these functions in RisingWave. With the user-defined function (UDF), you can tailor RisingWave to your needs and take advantage of the power and flexibility of Python to perform complex and customized data processing and analysis tasks.
Currently, RisingWave supports UDFs implemented as external functions in Python.

This article provides a step-by-step guide for installing the RisingWave UDF API, defining functions in a Python file, starting the UDF server, and declaring and using UDFs in RisingWave.

## Prerequisites

- Ensure that you have [Python](https://www.python.org/downloads/) (3.8 or later) installed on your computer.

- Ensure that you have [started and connected to RisingWave](get-started.md#run-risingwave).


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

# Define a scalar function that returns a single value
@udf(input_types=['INT', 'INT'], result_type='INT')
def gcd(x, y):
    while y != 0:
        (x, y) = (y, x % y)
    return x

# Define a scalar function that returns multiple values (within a struct)
@udf(input_types=['BINARY'], result_type='STRUCT<src_ip VARCHAR, dst_ip VARCHAR, src_port SMALLINT, dst_port SMALLINT>')
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


## 3. Start the UDF server

1. In a terminal window, navigate to the directory where `udf.py` is saved.

1. Run this command to execute `udf.py`.

    ```shell
    python3 udf.py
    ```

The UDF server will start running, allowing you to call the defined UDFs from RisingWave.

## 4. Declare your functions in RisingWave

In RisingWave, use the `CREATE FUNCTION` command to declare the functions defined in Python in RisingWave.

#### Syntax

<Tabs>
<TabItem value="diagram" label="Diagram">

import rr from '@theme/RailroadDiagram';

export const svg = rr.Diagram(
  rr.Stack(
    rr.Sequence(
      rr.Terminal('CREATE FUNCTION'),
      rr.NonTerminal('function_name', 'skip'),
      rr.Terminal('('),
      rr.OneOrMore(rr.NonTerminal('argument_type', 'skip'), ','),
      rr.Terminal(')')
    ),
    rr.Optional(
      rr.Choice(1,
        rr.Sequence(
          rr.Terminal('RETURNS'),
          rr.NonTerminal('return_type', 'skip')
        ),
        rr.Sequence(
          rr.Terminal('RETURNS TABLE'),
          rr.Terminal('('),
          rr.OneOrMore(rr.Sequence(rr.NonTerminal('column_name', 'skip'), rr.NonTerminal('column_type', 'skip')), ','),
          rr.Terminal(')')
        )
      )
    ),
    rr.Sequence(
      rr.Terminal('LANGUAGE python'),
      rr.Terminal('AS'),
      rr.NonTerminal('function_name_defined_in_server', 'skip')
    ),
    rr.Sequence(
      rr.Terminal('USING LINK'),
      rr.Terminal('\''),
      rr.NonTerminal('udf_server_address', 'skip'),
      rr.Terminal('\''),
      rr.Terminal(';')
    )
  )
);

<drawer SVG={svg} />

</TabItem>

<TabItem value="code" label="Code">

```sql
CREATE FUNCTION function_name ( argument_type [, ...] )
    [ RETURNS return_type | RETURNS TABLE ( column_name column_type [, ...] ) ]
    LANGUAGE python AS function_name_defined_in_server
    USING LINK 'udf_server_address';
```

</TabItem>

</Tabs>



| Parameter or clause | Description |
| --- | --- |
| *function_name* | The name of the UDF that you want to declare in RisingWave. |
| *argument_type* | The data type of the input parameter(s) that the UDF expects to receive.|
| **RETURNS** *return_type* | Use this if the function returns a single value (i.e., scalar). It specifies the data type of the return value from the UDF.<br />The struct type, which can contain multiple values, is supported. But the field names must be consistent between Python and SQL definitions, or it will be considered a type mismatch.<br/>The array and JSONB types are not supported in this version. |
| **RETURNS TABLE** | Use this if the function is a table-valued function (TVF). It specifies the structure of the table that the UDF returns. |
| **LANGUAGE** | Specifies the programming language used to implement the UDF. <br/> Currently, only `python` is supported.|
| **AS** *function_name_defined_in_server* | Specifies the function name defined in the UDF server.|
| **USING LINK** '*udf_server_address*' | Specifies the UDF server address. <br/>If you are running RisingWave in your local environment, the address is `http://localhost:<port>` <br/> If you are running RisingWave using Docker, the address is `http://host.docker.internal:<port>/`|

#### Example

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

After you have declared your UDFs in RisingWave, you can use them in SQL queries just like any built-in functions.

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