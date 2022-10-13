---
id: sql-function-array
slug: /sql-function-array
title: Array functions
---

|Function|Description|Example|
|---|---|---|
| unnest(*any_array*) → *set_of_any_element* |Expands an array, or combination of arrays, into a set of rows. The array's elements are output in the order they are stored.|`unnest(Array[1,2,3])` → <br />`1`<br />`2`<br />`3` <br /> `unnest(Array[Array[1,3,4,5],Array[2,3]])` → <br />`1`<br />`3`<br />`4`<br />`5`<br />`2`<br />`3`|