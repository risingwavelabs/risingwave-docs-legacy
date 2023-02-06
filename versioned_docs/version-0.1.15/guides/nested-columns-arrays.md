---
id: nested-columns-arrays
title: Specify nested columns and arrays
description: Specify nested columns and arrays
slug: /nested-columns-arrays
---
This guide describes how to create a schema that contains nested columns and arrays (repeated columns), add values to such columns, and access nested and repeated data in RisingWave.

## Define nested columns and arrays

To create a column with nested data, set the data type of the column to `STRUCT`, and use &lt;&gt; to enclose nested columns. Columns nested under the same column can be in different data types. A nested column can contain nested data. For more information about the `STRUCT` data type, see [Data types](/sql/sql-data-types.md).


To create a column with repeated data (that is, an array), append \[\] to the data type of the column when you define the schema. For example, you can use `trip_id VARCHAR[]` to create an array that stores trip IDs.


## Add values to nested columns and arrays

To add values to nested columns, enclose the nested data with () in the SQL statement. For example, `(1, true)`. Alternatively, you can also use `row(1, true)`. 

To add values to an array, in the SQL statement, use `ARRAY` to indicate that this is an array, and then enclose the data in the array with \[\]. For example, `ARRAY ['ABCD1234', 'ABCD1235', 'ABCD1236', 'ABCD1237']`.


## Access nested data and data in an array

To access data nested under a column, enclose the column with () and use the dot operator to specify the nested column. For example, to access the `initial_charge` column under `fare` in the `trip` schema, use `(fare).initial_charge`.

To access data in an array, use the `ARRAY_COLUMN[RELATIVE_POSITION]` syntax. Relative positions start from 1. For example, to access `ABCD1234`, the first object in the `trip_id` array, we can specify `trip_id[1]`.

## Unnest data from an array

You can use the `unnest()` function to spread values in an array into seperate rows.

```sql
SELECT * FROM unnest(array[1,2,3,4]);
```
Here is the result of the above statement.
```
 unnest 
--------
      1
      2
      3
      4
(4 rows)
```

## Examples

The `trip` schema below contains nested columns, and the `taxi` schema contains an array.

- `trip`
    - `trip_id`
    - `started_at`
    - `completed_at`
    - `distance`
    - `fare` (a column that contains nested data)
        - `initial_charge`
        - `subsequent_charge`
        - `surcharge`
        - `tolls`


- `taxi`
    - `taxi_id`
    - `trip_id` (an array)
    - `plate`
    - `company`
    - `license_expiration_date`
    - `licensed_to`

### Define nested and repeated columns

You can use the following SQL statements to define tables based on the two schemas.

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

### Add data to nested and repeated columns

The sample statements below add values to the `trip` and `taxi` tables.

```sql
INSERT INTO trip VALUES 
        (
            '1234ABCD', 
            '2022-07-28 11:04:05', 
            '2022-07-28 11:15:22', 
            6.1, 
            (1.0, 4.0, 1.5, 2.0)
        );
```

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

### Access nested and repeated data

To query trips whose tolls are larger than 1.5 USD and the exact toll amount in the `trip` table, use the following SQL statement:

```sql
SELECT id, (fare).tolls 
FROM trip
WHERE (fare).tolls > 1.5; 
```

To query the first trip ID in the `trip_id` array, use the following SQL statement:

```sql
SELECT trip_id[1] 
FROM taxi;
```

