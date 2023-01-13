---
id: sql-data-types
slug: /sql-data-types
title: Data types
---

## Supported data types

RisingWave supports the following data types:

|Type|Aliases|Description|Value|
|---|---|-------|-------|
|boolean|bool|Logical Boolean. It follows a three-valued logic system (true, false, or null). | true, false, or null |
|smallint| |Two-byte integer. | Range: -32768 to 32767 |
|integer|int|Four-byte integer. | Range: -2147483648 to 2147483647 |
|bigint| |Eight-byte integer. | Range: -9223372036854775808 to 9223372036854775807 |
|numeric|decimal|Exact numeric. We do not support specifying precision and scale as of now. | Range: Up to 131072 digits before the decimal point; up to 16383 digits after the decimal point |
|real| |Single precision floating-point number (4 bytes). | Range: 6 decimal digits precision |
|double precision|double|Double precision floating-point number (8 bytes) | Range: 15 decimal digits precision |
|character varying|varchar, string|Variable-length character string. We do not support specifying the maximum length as of now. | Example: `'Hello World!'` |
|date| |Calendar date (year, month, day). | Example: `date '2022-04-08'` |
|time without time zone|time|Time of day (no time zone) | Example: `time '18:20:49'` |
|timestamp without time zone|timestamp|Date and time (no time zone) | Example: `'2022-03-13 01:00:00'::timestamp` |
|timestamp with time zone |timestamptz|Timestamp with time zone. The 'Z' at the end stands for UTC (Coordinated Universal Time). | Example: `'2022-03-13 01:00:00Z'::timestamptz` |
|interval| |Time span. Input in string format. Units include: second/seconds/s, minute/minutes/min/m, hour/hours/hr/h, day/days/d, month/months/mon, and year/years/yr/y. | Examples: `interval '4 hour'` → `04:00:00` <br /> `interval '3 day'` → `3 days 00:00:00` |
|struct| |Use this type to define a column that contains nested data. | <p>Example: `CREATE TABLE t1 (v1 int, v2 struct<v3 int, v4 struct<v5 varchar, v6 date>>);`</p> <p>To insert a new row to the table:</p><p>`INSERT INTO t1 VALUES (1,(2,('Abc',date '2049-01-01')));`</p>|

:::note

Scientific notation (e.g., 1e6, 1.25e5, and 1e-4) is supported in SELECT and INSERT statements.

:::


## Casts
Certain data types can be cast to and from other types automatically or deliberately.

- 🟢 Implicit: Values can be automatically converted to the target type.
- 🟠 Assignment: Values can be automatically converted when inserted to a column of the target type.
- 🔷 Explicit: Values can be converted to the target type only when you use the [`cast`](functions-operators/sql-function-cast.md) function or operator.

| From \ To | boolean | smallint | integer | bigint | numeric | real | double | varchar | date | timestamp | timestamp with time zone | time | interval |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **boolean** |  | ✖️ | 🔷 | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| **smallint** | ✖️ |  | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| **integer** | 🔷 | 🟠 |  | 🟢 | 🟢 | 🟢 | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| **bigint** | ✖️ | 🟠 | 🟠 |  | 🟢 | 🟢 | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| **numeric** | ✖️ | 🟠 | 🟠 | 🟠 |  | 🟢 | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| **real** | ✖️ | 🟠 | 🟠 | 🟠 | 🟠 |  | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| **double** | ✖️ | 🟠 | 🟠 | 🟠 | 🟠 | 🟠 |  | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| **varchar** | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 |  | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 |
| **date** | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 |  | 🟢 | 🟢 | ✖️ | ✖️ |
| **timestamp** | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | 🟠 |  | 🟢 | 🟠 | ✖️ |
| **timestamp with time zone** | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | 🟠 | 🟠 |  | 🟠 | ✖️ |
| **time** | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | ✖️ | ✖️ | ✖️ |  | 🟢 |
| **interval** | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | ✖️ | ✖️ | ✖️ | 🟠 |  |

<!--You can find the casting relations here: https://github.com/risingwavelabs/risingwave/blob/be868cc6e479de30be78c98b77ab3ad686938b89/src/frontend/src/expr/type_inference/cast.rs#L201-->