---
id: sql-data-types
slug: /sql-data-types
title: Data types
---

## Supported data types

RisingWave supports the following data types:

| Type                        | Aliases         | Description                                                                                                                                                                                                                                                                                                               |
| --------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| boolean                     | bool            | Logical Boolean. It follows a three-valued logic system (true, false, and null).                                                                                                                                                                                                                                          |
| smallint                    |                 | Two-byte integer                                                                                                                                                                                                                                                                                                          |
| integer                     | int             | Four-byte integer                                                                                                                                                                                                                                                                                                         |
| bigint                      |                 | Eight-byte integer                                                                                                                                                                                                                                                                                                        |
| numeric                     | decimal         | Exact numeric. We do not support specifying precision and scale as of now.                                                                                                                                                                                                                                                |
| real                        |                 | Single precision floating-point number (4 bytes)                                                                                                                                                                                                                                                                          |
| double precision            | double          | Double precision floating-point number (8 bytes)                                                                                                                                                                                                                                                                          |
| character varying           | varchar, string | Variable-length character string. We do not support specifying the maximum length as of now.                                                                                                                                                                                                                              |
| date                        |                 | Calendar date (year, month, day)                                                                                                                                                                                                                                                                                          |
| time without time zone      | time            | Time of day (no time zone)                                                                                                                                                                                                                                                                                                |
| timestamp without time zone | timestamp       | Date and time (no time zone)                                                                                                                                                                                                                                                                                              |
| timestamp with time zone    |                 | Timestamp with time zone                                                                                                                                                                                                                                                                                                  |
| interval                    |                 | Time span. Input in string format. Units include: second/seconds/s, minute/minutes/min/m, hour/hours/hr/h, day/days/d, month/months/mon, and year/years/yr/y.<p>Examples:</p><p>`interval '4 hour'` → `04:00:00` <br /> `interval '3 day'` → `3 days 00:00:00`</p>                                                        |
| struct                      |                 | <p>Use this type to define a nested table. A nested table is a table that is embedded in another table.</p><p>Example:</p><p>`CREATE TABLE t1 (v1 int, v2 struct<v3 int, v4 struct<v5 varchar, v6 date>>);`</p> <p>To insert a new row to the table:</p><p>`INSERT INTO t1 VALUES (1,(2,('Abc',date '2049-01-01')));`</p> |

## Casts

Certain data types can be cast to and from other types automatically or deliberately.

- Implicit: Values can be automatically converted to the target type.
- Assignment: Values can be automatically converted when inserted to a column of the target type.
- Explicit: Values can be converted to the target type only when you use the [`cast`](functions-operators/sql-function-cast.md) function or operator.

| From \ To                    | boolean  | smallint   | integer    | bigint     | numeric    | real       | double   | varchar    | date       | timestamp  | timestamp with time zone | time       | interval |
| ---------------------------- | -------- | ---------- | ---------- | ---------- | ---------- | ---------- | -------- | ---------- | ---------- | ---------- | ------------------------ | ---------- | -------- |
| **boolean**                  |          | ❌         | Explicit   | ❌         | ❌         | ❌         | ❌       | Assignment | ❌         | ❌         | ❌                       | ❌         | ❌       |
| **smallint**                 | ❌       |            | Implicit   | Implicit   | Implicit   | Implicit   | Implicit | Assignment | ❌         | ❌         | ❌                       | ❌         | ❌       |
| **integer**                  | Explicit | Assignment |            | Implicit   | Implicit   | Implicit   | Implicit | Assignment | ❌         | ❌         | ❌                       | ❌         | ❌       |
| **bigint**                   | ❌       | Assignment | Assignment |            | Implicit   | Implicit   | Implicit | Assignment | ❌         | ❌         | ❌                       | ❌         | ❌       |
| **numeric**                  | ❌       | Assignment | Assignment | Assignment |            | Implicit   | Implicit | Assignment | ❌         | ❌         | ❌                       | ❌         | ❌       |
| **real**                     | ❌       | Assignment | Assignment | Assignment | Assignment |            | Implicit | Assignment | ❌         | ❌         | ❌                       | ❌         | ❌       |
| **double**                   | ❌       | Assignment | Assignment | Assignment | Assignment | Assignment |          | Assignment | ❌         | ❌         | ❌                       | ❌         | ❌       |
| **varchar**                  | Explicit | Explicit   | Explicit   | Explicit   | Explicit   | Explicit   | Explicit |            | Explicit   | Explicit   | Explicit                 | Explicit   | Explicit |
| **date**                     | ❌       | ❌         | ❌         | ❌         | ❌         | ❌         | ❌       | Assignment |            | Implicit   | Implicit                 | ❌         | ❌       |
| **timestamp**                | ❌       | ❌         | ❌         | ❌         | ❌         | ❌         | ❌       | Assignment | Assignment |            | Implicit                 | Assignment | ❌       |
| **timestamp with time zone** | ❌       | ❌         | ❌         | ❌         | ❌         | ❌         | ❌       | Assignment | Assignment | Assignment |                          | Assignment | ❌       |
| **time**                     | ❌       | ❌         | ❌         | ❌         | ❌         | ❌         | ❌       | Assignment | ❌         | ❌         | ❌                       |            | Implicit |
| **interval**                 | ❌       | ❌         | ❌         | ❌         | ❌         | ❌         | ❌       | Assignment | ❌         | ❌         | ❌                       | Assignment |          |

<!--You can find the casting relations here: https://github.com/singularity-data/risingwave/blob/be868cc6e479de30be78c98b77ab3ad686938b89/src/frontend/src/expr/type_inference/cast.rs#L201-->
