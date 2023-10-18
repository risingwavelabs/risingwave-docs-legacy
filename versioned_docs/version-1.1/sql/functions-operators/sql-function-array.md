---
id: sql-function-array
slug: /sql-function-array
title: Array functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-array/" />
</head>

### `array_dims`

Returns the dimensions of *array* as a string. *array* must be one dimensional.

```sql title=Syntax
array_dims ( array ) → string
```

```sql title=Example
array_dims ( array[2,3,4] ) → [1:3]
```

---

### `array_distinct`

Returns an array of the same type as the input array with all duplicate values removed.

```sql title=Syntax
array_distinct(array) → array
```

```sql title=Example
array_distinct(array[1,2,1,1]) → {1,2}
```

---

### `array_length`

Returns the length of *array*.

```sql title=Syntax
array_length(array) → int
```

```sql title=Example
array_length(array[1,2,3,4,1]) → 5
```

---

### `array_length`

Returns the length of the requested array dimension in *array*. *int* must be 1.

```sql title=Syntax
array_length ( array, int ) → int
```

```sql title=Example
array_length ( array[2, 3, 4], 1  ) → 3
```

---

### `array_lower`

Returns the lower bound of the requested array dimension in *array*. (This is always 1 or null.)

```sql title=Syntax
array_lower ( array, int ) → int
```

```sql title=Example
array_lower ( array[2, 3, 4], 1 ) → 1
```

---

### `array_ndims`

Returns the number of dimensions of *array*.

```sql title=Syntax
array_ndims ( array ) → int
```

```sql title=Example
array_ndims ( array[array[2,3], array[4,5]] ) → 2
```

---

### `array_position`

Returns the subscript of the first occurrence of *any_compatible* element in *array*.

```sql title=Syntax
array_position(array, any_compatible) → int
```

```sql title=Example
array_position(array[1,2,3,4,5,6,1,2,3,4,5,6], 4) → 4
```

---

### `array_positions`

Returns an array of the subscripts of all occurrences of *any_compatible* element in *array*.

```sql title=Syntax
array_positions(array, any_compatible) → array
```

```sql title=Example
array_positions(array[1,2,3,4,5,6,1,2,3,4,5,6], 4) → {4, 10}
```

---

### `array_remove`

Returns an array with all occurrences of *any_compatible* element removed. Multidimensional arrays are also supported.

```sql title=Syntax
array_remove(*array, any_compatible) → array
```

```sql title=Example
array_remove(array[array[1],array[2],array[3],array[2]], array[2]) → {{1},{3}}
```

---

### `array_replace`

Returns an array with all occurrences of *current_element* replaced with *new_element*. Multidimensional arrays are also supported. When the array is multidimensional, the element must be an array of one less dimension. Recursively replacing the base element of a multidimensional array is not supported.

```sql title=Syntax
array_replace(array, current_element, new_element) → array
```

```sql title=Example
array_replace(array[7, null, 8, null], null, 0.5) → {7,0.5,8,0.5}
```

---

### `array_to_string` and `array_join`

Converts an array to a string. The optional *delimiter_string* separates the array's elements in the resulting string, and the optional *null_string* represents `NULL` elements in the array. `array_join` can also be used instead of `array_to_string`.

```sql title=Syntax
array_to_string(array, delimiter_string, null_string) → string 

array_join(array, delimiter_string, null_string) → string
```

```sql title=Example
array_to_string(array[1, 2, 3, NULL, 5], ',', '*') → 1,2,3,*,5 

array_join(array[1, 2, 3, NULL, 5], ',', '*') → 1,2,3,*,5
```

---

### `array_upper`

Returns the upper bound of the requested array dimension in *array*. *int* must be `1`. (This will return the same value as `array_length`.)

```sql title=Syntax
array_upper ( array, int ) → int
```

```sql title=Example
array_upper ( array[array[2, 3, 4], array[3, 4, 5]], 1 ) → 2
```

---

### `cardinality`

Returns the total number of elements in *array* or 0 if the array is empty.

```sql title=Syntax
cardinality(array) → int
```

```sql title=Example
cardinality(array[array[array[3,4,5],array[2,2,2]],array[array[6,7,8],array[0,0,0]]]) → 12
```

---

### `string_to_array`

Converts a string to an array. The optional *delimiter_string* separates the *string*'s elements to create the resulting array, and the optional *null_string* represents `NULL` elements in the array.

```sql title=Syntax
string_to_array(string, delimiter_string, null_string) → array
```

```sql title=Example
string_to_array('a b c', ' ', 'a') → {NULL,b,c}
```

---

### `trim_array`

Trims an array by removing the last n elements. If the array is multidimensional, only the first dimension is trimmed.

```sql title=Syntax
trim_array(array, num_of_elements_to_trim) → array
```

```sql title=Example
trim_array(array[1,2,3,4,5,NULL], 4) → {1,2}
```

---

### `unnest`

Expands an array, or combination of arrays, into a set of rows. The array's elements are output in the order they are stored.

```sql title=Syntax
unnest(array) → set_of_any_element
```

```sql title=Example
unnest(Array[Array[1,3,4,5],Array[2,3]]) → 
1
3
4
5
2
3
```



