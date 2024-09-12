---
id: sql-function-map
slug: /sql-function-map
title: Map functions and operators
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-array/" />
</head>

## Map functions

### `map_from_entries`

Constructs a map from an array of key-value pairs.

```sql title=Syntax
map_from_entries ( array ) → map
```

```sql title=Example
map_from_entries(array[row('key1',1), row('key2',2), row('key3',3)]) -> {key1:1,key2:2,key3:3}
```

---

### `map_from_key_values`

Constructs a map from an array of keys and an array of values.

```sql title=Syntax
map_from_key_values ( array, array ) → map
```

```sql title=Example
map_from_key_values(array['key1','key2','key3'], array[1,2,3]) -> {key1:1,key2:2,key3:3}
```

---

### `map_entries` / `map_keys` / `map_values`

Returns an array of key-value pairs, keys, or values of the map.

```sql title=Syntax
map_entries ( map ) → array
map_keys ( map ) → array
map_values ( map ) → array
```

```sql title=Example
map_entries(MAP{1:100,2:200}) -> array[row(1,100),row(2,200)]
map_keys(MAP{1:100,2:200}) -> array[1,2]
map_values(MAP{1:100,2:200}) -> array[100,200]
```

---

### `map_length`

Returns the number of key-value pairs in the map.

```sql title=Syntax
map_length ( map ) → int
```

```sql title=Example
map_length(MAP{1:100,2:200}) -> 2
```

---

### `map_contains`

Returns true if the map contains the given key, false otherwise.

```sql title=Syntax
map_contains ( map, key ) → boolean
```

```sql title=Example
map_contains(MAP{1:100,2:200}, 1) -> true
map_contains(MAP{1:100,2:200}, 3) -> false
```

---

### `map_access`

Returns the value of the map for the given key. Returns null if the key is not found.

```sql title=Syntax
map_access ( map, key ) → value
```

```sql title=Example
map_access(MAP{1:100,2:200}, 1) -> 100
map_access(MAP{1:100,2:200}, 3) -> null
```

---

### `map_insert`

Inserts a key-value pair into the map. If the key is already present, the value is updated.

```sql title=Syntax
map_insert ( map, key, value ) → map
```

```sql title=Example
map_insert(MAP{1:100,2:200}, 3, 300) -> {1:100,2:200,3:300}
map_insert(MAP{1:100,2:200}, 1, 101) -> {2:200,1:101}
```

---

### `map_delete`

Deletes a key-value pair from the map. No-op if the key is not found.

```sql title=Syntax
map_delete ( map, key ) → map
```

```sql title=Example
map_delete(MAP{1:100,2:200}, 1) -> {2:200}
map_delete(MAP{1:100,2:200}, 3) -> {1:100,2:200}
```

---

### `map_concat`

Concatenates two maps. If the same key is present in both maps, the value from the second map is used.

```sql title=Syntax
map_cat ( map, map ) → map
```

```sql title=Example
map_cat(MAP{1:100,2:200}, MAP{2:201,3:300}) -> {1:100,2:201,3:300}
```

## Map operators

### `map [key] -> value`

Alias of `map_access`.

```sql title=Example
MAP{1:100,2:200}[1] → 100
MAP{1:100,2:200}[3] → null
```
