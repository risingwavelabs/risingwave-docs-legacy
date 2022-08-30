---
id: sql-function-aggregate
slug: /sql-function-aggregate
title: Aggregate functions
---


|Function|Argument Type|Return Type|Description|
|---|---|---|---|
|MIN()|smallint, int, bigint, numeric, real, double precision, varchar|Same as argument type|Minimum value of all input values.|
|MAX()|smallint, int, bigint, numeric, real, double precision, varchar|Same as argument type|Maximum value of all input values.|
|SUM()|smallint, int, bigint, numeric, real, double precision|bigint for smallint  or int arguments, numeric for bigint arguments, otherwise the same as the argument data type|Sum of all input values.|
|COUNT()|bool, smallint, int, bigint, numeric, real, double precision, varchar|bigint|Number of input rows for which the value is not null.|
|AVG()|	smallint, int, bigint, numeric, real, double precision|numeric for integer arguments; double precision for float point arguments| Average (arithmetic mean) of all input values|
|STRING_AGG( expression [ORDER BY clause] ) → string|Any valid expression that can resolve to a character string. The ORDER BY clause is optional, which defines the order of concatenated string results.|string|Combines non-null values into a string.|
