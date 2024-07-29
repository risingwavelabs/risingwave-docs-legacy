---
id: sql-create-function
title: CREATE FUNCTION
description: Create a user-defined function.
slug: /sql-create-function
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-function/" />
</head>

The `CREATE FUNCTION` command can be used to create [user-defined functions](/sql/udf/user-defined-functions.md) (UDFs). There are three ways to create UDFs in RisingWave: UDFs as external functions, embedded UDFs and SQL UDFs. `CREATE FUNCTION` can be used for them with different syntax.

## UDFs as external functions

You can define your own functions (including table functions) by some programming languages, like Python and Java, and call these functions in RisingWave. 

The `CREATE FUNCTION` command is used to declare these UDFs. After that, you can use them in SQL queries like any built-in functions.

### Syntax

```sql
CREATE FUNCTION function_name ( argument_type [, ...] )
    [ RETURNS return_type | RETURNS TABLE ( column_name column_type [, ...] ) ]
    [ LANGUAGE language_name ]
    AS function_name_defined_in_server
    USING LINK 'udf_server_address';
```

### Parameters

| Parameter or clause | Description |
| --- | --- |
| *function_name* | The name of the UDF that you want to declare in RisingWave. |
| *argument_type* | The data type of the input parameter(s) that the UDF expects to receive.|
| **RETURNS** *return_type* | Use this if the function returns a single value (i.e., scalar). It specifies the data type of the return value from the UDF.<br />The struct type, which can contain multiple values, is supported. But the field names must be consistent between the programming language and SQL definitions, or it will be considered a type mismatch.|
| **RETURNS TABLE** | Use this if the function is a table-valued function (TVF). It specifies the structure of the table that the UDF returns. |
| **LANGUAGE** | Optional. Specifies the programming language used to implement the UDF. <br/> Currently, `Python`, `Java`,`Rust`, and `JavaScript` are supported.|
| **AS** *function_name_defined_in_server* | Specifies the function name defined in the UDF server.|
| **USING LINK** '*udf_server_address*' | Specifies the UDF server address. <br/>If you are running RisingWave in your local environment, the address is `http://localhost:<port>` <br/> If you are running RisingWave using Docker, the address is `http://host.docker.internal:<port>/`|

### Examples

Use `CREATE FUNCTION` to declare a UDF defined by Python. For more details, see [Use UDFs in Python](/sql/udf/udf-python.md).

```sql
CREATE FUNCTION gcd(int, int) RETURNS int
LANGUAGE python AS gcd USING LINK 'http://localhost:8815'; -- If you are running RisingWave using Docker, replace the address with 'http://host.docker.internal:8815'.
```

Use `CREATE FUNCTION` to declare a UDF defined by Java. For more details, see [Use UDFs in Java](/sql/udf/udf-java.md).

```sql
CREATE FUNCTION gcd(int, int) RETURNS int  
AS gcd  
USING LINK 'http://localhost:8815';
```

## Embedded UDFs

Embedded UDFs are functions that run in the language runtime embedded in RisingWave computation nodes. The `CREATE FUNCTION` command is used to create these UDFs.

Here are some examples of embedded UDFs, along with links to specific guides on creating them with different languages.


```sql title="Embedded UDFs"
# Embedded Python UDF
create function gcd(a int, b int) returns int language python as $$
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a
$$;
```

For more details, see [Embedded Python UDFs](/sql/udf/udf-python-embedded.md).

```sql title="Embedded UDFs"
# Embedded JavaScript UDF
create function gcd(a int, b int) returns int language javascript as $$
    while (b != 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
$$;
```

For more details, see [Use UDFs in JavaScript](/sql/udf/udf-javascript.md).

```sql title="Embedded UDFs"
# Embedded Rust UDF
create function gcd(int, int) returns int language rust as $$
    fn gcd(mut a: i32, mut b: i32) -> i32 {
        while b != 0 {
            let t = b;
            b = a % b;
            a = t;
        }
        a
    }
$$;
```

For more details, see [Use UDFs in Rust](/sql/udf/udf-rust.md).

## SQL UDFs

SQL UDFs in RisingWave are designed to expand directly into expressions at the frontend, resulting in minimal performance difference compared to manually calling multiple functions. 

The `CREATE FUNCTION` command is used to define SQL UDFs. You can read our guide on [SQL UDFs](/sql/udf/sql-udfs.md) for more details.

```sql title="Syntax of SQL UDFs"
CREATE FUNCTION function_name ( argument_type [, ...] )
    RETURNS return_type
    LANGUAGE sql
    { AS as_definition | RETURN return_definition }; 
```

## See also

[SHOW FUNCTIONS](/sql/commands/sql-show-functions.md) — Show all user-defined functions.

[DROP FUNCTION](/sql/commands/sql-drop-function.md) — Drop a user-defined function.
