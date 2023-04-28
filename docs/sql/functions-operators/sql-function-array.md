---
id: sql-function-array
slug: /sql-function-array
title: Array functions
---

|Function|Description|Example|
|---|---|---|
| array_distinct(*any_array*) → *output_array* |Returns an array of the same type as the input array with all duplicate values removed.|`array_distinct(array[1,2,1,1])` → <br />`{1,2}`|
| array_length(*any_array*) → *output_int* |Returns the length of the input array.|`array_length(array[1,2,3,4,1])` → <br />`5`|
| array_to_string(*any_array*, *delimiter_string*, *null_string*) → *output_string* <br /><br /> array_join(*any_array*, *delimiter_string*, *null_string*) → *output_string* |Converts an array to a string. The optional *delimiter_string* separates the array's elements in the resulting string, and the optional *null_string* represents `NULL` elements in the array. `array_join` can also be used instead of `array_to_string`.|`array_to_string(array[1, 2, 3, NULL, 5], ',', '*')` → `1,2,3,*,5` <br /> `array_join(array[1, 2, 3, NULL, 5], ',', '*')` → `1,2,3,*,5`|
| cardinality(*any_array*) → *output_int* |Returns the total number of elements in an array or 0 if the array is empty.|`cardinality(array[1,2,3,4,1])` → <br />`5` <br /> `cardinality(array[array[array[3,4,5],array[2,2,2]],array[array[6,7,8],array[0,0,0]]])` → <br />`12`|
| string_to_array(*input_string*, *delimiter_string*, *null_string*) → *output_array* |Converts a string to an array. The optional *delimiter_string* separates the *input_string*'s elements to create the resulting array, and the optional *null_string* represents `NULL` elements in the array.|`string_to_array('a b c', ' ', 'a')` → `{NULL,b,c}`|
| unnest(*any_array*) → *set_of_any_element* |Expands an array, or combination of arrays, into a set of rows. The array's elements are output in the order they are stored.|`unnest(Array[1,2,3])` → <br />`1`<br />`2`<br />`3` <br /> `unnest(Array[Array[1,3,4,5],Array[2,3]])` → <br />`1`<br />`3`<br />`4`<br />`5`<br />`2`<br />`3`|
