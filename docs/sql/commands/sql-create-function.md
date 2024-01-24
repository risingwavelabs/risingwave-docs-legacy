---
id: sql-create-function
title: CREATE FUNCTION
description: Create a user-defined function.
slug: /sql-create-function
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-function/" />
</head>

The `CREATE FUNCTION` command can be used to create [user-defined functions](/sql/udf/user-defined-functions.md) (UDFs). There are two ways to create UDFs in RisingWave: UDFs as external functions and SQL UDFs. `CREATE FUNCTION` can be used for both ways with different syntax.

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
| **RETURNS** *return_type* | Use this if the function returns a single value (i.e., scalar). It specifies the data type of the return value from the UDF.<br />The struct type, which can contain multiple values, is supported. But the field names must be consistent between Python and SQL definitions, or it will be considered a type mismatch.|
| **RETURNS TABLE** | Use this if the function is a table-valued function (TVF). It specifies the structure of the table that the UDF returns. |
| **LANGUAGE** | Optional. Specifies the programming language used to implement the UDF. <br/> Currently, `python` and `java` are supported.|
| **AS** *function_name_defined_in_server* | Specifies the function name defined in the UDF server.|
| **USING LINK** '*udf_server_address*' | Specifies the UDF server address. <br/>If you are running RisingWave in your local environment, the address is `http://localhost:<port>` <br/> If you are running RisingWave using Docker, the address is `http://host.docker.internal:<port>/`|

### Examples

Here is an example of using `CREATE FUNCTION` to declare a UDF defined by Python. For more details about how to define a UDF in Python, see [Use UDFs in Python](/sql/udf/udf-python.md).

```sql
CREATE FUNCTION gcd(int, int) RETURNS int
LANGUAGE python AS gcd USING LINK 'http://localhost:8815'; -- If you are running RisingWave using Docker, replace the address with 'http://host.docker.internal:8815'.
```

Here is an example of using `CREATE FUNCTION` to declare a UDF defined by Java. For more details about how to define a UDF in Java, see [Use UDFs in Java](/sql/udf/udf-java.md).

```sql
CREATE FUNCTION gcd(int, int) RETURNS int  
AS gcd  
USING LINK 'http://localhost:8815';
```

## SQL UDFs

You can also define SQL UDFs in RisingWave by using the `CREATE FUNCTION` command.

### Syntax

```sql
CREATE FUNCTION function_name ( argument_type [, ...] )
    RETURNS return_type
    LANGUAGE sql
    { AS as_definition | RETURN return_definition }; 
```

For more details about the supported syntax, see the [examples of SQL UDFs](#examples-1) below.

### Parameters

| Parameter or clause | Description |
| --- | --- |
| *function_name* | The name of the SQL UDF that you want to declare in RisingWave. |
| *argument_type* | The data type of the input parameter(s) that the SQL UDF expects to receive.|
| **RETURNS** *return_type* | Specifies the data type of the return value from the UDF.|
| **LANGUAGE** *sql* | Its value must be `sql`.|
| **AS** *as_definition* | Defines the implementation of the function using SQL statements. `as_definition` can be single quote definition (e.g., `'select $1 + $2'`) or double dollar definition (e.g., `$$select $1 + $1$$`).|
| **RETURN** *return_definition*| Alternative to the `AS` clause. `return_definition` can be an expression (e.g., `$1 + $2`). Note that **you must specify an `AS` definition or a `RETURN` definition, and they can not be specified simultaneously.**|

:::note


+ The currently supported syntax is for anonymous SQL UDFs. So `create function with_param_names(a INT, b INT) returns int language sql as 'select a + b';` is invalid at present in RisingWave.

+ Recursive definition is NOT supported at present. For example, the statement `create function recursive(INT, INT) returns int language sql as 'select recursive($1, $2) + recursive($1, $2)';` will fail.

:::

### Examples

Here are the examples of current supported syntax:

- `AS` clause with single quote definition

```sql title="Create function"
create function sub(INT, INT) returns int language sql as 'select $1 - $2';
```

```sql title="Call function"
select sub(1, 1);
----RESULT
0
```

- `AS` clause with dollar definition

```sql title="Create function"
create function add(INT, INT) returns int language sql as $$select $1 + $2$$;
```

```sql title="Call function"
select add(1, -1);
----RESULT
0
```

- SQL UDF with `RETURN` expression

```sql title="Create function"
create function add(INT, INT) returns int language sql return $1 + $2;
```

```sql title="Call function"
select add_return(1, 1);
----RESULT
2
```

- SQL UDF with multiple types interleaving

```sql title="Create function"
-- Multiple type interleaving
create function add_sub(INT, FLOAT, INT) returns float language sql as $$select -$1 + $2 - $3$$;

-- Multiple type interleaving with return expression
create function add_sub_return(INT, FLOAT, INT) returns float language sql return -$1 + $2 - $3;

-- Complex types interleaving
create function add_sub_types(INT, BIGINT, FLOAT, DECIMAL, REAL) returns real language sql as 'select $1 + $2 - $3 + $4 + $5';
```

```sql title="Call function"
select add_sub(1, 5.1415926, 1);
----RESULT
3.1415926

select add_sub_return(1, 5.1415926, 1);
----RESULT
3.1415926

select add_sub_types(1, 1919810114514, 3.1415926, 1.123123, 101010.191919);
----RESULT
1919810215523.1734494
```

- SQL UDF calling other pre-defined SQL UDFs

```sql  title="Create function"
-- Create two pre-defined SQL UDFs
create function add(INT, INT) returns int language sql as $$select $1 + $2$$;

create function sub(INT, INT) returns int language sql as 'select $1 - $2';

-- Create a SQL UDF calling these two pre-defined SQL UDFs
create function add_sub_binding() returns int language sql as 'select add(1, 1) + sub(2, 2)';

-- Create another SQL UDF calling these two pre-defined SQL UDFs
create function add_sub_wrapper(INT, INT) returns int language sql as 'select add($1, $2) + sub($1, $2) + 114512';
```

```sql title="Call function"
select add_sub_binding();
----RESULT
2

select add_sub_wrapper(1, 1);
----RESULT
114514
```

- SQL UDF calling other built-in functions

```sql  title="Create function"
create function call_regexp_replace() returns varchar language sql as $$select regexp_replace('cat is the cutest animal', 'cat', 'dog')$$;
```

```sql title="Call function"
select call_regexp_replace();
----RESULT
dog is the cutest animal
```

:::note
The double dollar signs should be used otherwise the parsing will fail here.
:::

## See also

[SHOW FUNCTIONS](/sql/commands/sql-show-functions.md) — Show all user-defined functions.

[DROP FUNCTION](/sql/commands/sql-drop-function.md) — Drop a user-defined function.
