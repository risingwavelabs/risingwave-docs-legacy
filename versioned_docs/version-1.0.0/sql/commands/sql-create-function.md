---
id: sql-create-function
title: CREATE FUNCTION
description: Create a user-defined function.
slug: /sql-create-function
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-function/" />
</head>

You can define your own functions (including table functions) and call these functions in RisingWave. With the user-defined function (UDF), you can tailor RisingWave to your needs and take advantage of the power and flexibility of Python and Java to perform complex and customized data processing and analysis tasks.

See [User-defined functions](/sql/udf/user-defined-functions.md) for details.

Use the `CREATE FUNCTION` command to declare the UDFs before you can use them in SQL queries like any built-in functions.

## Syntax

```sql
CREATE FUNCTION function_name ( argument_type [, ...] )
    [ RETURNS return_type | RETURNS TABLE ( column_name column_type [, ...] ) ]
    [ LANGUAGE language_name ]
    AS function_name_defined_in_server
    USING LINK 'udf_server_address';
```

## Parameters

| Parameter or clause | Description |
| --- | --- |
| *function_name* | The name of the UDF that you want to declare in RisingWave. |
| *argument_type* | The data type of the input parameter(s) that the UDF expects to receive.|
| **RETURNS** *return_type* | Use this if the function returns a single value (i.e., scalar). It specifies the data type of the return value from the UDF.<br />The struct type, which can contain multiple values, is supported. But the field names must be consistent between Python and SQL definitions, or it will be considered a type mismatch.|
| **RETURNS TABLE** | Use this if the function is a table-valued function (TVF). It specifies the structure of the table that the UDF returns. |
| **LANGUAGE** | Optional. Specifies the programming language used to implement the UDF. <br/> Currently, `python` and `java` are supported.|
| **AS** *function_name_defined_in_server* | Specifies the function name defined in the UDF server.|
| **USING LINK** '*udf_server_address*' | Specifies the UDF server address. <br/>If you are running RisingWave in your local environment, the address is `http://localhost:<port>` <br/> If you are running RisingWave using Docker, the address is `http://host.docker.internal:<port>/`|


## See also

[SHOW FUNCTIONS](/sql/commands/sql-show-functions.md) — Show all user-defined functions.

[DROP FUNCTION](/sql/commands/sql-drop-function.md) — Drop a user-defined function.
