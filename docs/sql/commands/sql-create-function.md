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

## Embedded UDFs

Here are examples of embedded UDFs.

```sql title="Inlined UDFs"
# Embedded Python UDF
create function gcd(a int, b int) returns int language python as $$
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a
$$;
# Embedded JavaScript UDF
create function gcd(a int, b int) returns int language javascript as $$
    while (b != 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
$$;
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

#### Basic examples for SQL UDFs with unnamed and named parameters

- Create a SQL UDF with unnamed parameters and double dollar definition.

```sql title="Create function"
create function add(INT, INT) returns int language sql as $$select $1 + $2$$;
```

```sql title="Call function"
select add(1, -1);
----RESULT
0
```

- Create a SQL UDF with unnamed parameters and single quote definition.

```sql title="Create function"
create function sub(INT, INT) returns int language sql as 'select $1 - $2';
```

```sql title="Call function"
select sub(1, 1);
----RESULT
0
```

- Create a SQL UDF with unnamed parameters that calls other pre-defined SQL UDFs.

```sql title="Create function"
-- Create two SQL UDFs for subsequent call
create function add1(INT, INT) returns int language sql as 'select $1 + $2';
create function sub1(INT, INT) returns int language sql as 'select $1 - $2';

create function add_sub_binding() returns int language sql as 'select add1(1, 1) + sub1(2, 2)';
```

```sql title="Call function"
select add_sub_binding();
----RESULT
2

select add1(1, -1), sub1(1, 1), add_sub_binding();
----RESULT
0 0 2
```

---

- Create a SQL UDF with named parameters and single quote definition.

```sql title="Create function"
create function add_named(a INT, b INT) returns int language sql as 'select a + b';
```

```sql title="Call function"
select add_named(1, -1);
----RESULT
0
```

- Create a SQL UDF with named parameters and double dollar definition.

```sql title="Create function"
create function sub_named(a INT, b INT) returns int language sql as $$select a - b$$;
```

```sql title="Call function"
select sub_named(1, 1);
----RESULT
0
```

---

- Create a SQL UDF with mixed named and unnamed parameters.

```sql title="Create function"
create function add_sub_mix(INT, a INT, INT) returns int language sql as 'select $1 - a + $3';
```

```sql title="Call function"
select add_sub_mix(1, 2, 3);
----RESULT
2
```

- Call a SQL UDF with unnamed parameters inside a SQL UDF with named parameters.

```sql title="Create function"
create function add2(INT, INT) returns int language sql as $$select $1 + $2$$;
create function add_named_wrapper(a INT, b INT) returns int language sql as 'select add2(a, b)';
```

```sql title="Call function"
select add_named_wrapper(1, -1);
----RESULT
0
```

---

- Create a SQL UDF with unnamed parameters and a return expression.

```sql title="Create function"
create function add_return(INT, INT) returns int language sql return $1 + $2;
```

```sql title="Call function"
select add_return(1, 1);
----RESULT
2
```

- Create a SQL UDF with a return expression using previously defined UDFs.

```sql title="Create function"
-- Create a SQL UDF used in subsequent call
create function add_return1(INT, INT) returns int language sql return $1 + $2;

create function add_return_binding() returns int language sql return add_return1(1, 1) + add_return1(1, 1);
```

```sql title="Call function"
select add_return_binding();
----RESULT
4
```

---

- Create a SQL UDF with multiple types of parameters.

```sql title="Create function"
create function add_sub(INT, FLOAT, INT) returns float language sql as $$select -$1 + $2 - $3$$;
```

```sql title="Call function"
select add_sub(1, 5.1415926, 1);
----RESULT
3.1415926
```

- Create a SQL UDF with complex types of unnamed parameters.

```sql title="Create function"
create function add_sub_types(INT, BIGINT, FLOAT, DECIMAL, REAL) returns double language sql as 'select $1 + $2 - $3 + $4 + $5';
```

```sql title="Call function"
select add_sub_types(1, 1919810114514, 3.1415926, 1.123123, 101010.191919);
----RESULT
1919810215523.1734494
```

---

- Create a wrapper function.

```sql title="Create function"
-- Create two SQL UDFs.
create function add_wp(INT, INT) returns int language sql as $$select $1 + $2$$;
create function sub_wp(INT, INT) returns int language sql as 'select $1 - $2';

-- Create a wrapper function.
create function add_sub_wrapper(INT, INT) returns int language sql as 'select add_wp($1, $2) + sub_wp($1, $2) + 114512';
```

```sql title="Call function"
select add_sub_wrapper(1, 1);
----RESULT
114514
```

#### Basic SQL UDFs integrated with the use of mock tables 

The examples in this section are a basic simulation of real-world use cases.

```sql title="Create table"
-- Create 3 tables. t1 and t2 are for unamed SQL UDF. t3 is for named SQL UDF.

