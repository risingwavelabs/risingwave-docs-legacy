---
id: data-type-struct
slug: /data-type-struct
title: Struct
---

Use the struct data type to create a column that contains nested columns. The nested columns can be of different data types, including the struct type.

## Define a struct type

Syntax:
`STRUCT< >`

Struct types are declared using the angle brackets (`<` and `>`).

### Examples

The statement below creates a table `x` that contains struct `a`, which contains two nested columns (`b` and `c`) that are both integers.

```sql
CREATE TABLE x (a STRUCT <b INTEGER, c INTEGER>, d INTEGER);
```

The statement below creates a table `y` that contains struct `a`, which contains another struct `c`.

```sql
CREATE TABLE y (a STRUCT <b STRUCT<c INTEGER>, d INTEGER>, e VARCHAR);
```

Below is a real world example.

```sql
CREATE TABLE trip (
        id VARCHAR,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        distance DOUBLE PRECISION,
        fare STRUCT <
            initial_charge DOUBLE PRECISION,
            subsequent_charge DOUBLE PRECISION,
            surcharge DOUBLE PRECISION,
            tolls DOUBLE PRECISION 
            > 
        );
```

## Add values to a struct

To add values to structs, enclose the nested data with `()` in the SQL statement. For example, `(1, true)`. Alternatively, you can also use `ROW(1, true)`.

### Examples

The statement below adds values to table `x`.

```sql
INSERT INTO x VALUES (ROW(3, 4), 5);
```

The statement below adds values to table `y`.
```sql
INSERT INTO y VALUES (ROW(ROW(6), 7), 8);
```

The statement below adds values to table `trip`.

```sql
INSERT INTO trip VALUES 
        (
            '1234ABCD', 
            '2022-07-28 11:04:05', 
            '2022-07-28 11:15:22', 
            6.1, 
            ROW(1.0, 4.0, 1.5, 2.0)
        );
```

## Retrieve data in a struct

To retrieve data in a struct, enclose the struct name with `()` and use the dot operator to specify the nested column. For example, to access the `initial_charge` column under `fare` in the `trip` schema, use `(fare).initial_charge`.

### Examples

```sql
SELECT (a).b, d
FROM x;
```

```sql
SELECT ((a).b).c, e
FROM y;
```

```sql
SELECT id, (fare).initial_charge 
FROM trip;
```

## Casting

Structs can be casted explicitly or implictly to structs if the nested expressions and types can be casted.

### Examples

```sql
SELECT (1, (2, 3))::STRUCT<i BIGINT, j STRUCT<a BIGINT, b VARCHAR>>;
-----Result
(1,(2,3))
```

```sql
SELECT ROW(1, ROW('1', 1)) = ROW('1', ROW(1, '1'));
-----
t
```
