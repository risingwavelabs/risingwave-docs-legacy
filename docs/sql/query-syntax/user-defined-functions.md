---
id: user-defined-functions
slug: /user-defined-functions
title: User-defined functions
description: Define your own functions with the help of the RisingWave UDF API for Python.
---

You can define your own functions (including table functions) and call these functions in RisingWave. With the user-defined function (UDF), you can tailor RisingWave to your needs and take advantage of the power and flexibility of Python to create complex and customized functionality for your data processing and analysis tasks.
Currently, RisingWave supports UDFs implemented as external functions in Python.

This article provides a step-by-step guide for installing the RisingWave UDF API, defining functions in a Python file, starting the UDF server, and declaring and using UDFs in RisingWave.

## Prerequisites

- Ensure that you have [Python](https://www.python.org/downloads/) installed on your computer.

- Ensure that [RisingWave is up and running](get-started.md#run-risingwave) and you have connected to it.

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

To better demonstrate this step, we have prepared a sample script for you to try out. Please create a Python file with the name "udf.py" and insert the script below.

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
<details>
<summary>See code explanation</summary>

The script first imports three components from the `risingwave.udf` module - `udf`, `udtf`, and `UdfServer`.

`udf` and `udtf` are decorators used to define scalar and table functions respectively. `@udf` is used to define a scalar function named `gcd` that takes two integer inputs and returns the greatest common divisor of the two integers. `@udtf` is used to define a table function named `series` that takes an integer input and yields a sequence of integers from 0 to n-1.

Finally, the script starts a UDF server using `UdfServer` and listens for incoming requests on port 8815 of the local machine. It then adds the `gcd` and `series` functions to the server and starts the server using the `serve()` method. The `if __name__ == '__main__':` conditional is used to ensure that the server is only started if the script is run directly, rather than being imported as a module.

</details>


## 3. Start a UDF server

1. In a terminal window, navigate to the directory where `udf.py` is saved.

1. Run this command to execute `udf.py`.

    ```shell
    python3 udf.py
    ```

The UDF server will start running, allowing you to call the defined UDFs from RisingWave.


## 4. Declare your functions in RisingWave

Use the `CREATE FUNCTION` command to declare the functions defined in Python in RisingWave.

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
| **RETURNS** *return_type* | Specifies the data type of the return value from the UDF. |
| **RETURNS TABLE** | Specifies the structure of the table that the UDF returns. |
| **LANGUAGE** | Specifies the programming language used to implement the UDF. <br/> Currently, only `python` is supported.|
| **AS** *function_name_defined_in_server* | Specifies the function name defined in the UDF server.|
| **USING LINK** '*udf_server_address*' | Specifies the server address where the UDF implementation resides. |

#### Example

Here's an example of how to declare the two UDFs defined in [step 2](#2-define-your-functions-in-a-python-file), `gcd` and `series`.

```sql
CREATE FUNCTION gcd(int, int) RETURNS int
LANGUAGE python AS gcd USING LINK 'http://localhost:8815';

CREATE FUNCTION series(int) RETURNS TABLE (x int)
LANGUAGE python AS series USING LINK 'http://localhost:8815';
```

## 5. Use your functions in RisingWave

After you have declared your UFDs in RisingWave, you can use them in SQL queries just like any built-in functions.

#### Example

```sql
SELECT gcd(25, 15);

SELECT * FROM series(10);
```