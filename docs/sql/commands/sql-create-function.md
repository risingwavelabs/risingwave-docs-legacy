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

Use `CREATE FUNCTION` to declare a UDF defined by Rust. For more details, see [Use UDFs in Rust](/sql/udf/udf-rust.md).

```sql
CREATE FUNCTION gcd(int, int) RETURNS int
LANGUAGE wasm USING BASE64 'encoded-wasm-binary';
```

Use `CREATE FUNCTION` to declare a UDF defined by JavaScript. For more details, see [Use UDFs in JavaScript](/sql/udf/udf-javascript.md).

```sql
CREATE FUNCTION gcd(a int, b int) RETURNS int LANGUAGE javascript AS $$
    while (b != 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
$$;
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

+ Recursive definition is NOT supported at present. For example, the statement `create function recursive(INT, INT) returns int language sql as 'select recursive($1, $2) + recursive($1, $2)';` will fail.

:::

### Examples

At present, we support SQL UDFs with unnamed and named parameters. This section offers examples of the current supported syntax. We will offer some basic examples first to help you understand and grasp them. Then, we will offer more examples that are closer to real-world scenarios, such as a mock table, for your further practice and understanding.

#### Basic examples

- Create a SQL UDF with unnamed parameters and double dollar definition.

```sql title="Create function"
create function add(INT, INT) returns int language sql as $$select $1 + $2$$;
```

```sql title="Call function"
select add(1, -1);
----
0
```

- Create a SQL UDF with unnamed parameters and single quote definition.

```sql title="Create function"
create function sub(INT, INT) returns int language sql as 'select $1 - $2';
```

```sql title="Call function"
select sub(1, 1);
----
0
```

- Create a SQL UDF with unnamed parameters that calls other pre-defined SQL UDFs.

```sql title="Create function"
# Create two pre-defined SQL UDFs (skip if you've created them in the examples above)
create function add(INT, INT) returns int language sql as 'select $1 + $2';
create function sub(INT, INT) returns int language sql as 'select $1 - $2';

create function add_sub_binding() returns int language sql as 'select add(1, 1) + sub(2, 2)';
```

```sql title="Call function"
select add_sub_binding();
----
2

select add(1, -1), sub(1, 1), add_sub_binding();
----
0 0 2
```

- Create a SQL UDF with named parameters and single quote definition.

```sql title="Create function"
create function add_named(a INT, b INT) returns int language sql as 'select a + b';
```

```sql title="Call function"
select add_named(1, -1);
----
0
```
- Create a SQL UDF with named parameters and double dollar definition.

```sql title="Create function"
create function sub_named(a INT, b INT) returns int language sql as $$select a - b$$;
```

```sql title="Call function"
select sub_named(1, 1);
----
0
```

- Create a SQL UDF with mixed named and unnamed parameters.

```sql title="Create function"
create function add_sub_mix(INT, a INT, INT) returns int language sql as 'select $1 - a + $3';
```

```sql title="Call function"
select add_sub_mix(1, 2, 3);
----
2
```

- Call a SQL UDF with unnamed parameters inside a SQL UDF with named parameters.

```sql title="Create function"
create function add(INT, INT) returns int language sql as $$select $1 + $2$$;
create function add_named_wrapper(a INT, b INT) returns int language sql as 'select add(a, b)';
```

```sql title="Call function"
select add_named_wrapper(1, -1);
----
0
```

- Create a SQL UDF with unnamed parameters and a return expression.

```sql title="Create function"
create function add_return(INT, INT) returns int language sql return $1 + $2;
```

```sql title="Call function"
select add_return(1, 1);
----
2
```

- Create another SQL UDF with a return expression using previously defined UDFs.

```sql title="Create function"
# Create a pre-defined UDF
create function add_return1(INT, INT) returns int language sql return $1 + $2;

