---
id: data-type-array
slug: /data-type-array
title: Array type
---

An array is an ordered list of zero or more elements that share the same data type including the array type. 

### Define an array

To define an array in a schema, append `[]` to the data type of the column when you define the schema. For example, you can use `trip_id VARCHAR[]` to create an array that stores trip IDs.

You can also define a temporary array in a SQL statement in this syntax:
```sql
Array[value1, value2, ...]
```

#### Examples

The following statement defines a temporary array and retrieves the columns in it.

```sql
SELECT ARRAY['foo', 'bar', null];
-----Result
{foo,bar,NULL}
```

The following statement defines a table `x` that has an array of arrays.

```sql
CREATE TABLE x (a INT[][]);
```

The following statement defines a table `taxi` that contains an array `trip_id`.

```sql
CREATE TABLE taxi (
        taxi_id VARCHAR,
        trip_id VARCHAR[],
        plate VARCHAR,
        company VARCHAR,
        license_expiration_date DATE,
        licensed_to VARCHAR
    );
```


### Add values to an array

To add values to an array, in the SQL statement, use ARRAY to indicate that this is an array, and then enclose the data in the array with `[]`. For example, `ARRAY ['ABCD1234', 'ABCD1235', 'ABCD1236', 'ABCD1237']`.

#### Examples

Add values to table `x`:

```sql
INSERT INTO x VALUES (Array[Array[1], Array[2,3]]);
```

Add values to table `taxi`:
```sql
INSERT INTO taxi VALUES
        (
            'FAST0001',
            ARRAY['ABCD1234', 'ABCD1235', 'ABCD1236', 'ABCD1237'],
            'N5432N', 
            'FAST TAXI', 
            '2030-12-31', 
            'DAVID WANG'
        );
```

### Retrieve data in an array

To retrieve data in an array, use the `ARRAY_COLUMN[RELATIVE_POSITION]` syntax. Relative positions start from 1. For example, to access `ABCD1234`, the first object in the `trip_id` array, we can specify `trip_id[1]`.

#### Examples

Retrieve the second element in array `a` from the `x` table.
```sql
SELECT a[2] FROM x;
-----Result
{2,3}
```

Retrieve the first element in array `trip_id` from the `taxi` table.

```sql
SELECT trip_id[1] 
FROM taxi;
-----Result
'ABCD1234'
```

### Unnest data from an array

You can use the `unnest()` function to spread values in an array into seperate rows.

```sql
SELECT unnest(array[1,2,3,4]);
------Result
      1
      2
      3
      4
```