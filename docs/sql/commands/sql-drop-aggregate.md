---
id: sql-drop-aggregate
title: DROP AGGREGATE
description: Drop a user-defined aggregate function.
slug: /sql-drop-aggregate
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-drop-aggregate/" />
</head>

Use the `DROP AGGREGATE` command to remove an existing [user-defined aggregate function (UDAF)](/sql/udf/user-defined-functions.md).
The usage is similar to `DROP FUNCTION`, except that it's for aggregate functions.

## Syntax

```sql
DROP AGGREGATE [ IF EXISTS ] function_name [ ( argument_type [, ...] ) ] ;
```

| Parameter or clause           | Description                                           |
|-------------------------------|-------------------------------------------------------|
| *function_name*               | Name of the UDAF you want to drop.                    |
| ( *argument_type* [ , ... ] ) | Optional: Argument types of the function.<br/>Specify the argument types when the name of the function you want to drop isn't unique within the schema. |
|IF EXISTS| Do not return an error if the specified function does not exist. A notice is issued in this case. |

## Usage

A function can be dropped using one of the following methods:

- Full function signature:

    ```sql
    DROP AGGREGATE function_name ( argument_type [, ...] ); 
    ```

- Function name only, if it's unique in its schema:

    ```sql
    DROP AGGREGATE function_name;
    ```

    You can run [`SHOW FUNCTIONS;`](/sql/commands/sql-show-functions.md) to list all existing UDFs to see if a function name is unique.

## See also

[CREATE AGGREGATE](/sql/commands/sql-create-aggregate.md) — Create a user-defined aggregate function.

[DROP FUNCTIONS](/sql/commands/sql-drop-function.md) — Drop a user-defined function.
