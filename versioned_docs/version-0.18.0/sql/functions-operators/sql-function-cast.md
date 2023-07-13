---
id: sql-function-cast
slug: /sql-function-cast
title: Cast functions and operators
---

Use the `cast` function and operator to convert a value to a specifc type.

## Syntax

```sql
cast ( value AS type )
```

```sql
value :: type
```

|Parameter        | Description     |
|-----------------|-----------------|
|*value*          |The value to be converted.|
|*type*           |The data type of the returned value.<br/>For the types you can cast the value to, see [Data types](/sql/sql-data-types.md/#casts).|


## Example
```sql
SELECT '2049-01-01 23:34:56+08:00'::timestamp with time zone::varchar;
```
```
2049-01-01T15:34:56+00:00
```