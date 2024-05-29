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
    rr.Optional(
      rr.Sequence(
      rr.Terminal('LANGUAGE'),
      rr.NonTerminal('language_name'),
      ),'skip'
    ),
    rr.Sequence(
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

<Drawer SVG={svg} />

</TabItem>

<TabItem value="code" label="Code">

```sql
CREATE FUNCTION function_name ( argument_type [, ...] )
    [ RETURNS return_type | RETURNS TABLE ( column_name column_type [, ...] ) ]
    [ LANGUAGE language_name ]
    AS function_name_defined_in_server
    USING LINK 'udf_server_address';
```

</TabItem>

</Tabs>

## Parameters

| Parameter or clause                      | Description                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _function_name_                          | The name of the UDF that you want to declare in RisingWave.                                                                                                                                                                                                                                                              |
| _argument_type_                          | The data type of the input parameter(s) that the UDF expects to receive.                                                                                                                                                                                                                                                 |
| **RETURNS** _return_type_                | Use this if the function returns a single value (i.e., scalar). It specifies the data type of the return value from the UDF.<br />The struct type, which can contain multiple values, is supported. But the field names must be consistent between Python and SQL definitions, or it will be considered a type mismatch. |
| **RETURNS TABLE**                        | Use this if the function is a table-valued function (TVF). It specifies the structure of the table that the UDF returns.                                                                                                                                                                                                 |
| **LANGUAGE**                             | Optional. Specifies the programming language used to implement the UDF. <br/> Currently, `python` and `java` are supported.                                                                                                                                                                                              |
| **AS** _function_name_defined_in_server_ | Specifies the function name defined in the UDF server.                                                                                                                                                                                                                                                                   |
| **USING LINK** '_udf_server_address_'    | Specifies the UDF server address. <br/>If you are running RisingWave in your local environment, the address is `http://localhost:<port>` <br/> If you are running RisingWave using Docker, the address is `http://host.docker.internal:<port>/`                                                                          |

## See also

[SHOW FUNCTIONS](/sql/commands/sql-show-functions.md) — Show all user-defined functions.

[DROP FUNCTION](/sql/commands/sql-drop-function.md) — Drop a user-defined function.
