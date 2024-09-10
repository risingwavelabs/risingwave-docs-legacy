---
id: data-type-map
slug: /data-type-map
title: Map type
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-type-map/" />
</head>

`MAP(K, V)` stores key-value pairs.

Notes:

- `K`: The type of the Map keys. It can be string or integral types (i.e., `character varying`, `smallint`, `integer`, or `bigint`). It must not be `NULL`, and must be unique in the map.
- `V`: The type of the Map values. It can be arbitrary type.

## Define a map

Create a map with `VARCHAR` keys and `INTEGER` values. 

```sql
SELECT MAP {'key1': 1, 'key2': 2, 'key3': 3};
-----Result
{key1:1,key2:2,key3:3}
```

Alternatively, it can be constructed from two arrays with `map_from_key_values` or from an array of key-value pairs with `map_from_entries`.

```sql
SELECT map_from_key_values(array['key1', 'key2', 'key3'], array[1,2,3]);
-- OR
SELECT map_from_entries(array[row('key1',1), row('key2',2), row('key3',3)]);
```

The following statement defines a table `x` that has a `MAP(VARCHAR, INTEGER)` column.

```sql
CREATE TABLE x (a MAP(VARCHAR, INTEGER));
```

## Access data in a map

Use bracket notation to access the value of a key.

```sql
SELECT MAP {'key1': 1, 'key2': 2, 'key3': 3}['key1'];
-----Result
1
```

## Modify data in a map

Use `map_insert` to insert or overwrite a key-value pair into a map.

```sql
SELECT map_insert(MAP {'key1': 1, 'key2': 2, 'key3': 3}, 'key4', 4);
-----Result
{key1:1,key2:2,key3:3,key4:4}

SELECT map_insert(MAP {'key1': 1, 'key2': 2, 'key3': 3}, 'key2', 4);
-----Result
{key1:1,key3:3,key2:4}
```

## Map functions and operators

For the full list of map functions and operators, see [Map functions and operators](/sql/functions-operators/sql-function-map.md).
