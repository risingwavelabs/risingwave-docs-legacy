---
id: udf-javascript
slug: /udf-javascript
title: Use UDFs in JavaScript
description: Define your own functions in JavaScript.
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/udf-javascript/" />
</head>

This article provides a step-by-step guide for defining JavaScript functions in RisingWave.

JavaScript code is inlined in `CREATE FUNCTION` statement and then run on the embedded QuickJS virtual machine in RisingWave. It does not support access to external networks and is limited to computational tasks only. Compared to other languages, JavaScript UDFs offer the easiest way to define UDFs in RisingWave.

## Define your functions

You can use the [`CREATE FUNCTION`](/sql/commands/sql-create-function.md) command to create JavaScript UDFs. See the syntax as follows:

```sql
CREATE FUNCTION function_name ( arg_name arg_type [, ...] )
    [ RETURNS return_type | RETURNS TABLE ( column_name column_type [, ...] ) ]
    LANGUAGE javascript
    AS [ $$ function_body $$ | 'function_body' ];
```

The argument names you defined can be used in the function body. For example:

```sql
CREATE FUNCTION gcd(a int, b int) RETURNS int LANGUAGE javascript AS $$
    if(a == null || b == null) {
        return null;
    }
    while (b != 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
$$;
```

See the correspondence between SQL types and JavaScript types in the [Data type mapping](udf-javascript.md#data-type-mapping). You need to ensure that the type of the return value is either `null` or consistent with the type in the `RETURNS` clause.

If the function you defined returns a table, you need to use the `yield` statement to return the data of each row. For example:

```sql
CREATE FUNCTION series(n int) RETURNS TABLE (x int) LANGUAGE javascript AS $$
    for(let i = 0; i < n; i++) {
        yield i;
    }
$$;
```

## Use your functions

Once the UDFs are created in RisingWave, you can use them in SQL queries just like any built-in functions. For example:

```sql
SELECT gcd(25, 15);
SELECT * from series(5);
```

## Data type mapping

The following table shows the data type mapping between SQL and JavaScript:

| SQL Type           | JavaScript Type                                | Note                                                         |
| ------------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| boolean            | boolean                                        |                                                              |
| smallint           | number                                         |                                                              |
| int                | number                                         |                                                              |
| bigint             | number                                         |                                                              |
| real               | number                                         |                                                              |
| double precision   | number                                         |                                                              |
| decimal            | [BigDecimal]                                   | BigDecimal is in TC39 proposal stage, implemented by QuickJS |
| date               | not supported yet                              |                                                              |
| time               | not supported yet                              |                                                              |
| timestamp          | not supported yet                              |                                                              |
| timestamptz        | not supported yet                              |                                                              |
| interval           | not supported yet                              |                                                              |
| varchar            | string                                         |                                                              |
| bytea              | Uint8Array                                     |                                                              |
| jsonb              | null, boolean, number, string, array or object | `JSON.parse(string)`                                         |
| smallint[]         | Int16Array                                     |                                                              |
| int[]              | Int32Array                                     |                                                              |
| bigint[]           | BigInt64Array                                  |                                                              |
| real[]             | Float32Array                                   |                                                              |
| double precision[] | Float64Array                                   |                                                              |
| others[]           | array                                          |                                                              |
| struct\<..\>       | object                                         |                                                              |

[BigDecimal]: https://github.com/tc39/proposal-decimal/blob/b958a7206774e86b1d443bd6b4926ec9342a9181/bigdecimal-reference.md
