---
id: sql-function-aggregate
slug: /sql-function-aggregate
title: Aggregate functions
---


|Function|Description|
|---|---|
|avg() → see description| Average (arithmetic mean) of all input values. Input types include smallint, int, bigint, numeric, real and double precision. Return type is numeric for integer inputs and double precision for float point inputs.|
|count() → bigint|Number of input rows for which the value is not null. Input types include bool, smallint, int, bigint, numeric, real, double precision, and string.|
|max() → same as input type|Maximum value of all input values. Input types include smallint, int, bigint, numeric, real, double precision, and string.|
|min() → same as input type|Minimum value of all input values. Input types include smallint, int, bigint, numeric, real, double precision, and string.|
|string_agg( *value* string, delimiter ) → string|Combines non-null values into a string, separated by the delimiter. The ORDER BY clause, DISTINCT option, and FILTER clause are optional.|
|sum(smallint) → bigint <br /> sum(int) → bigint <br /> sum(bigint) → numeric <br /> sum(numeric) → same as input type <br /> sum(real) → same as input type <br /> sum(double precision) → same as input type|Sum of all input values. Input types include smallint, int, bigint, numeric, real, and double precision. Return type is bigint for smallint  or int inputs, numeric for bigint inputs, otherwise the same as the input data type.|
