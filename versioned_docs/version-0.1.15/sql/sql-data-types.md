---
id: sql-data-types
slug: /sql-data-types
title: Overview of data types
---

RisingWave supports the following data types:

|Type|Aliases|Description|Value|
|---|---|-------|-------|
|boolean|bool|Logical Boolean. <br/>It follows a three-valued logic system (true, false, or null). | true, false, or null |
|smallint| |Two-byte integer | Range: -32768 to 32767 |
|integer|int|Four-byte integer | Range: -2147483648 to 2147483647 |
|bigint| |Eight-byte integer | Range: -9223372036854775808 to 9223372036854775807 |
|numeric|decimal|Exact numeric. <br/>We do not support specifying precision and scale as of now. | Range: Up to 131072 digits before the decimal point; up to 16383 digits after the decimal point |
|real| |Single precision floating-point number (4 bytes) | Range: 6 decimal digits precision |
|double precision|double|Double precision floating-point number (8 bytes) | Range: 15 decimal digits precision |
|character varying|varchar, string|Variable-length character string. <br/>We do not support specifying the maximum length as of now. | Example: `'Hello World!'` |
|bytea||[Binary strings](https://www.postgresql.org/docs/current/datatype-binary.html).<br/> RisingWave only supports the hex formats for input and output; the escape format is not supported yet. |Syntax: `' \x binary_string '`<br/>Example: `'\xDe00BeEf'`|
|date| |Calendar date (year, month, day) | Example: `date '2022-04-08'` |
|time without time zone|time|Time of day (no time zone) | Example: `time '18:20:49'` |
|timestamp without time zone|timestamp|Date and time (no time zone) | Example: `'2022-03-13 01:00:00'::timestamp` |
|timestamp with time zone |timestamptz|Timestamp with time zone. <br/>The 'Z' stands for UTC (Coordinated Universal Time). | Example: `'2022-03-13 01:00:00Z'::timestamptz` |
|interval| |Time span. <br/>Input in string format. Units include: second/seconds/s, minute/minutes/min/m, hour/hours/hr/h, day/days/d, month/months/mon, and year/years/yr/y. | Examples: `interval '4 hour'` → `04:00:00` <br /> `interval '3 day'` → `3 days 00:00:00` |
|struct| |A struct is a column that contains nested data. For syntax and examples, see [Struct](./data-types/data-type-struct.md). | |
|array| | An array is an ordered list of zero or more elements that share the same data type including the array type. For syntax and examples, see [Array](./data-types/data-type-array.md).|

:::note

Scientific notation (e.g., 1e6, 1.25e5, and 1e-4) is supported in SELECT and INSERT statements.

:::

## Casting

For details about data type casting, see [Casting](./data-types/data-type-casting.md).
