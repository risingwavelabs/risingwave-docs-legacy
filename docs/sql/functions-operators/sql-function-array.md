---
id: sql-function-array
slug: /sql-function-array
title: Array functions
---

|Function|Description|Example|
|---|---|---|
| array_to_string(*any_array*, *delimiter_string*, *null_string*) → *output_string* <br /><br /> array_join(*any_array*, *delimiter_string*, *null_string*) → *output_string* |Converts an array to a string. The optional *delimiter_string* separates the array's elements in the resulting string, and the optional *null_string* represents `NULL` elements in the array. `array_join` can also be used instead of `array_to_string`.|`array_to_string(array[1, 2, 3, NULL, 5], ',', '*')` → `1,2,3,*,5` <br /> `array_join(array[1, 2, 3, NULL, 5], ',', '*')` → `1,2,3,*,5`|
| unnest(*any_array*) → *set_of_any_element* |Expands an array, or combination of arrays, into a set of rows. The array's elements are output in the order they are stored.|`unnest(Array[1,2,3])` → <br />`1`<br />`2`<br />`3` <br /> `unnest(Array[Array[1,3,4,5],Array[2,3]])` → <br />`1`<br />`3`<br />`4`<br />`5`<br />`2`<br />`3`|