create function add_return_binding() returns int language sql return add_return1(1, 1) + add_return1(1, 1);
```

```sql title="Call function"
select add_return_binding();
----
4
```

- Create a SQL UDF with a single quote definition.

```sql title="Create function"
create function print(INT) returns int language sql as 'select $1';
```

```sql title="Call function"
select print(114514);
----
114514
```
- Create a SQL UDF with multiple type interleaving.

```sql title="Create function"
create function add_sub(INT, FLOAT, INT) returns float language sql as $$select -$1 + $2 - $3$$;
```

```sql title="Call function"
select add_sub(1, 5.1415926, 1);
----
3.1415926
```

```sql title="Combined function calls"
select add(1, -1), sub(1, 1), add_sub(1, 5.1415926, 1);
----
0 0 3.1415926
```

- Create a SQL UDF with complex types interleaving.

```sql title="Create function"
create function add_sub_types(INT, BIGINT, FLOAT, DECIMAL, REAL) returns double language sql as 'select $1 + $2 - $3 + $4 + $5';
```

```sql title="Call function"
select add_sub_types(1, 1919810114514, 3.1415926, 1.123123, 101010.191919);
----
1919810215523.1734494
```

- Create a SQL UDF with a return expression.

```sql title="Create function"
create function add_sub_return(INT, FLOAT, INT) returns float language sql return -$1 + $2 - $3;
```

```sql title="Call function"
select add_sub_return(1, 5.1415926, 1);
----
3.1415926
```

- Create a wrapper function for `add` & `sub`.

```sql title="Create function"
create function add_sub_wrapper(INT, INT) returns int language sql as 'select add($1, $2) + sub($1, $2) + 114512';
```

```sql title="Call function"
select add_sub_wrapper(1, 1);
----
114514
```




- 

```sql title="Create function"

```

```sql title="Call function"

```



#### Anonymous SQL UDFs

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

- Anonymous SQL UDF with `RETURN` expression

```sql title="Create function"
create function add_return(INT, INT) returns int language sql return $1 + $2;
```

```sql title="Call function"
select add_return(1, 1);
----RESULT
2
```

- Anonymous SQL UDF with input of different data types

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

- Anonymous SQL UDF calling other pre-defined anonymous SQL UDFs

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

- Anonymous SQL UDF calling other built-in functions

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

- Mock table example of anonymous SQL UDF


```sql title="Create function"
# Create two anonymous SQL UDFs
create function sub(INT, INT) returns int language sql as 'select $1 - $2';
create function add(INT, INT) returns int language sql as 'select $1 + $2';
```

```sql title="Create table"
# Create a mock table for anonymous SQL UDF
create table t1 (c1 INT, c2 INT);

# Insert some data into the mock table
insert into t1 values (1, 1), (2, 2), (3, 3), (4, 4), (5, 5);
```

```sql title="Call function"
select sub(c1, c2), c1, c2, add(c1, c2) from t1 order by c1 asc;
----RESULT
0 1 1 2
0 2 2 4
0 3 3 6
0 4 4 8
0 5 5 10
```


#### Named SQL UDFs

- Named SQL UDF with `AS` clause

```sql title="Create function"
# Create a named SQL UDF
create function add_named(a INT, b INT) returns int language sql as 'select a + b';

# Create another named SQL UDF
create function sub_named(a INT, b INT) returns int language sql as 'select a - b';
```

```sql title="Call function"
select add_named(1, -1);
----RESULT
0

select sub_named(1, 1);
----RESULT
0
```

- Named SQL UDF with anonymous parameters

```sql title="Create function"
create function add_sub_mix(INT, a INT, INT) returns int language sql as 'select $1 - a + $3';
```

```sql title="Call function"
select add_sub_mix(1, 2, 3);
----RESULT
2
```


- Call anonymous SQL UDF inside named SQL UDF

```sql title="Create function"
# Create an anonymous SQL UDF
create function add(INT, INT) returns int language sql return $1 + $2;
# Create a named function calling the anobymous SQL UDF
create function add_named_wrapper(a INT, b INT) returns int language sql as 'select add(a, b)';
```

```sql title="Call function"
select add_named_wrapper(1, -1);
----RESULT
0
```

- Named SQL UDF with corner case

```sql title="Create function"
create function corner_case(INT, a INT, INT) returns varchar language sql as $$select '$1 + a + $3'$$;
```

```sql title="Call function"
select add_named_wrapper(1, -1);
----RESULT
0
```

- Mock table example of named SQL UDF

```sql title="Create function"
# Create a named SQL UDF
create function add_named(a INT, b INT) returns int language sql as 'select a + b';
```

```sql title="Create table"
# Create a mock table for named SQL UDF
create table t2 (a INT, b INT);

# Insert some data into the mock table
insert into t2 values (1, 1), (2, 2), (3, 3), (4, 4), (5, 5);
```

```sql title="Call function"
select add_named(a, b) from t2 order by a asc;
----RESULT
2
4
6
8
10
```

## See also

[SHOW FUNCTIONS](/sql/commands/sql-show-functions.md) — Show all user-defined functions.

[DROP FUNCTION](/sql/commands/sql-drop-function.md) — Drop a user-defined function.
