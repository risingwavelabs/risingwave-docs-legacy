---
id: sql-function-cast
slug: /sql-function-cast
title: Cast functions and operators
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-cast/" />
</head>

Use the `cast` function and operator to convert a value to a specific type.

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
|*type*           |The data type of the returned value.<br/>For the types you can cast the value to, see [Casting](../data-types/data-type-casting.md).|


## Example
```sql
SELECT '2049-01-01 23:34:56+08:00'::timestamp with time zone::varchar;
```
```
2049-01-01T15:34:56+00:00
```