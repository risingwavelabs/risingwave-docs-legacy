---
id: sql-function-array
slug: /sql-function-array
title: Array functions and operators
description: Manage lists and collections of data.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-array/" />
</head>

## Array functions

### `array_append`

Appends *any_compatible* to the end of the input array.

```sql title=Syntax
array_append ( array, any_compatible ) → array
```

```sql title=Example
array_append(array[66], 123) → {66, 123}
```

---

### `array_cat`

Concatenates two arrays with the same data type.

If the one of the input arrays is a 2-dimensional array, the other array will be appended within the first array as the last element if it is the second argument. The other array will be prepended within the first array as the first element if it is the first argument.

```sql title=Syntax
array_cat ( array, array ) → array
```

```sql title=Example
array_cat(array[66], array[123]) → {66, 123}

array_cat(array[array[66]], array[233]) → {{66}, {233}}

array_cat(array[233], array[array[66]]) → {{233}, {66}}
```

---

### `array_dims`

Returns the dimensions of an array as a string. The array must be one dimensional.

```sql title=Syntax
array_dims ( array ) → string
```

```sql title=Example
array_dims(array[2,3,4]) → [1:3]
```

---

### `array_distinct`

Returns an array of the same type as the input array with all duplicate values removed.

```sql title=Syntax
array_distinct ( array ) → array
```

```sql title=Example
array_distinct(array[1,2,1,1]) → {1,2}
```

---

### `array_length`

This function has two variants.

#### `array_length ( array )`

Returns the length of *array*.

```sql title=Syntax
array_length ( array ) → int
```

```sql title=Example
array_length(array[1,2,3,4,1]) → 5
```

#### `array_length ( array int )`

Returns the length of the requested array dimension in *array*. *int* must be 1.

```sql title=Syntax
array_length ( array, int ) → int
```

```sql title=Example
array_length(array[2, 3, 4], 1) → 3
```

---

### `array_lower`

Returns the lower bound of the requested array dimension in *array*. (This is always 1 or null.)

```sql title=Syntax
array_lower ( array, int ) → int
```

```sql title=Example
array_lower(array[2, 3, 4], 1) → 1
```

---

### `array_max`

Returns the maximum value in an array.

Null elements are skipped, but if the array contains only null elements, NULL is returned.

```sql title=Syntax
array_max ( array ) → type of the elements
```

```sql title=Example
array_max(array[3.14, 1.14, 1.14514]) → 3.14

array_max(array[date'2002-10-30', date'2023-09-06', date'2017-06-18']) → 2023-09-06

array_max(array['','']) → empty

array_max(array['a', 'b', NULL, 'c']) → c

array_max(array[NULL]) → NULL
```

---

### `array_min`

Returns the minimum value in an array.

Null elements are skipped, but if the array contains only null elements, NULL is returned.

```sql title=Syntax
array_min ( array ) → type of the elements
```

```sql title=Example
array_min(array['a', 'b', 'c']) → a

array_min(array[date'2002-10-30', date'2023-09-06', date'2017-06-18']) → 2002-10-30

array_min(array['','']) → empty

array_min(array['a', 'b', NULL, 'c']) → a

array_min(array[NULL]) → NULL
```

---

### `array_ndims`

Returns the number of dimensions of *array*.

```sql title=Syntax
array_ndims ( array ) → int
```

```sql title=Example
array_ndims(array[array[2, 3], array[4, 5]]) → 2
```

---

### `array_position`

Returns the subscript of the first occurrence of *any_compatible* element in *array*.

```sql title=Syntax
array_position ( array, any_compatible ) → int
```

```sql title=Example
array_position(array[1,2,3,4,5,6,1,2,3,4,5,6], 4) → 4
```

---

### `array_positions`

Returns an array of the subscripts of all occurrences of *any_compatible* element in *array*.

```sql title=Syntax
array_positions ( array, any_compatible ) → array
```

```sql title=Example
array_positions(array[1,2,3,4,5,6,1,2,3,4,5,6], 4) → {4, 10}
```

---

### `array_prepend`

Prepends *any_compatible* to the beginning of the input array.

```sql title=Syntax
array_prepend ( any_compatible, array ) → array
```

```sql title=Example
array_prepend(123, array[66]) → {123, 66}

```

---

### `array_remove`

Returns an array with all occurrences of *any_compatible* element removed. Multidimensional arrays are also supported.

```sql title=Syntax
array_remove ( array, any_compatible ) → array
```

```sql title=Example
array_remove(array[array[1],array[2],array[3],array[2]], array[2]) → {{1},{3}}
```

---

### `array_replace`

Returns an array with all occurrences of *current_element* replaced with *new_element*. Multidimensional arrays are also supported. When the array is multidimensional, the element must be an array of one less dimension. Recursively replacing the base element of a multidimensional array is not supported.

```sql title=Syntax
array_replace ( array, current_element, new_element ) → array
```

```sql title=Example
array_replace(array[7, null, 8, null], null, 0.5) → {7,0.5,8,0.5}
```

