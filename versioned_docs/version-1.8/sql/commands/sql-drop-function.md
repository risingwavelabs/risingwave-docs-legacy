---
id: sql-drop-function
title: DROP FUNCTION
description: Drop a user-defined function.
slug: /sql-drop-function
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-drop-function/" />
</head>

Use the `DROP FUNCTION` command to remove an existing [user-defined function (UDF)](/sql/udf/user-defined-functions.md).

## Syntax

```sql
DROP FUNCTION [ IF EXISTS ] function_name [ ( argument_type [, ...] ) ] ;
```

| Parameter or clause           | Description                                           |
|-------------------------------|-------------------------------------------------------|
| *function_name*               | Name of the UDF you want to drop.           |
| ( *argument_type* [ , ... ] ) | Optional: Argument types of the function.<br/>Specify the argument types when the name of the function you want to drop isn't unique within the schema. |
|IF EXISTS| If the function does not exists, do not throw an error. Instead, a notice is issued. |

## Usage

A function can be dropped using one of the following methods:

- Full function signature:

    ```sql
    DROP FUNCTION function_name ( argument_type [, ...] ); 
    ```

- Function name only, if it's unique in its schema:

    ```sql
    DROP FUNCTION function_name;
    ```

    You can run [`SHOW FUNCTIONS;`](/sql/commands/sql-show-functions.md) to list all existing UDFs to see if a function name is unique.

:::tip
`DROP FUNCTION function_name();` drops a function with zero arguments.

`DROP FUNCTION function_name;` drops a function with any number of arguments, including zero, as long as the name is unique.
:::

## Examples

First, let's [create some functions](/sql/commands/sql-create-function.md).

```sql
CREATE FUNCTION f1() RETURNS real LANGUAGE python AS func1 USING LINK 'http://localhost:8815';
CREATE FUNCTION f1(int) RETURNS int LANGUAGE python AS func2 USING LINK 'http://localhost:8815';
CREATE FUNCTION f1(int,int) RETURNS int LANGUAGE python AS func3 USING LINK 'http://localhost:8815';
CREATE FUNCTION f2(int,int) RETURNS int LANGUAGE python AS func4 USING LINK 'http://localhost:8815';
```

You can drop a unique function by name:

```sql
DROP FUNCTION f2;
```

You cannot drop a function by name when its name is not unique:

```sql
DROP FUNCTION f1;
```
```
ERROR:  QueryError: Catalog error: function name "f1" is not unique
HINT: Specify the argument list to select the function unambiguously.
```

You can drop a function by full signature:

```sql
DROP FUNCTION f1();
DROP FUNCTION f1(int);
```

Now, `f1(int,int)` is the only function named `f1`, you can drop it by name or full signature:

```sql
DROP FUNCTION f1; 
-- Or DROP FUNCTION f1(int,int);
```

## See also

[User-defined functions](/sql/udf/user-defined-functions.md) — A step-by-step guide for using UDFs in RisingWave: installing the RisingWave UDF API, defining functions in a Python file, starting the UDF server, and declaring UDFs in RisingWave.

[SHOW FUNCTIONS](/sql/commands/sql-show-functions.md) — Show all existing UDFs.