create table t1 (c1 INT, c2 INT);
create table t2 (c1 INT, c2 FLOAT, c3 INT);

create table t3 (a INT, b INT);
```

```sql title="Insert data"
-- Insert data into these tables.
insert into t1 values (1, 1), (2, 2), (3, 3), (4, 4), (5, 5);
insert into t2 values (1, 3.14, 2), (2, 4.44, 5), (20, 10.30, 02);
insert into t3 values (1, 1), (2, 2), (3, 3), (4, 4), (5, 5);
```

```sql title="Create function"
create function add_return_mc(INT, INT) returns int language sql return $1 + $2;
```

```sql title="Call function"
select c1, c2, add_return_mc(c1, c2) from t1 order by c1 asc;
----RESULT
1 1 2
2 2 4
3 3 6
4 4 8
5 5 10
```


```sql title="Create function"
create function add_mc(INT, INT) returns int language sql as $$select $1 + $2$$;
create function sub_mc(INT, INT) returns int language sql as 'select $1 - $2';
create function add_sub_mc(INT, FLOAT, INT) returns float language sql as $$select -$1 + $2 - $3$$;
create function add_sub_return_mc(INT, FLOAT, INT) returns float language sql return -$1 + $2 - $3;
```

```sql title="Call function"
select sub_mc(c1, c2), c1, c2, add_mc(c1, c2) from t1 order by c1 asc;
----RESULT
0 1 1 2
0 2 2 4
0 3 3 6
0 4 4 8
0 5 5 10

select c1, c2, c3, add_mc(c1, c3), sub_mc(c1, c3), add_sub_mc(c1, c2, c3) from t2 order by c1 asc;
----RESULT
1 3.14 2 3 -1 0.14000000000000012
2 4.44 5 7 -3 -2.5599999999999996
20 10.3 2 22 18 -11.7

select c1, c2, c3, add_mc(c1, c3), sub_mc(c1, c3), add_sub_return_mc(c1, c2, c3) from t2 order by c1 asc;
----RESULT
1 3.14 2 3 -1 0.14000000000000012
2 4.44 5 7 -3 -2.5599999999999996
20 10.3 2 22 18 -11.7
```

```sql title="Create function"
create function add_named_mc(a INT, b INT) returns int language sql as 'select a + b';
```

```sql title="Call function"
select add_named_mc(a, b) from t3 order by a asc;
----RESULT
2
4
6
8
10
```

#### Examples of corner and special cases tests

```sql title="Create function"
-- Mixed parameters with calling inner SQL UDFs

create function add_cs(INT, INT) returns int language sql as $$select $1 + $2$$;
create function sub_cs(INT, INT) returns int language sql as 'select $1 - $2';

create function add_sub_mix_wrapper(INT, a INT, INT) returns int language sql as 'select add_cs($1, a) + a + sub_cs(a, $3)';
```

```sql title="Call function"
select add_sub_mix_wrapper(1, 2, 3);
----RESULT
4
```

---

```sql title="Create function"
-- Named SQL UDF with corner case
create function corner_case(INT, a INT, INT) returns varchar language sql as $$select '$1 + a + $3'$$;
```

```sql title="Call function"
select corner_case(1, 2, 3);
----RESULT
$1 + a + $3
```
---

```sql title="Create function"
-- Create a SQL UDF with unnamed parameters that calls built-in functions
create function call_regexp_replace() returns varchar language sql as $$select regexp_replace('Cat is the cutest animal.', 'Cat', 'Dog', 'g')$$;
```

```sql title="Call function"
select call_regexp_replace();
----RESULT
Dog is the cutest animal.
```

```sql title="Create function"
create function regexp_replace_wrapper(varchar) returns varchar language sql as $$select regexp_replace($1, 'Cat', 'Dog', 'g')$$;
```

```sql title="Call function"
select regexp_replace_wrapper('Cat is the cutest animal.');
----RESULT
Dog is the cutest animal.
```

:::note
Note that double dollar signs should be used otherwise the parsing will fail.
:::

---

```sql title="Create function"
-- Recursive corner case (i.e., valid definition should not be rejected)
create function foo(INT) returns varchar language sql as $$select 'foo(INT)'$$;
```

```sql title="Call function"
select foo(114514);
----RESULT
foo(INT)
```

---

```sql title="Create function"
-- Adjust the input value of the calling function (i.e., `print` here) with the actual input parameter
create function print_add_one(INT) returns int language sql as 'select print($1 + 1)';

create function print_add_two(INT) returns int language sql as 'select print($1 + $1)';
```

```sql title="Call function"
select print_add_one(1), print_add_one(114513), print_add_two(2);
----RESULT
2 114514 4
```

## See also

[SHOW FUNCTIONS](/sql/commands/sql-show-functions.md) — Show all user-defined functions.

[DROP FUNCTION](/sql/commands/sql-drop-function.md) — Drop a user-defined function.