---

### `array_sort`

Sorts the elements of an array in ascending order.

```sql title=Syntax
array_sort ( array ) → array
```

```sql title=Example
array_sort(array[-1000, 2000, 0]) → {-1000,0,2000}

array_sort(array['abcdef', 'aacedf', 'aaadef']) → {aaadef,aacedf,abcdef}

array_sort(array[3, 2, NULL, 1, NULL]) → {1,2,3,NULL,NULL}
```

---

### `array_sum`

Returns the sum of the values in the array. Null elements are skipped.

```sql title=Syntax
array_sum ( array ) → type of the elements
```

```sql title=Example
array_sum(array[3, 2, NULL]) → 5

array_sum(array[-10, 20, -30]) → -20

array_sum(array[interval'4 hour', interval'3 day']) → '3 days 04:00:00'
```

---

### `array_to_string` and `array_join`

Converts an array to a string. The optional *delimiter_string* separates the array's elements in the resulting string, and the optional *null_string* represents `NULL` elements in the array. `array_join` can also be used instead of `array_to_string`.

```sql title=Syntax
array_to_string ( array, delimiter_string, null_string ) → string

array_join(array, delimiter_string, null_string) → string
```

```sql title=Example
array_to_string (array[1, 2, 3, NULL, 5], ',', '*') → 1,2,3,*,5

array_join(array[1, 2, 3, NULL, 5], ',', '*') → 1,2,3,*,5
```

---

### `array_transform`

This function takes an array, transforms the elements, and returns the results in a new array. The output array always has the same length as the input array.

```sql title=Syntax
array_transform ( array_expression, lambda_expression )

lambda_expression:
| element_alias | transform_expression
```

Each element in `array_expression` is evaluated against the `transform_expression`. `element_alias` is an alias that represents an array element.

```sql title="Example A"
SELECT array_transform('{1,2,3}'::int[], |x| (x::double precision+0.5));
------RESULT
{1.5,2.5,3.5}
```

```sql title="Example B"
SELECT array_transform(
    ARRAY['Apple', 'Airbnb', 'Amazon', 'Facebook', 'Google', 'Microsoft', 'Netflix', 'Uber'],
    |x| case when x ilike 'A%' then 'A' else 'Other' end
);
------RESULT
{A,A,A,Other,Other,Other,Other,Other}
```

Note that the `transform_expression` does not support referencing columns. For example, if you have a table:

```sql
CREATE TABLE t(v int, arr int[]);
```

The following query will fail.

```sql
select array_transform(arr, |x| x + v) from t;
```

---

### `array_upper`

Returns the upper bound of the requested array dimension in *array*. *int* must be `1`. (This will return the same value as `array_length`.)

```sql title=Syntax
array_upper ( array, int ) → int
```

```sql title=Example
array_upper(array[array[2, 3, 4], array[3, 4, 5]], 1) → 2
```

---

### `cardinality`

Returns the total number of elements in *array* or 0 if the array is empty.

```sql title=Syntax
cardinality ( array ) → int
```

```sql title=Example
cardinality(array[array[array[3,4,5],array[2,2,2]],array[array[6,7,8],array[0,0,0]]]) → 12
```

---

### `string_to_array`

Converts a string to an array. The optional *delimiter_string* separates the *string*'s elements to create the resulting array, and the optional *null_string* represents `NULL` elements in the array.

```sql title=Syntax
string_to_array ( string, delimiter_string, null_string ) → array
```

```sql title=Example
string_to_array('a b c', ' ', 'a') → {NULL,b,c}
```

---

### `trim_array`

Trims an array by removing the last n elements. If the array is multidimensional, only the first dimension is trimmed.

```sql title=Syntax
trim_array ( array, num_of_elements_to_trim ) → array
```

```sql title=Example
trim_array(array[1,2,3,4,5,NULL], 4) → {1,2}
```

---

### `unnest`

Expands an array, or combination of arrays, into a set of rows. The array's elements are output in the order they are stored.

```sql title=Syntax
unnest ( array ) → set_of_any_element
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

## Array operators

### `array @> array -> boolean`

This operator checks if the left array contains all elements of the right array.

```sql title=Example
array[1,2,3] @> array[2,3] → t
```

### `array <@ array -> boolean`

This operator checks if the left array is contained by the right array.

```sql title=Example
array[2,3] <@ array[1,2,3] → t
```

### `array || anycompatible → array`

Appends *any_compatible* to the end of *array*. This operation achieves the same result as using `array_append`.

```sql title=Example
array[66] || 123 → {66, 123}
```

---

### `array || array → array`

Concatenates two arrays with the same data type. This operation achieves the same result as using `array_cat`.

```sql title=Example
array[66] || array[123] → {66, 123}
```

---

### `anycompatible || array → array`

Prepends *any_compatible* to the beginning of *array*. This operation achieves the same result as using `array_prepend`.

```sql title=Example
123 || array[66] → {123, 66}
```
