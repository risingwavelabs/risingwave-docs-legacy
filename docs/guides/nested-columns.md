---
id: nested-columns
title: Nested columns
description: Define and access nested columns
slug: /nested-columns
---
In RisingWave, a column can contain nested data. This guide describes how to create a column with nested data, how to insert values to such columns, and how to access nested data in RisingWave.

## Define a table with nested columns

To create a column with nested data, set the data type of the column to `STRUCT`. Columns nested under the same column can be in different data types. A nested column can contain nested data.

The schema below includes a nested column `fare` that contains nested data.

- `trip`
    - `trip_id`
    - `started_at`
    - `completed_at`
    - `distance`
    - `fare` (a nested column that contains nested data)
        - `initial_charge`
        - `subsequent_charge`
        - `surcharge`
        - `tolls`
- `taxi`
    - `taxi_id`
    - `plate`
    - `company`
    - `license_expiration_date`
    - `licensed_to`


To define a table with the schema above, you can use the SQL statement below. Statements for creating sources and materialized views with nested columns are similar.

```sql
CREATE TABLE taxi_trips (
    trip STRUCT <
        trip_id VARCHAR,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        distance DOUBLE PRECISION,
        fare STRUCT <
            initial_charge DOUBLE PRECISION,
            subsequent_charge DOUBLE PRECISION,
            surcharge DOUBLE PRECISION,
            tolls DOUBLE PRECISION > 
            >,
    taxi STRUCT <
        taxi_id VARCHAR,
        plate VARCHAR,
        company VARCHAR,
        license_expiration_date DATE,
        licensed_to VARCHAR
        >
    );
```

## Insert values to tables with nested columns

To insert values to tables that contain nested columns, enclose nested data with parentheses. 

The sample statement below inserts values to the "taxi_trip" table above.

```sql
INSERT INTO taxi_trips VALUES 
    (
        (
            '123456CD', 
            '2022-07-28 11:04:05', 
            '2022-07-28 11:15:22', 
            6.1, 
            (1.0, 4.0, 1.5, 2.0)
        ), 
        (
            '234567AB', 
            'N5432N', 
            'FAST TAXI', 
            '2030-12-31', 
            'DAVID WANG'
        )
        );
```

## Access nested data

To access data nested under a column, wrap the column with parenthesis and use the dot operator to specify the nested column. For example, to access the `id` column under `trip` in the `taxi_trips` schema, use `(trip).id`. For a complete example that defines and accesses nested columns, see [Fast Twitter events processing](../tutorials/fast-twitter-events-processing.md).
