---
id: sql-function-aggregate
slug: /sql-function-aggregate
title: Aggregate functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-aggregate/" />
</head>

Aggregate functions compute a single result from a set of input values. 

The DISTINCT option, ORDER BY clauses, and FILTER clauses can be used in aggregate expressions. The DISTINCT option cannot be used with an ORDER BY clause. For details about the supported syntax, see [Aggregate expressions](/sql/query-syntax/query-syntax-value-exp.md/#aggregate-expressions).


|Function|Description|
|---|---|
|array_agg( *expression* [ ORDER BY [ sort_expression \{ASC \| DESC\} ] ] ) → *output_array*| Returns an array from input values in which each value in the set is assigned to an array element. The `ORDER BY` clause is optional and specifies the order of rows processed in the aggregation, which determines the order of the elements in the result array.|
|avg( *expression* ) → see description| Returns the average (arithmetic mean) of the selected values. Input types include smallint, int, bigint, numeric, real, and double precision. Return type is numeric for integer inputs and double precision for float point inputs.|
|count( *expression* ) → bigint|Returns the number of non-null rows. Input types include bool, smallint, int, bigint, numeric, real, double precision, and string.|
|max( *expression* ) → same as input type|Returns the maximum value in a set of values. Input types include smallint, int, bigint, numeric, real, double precision, and string.|
|min( *expression* ) → same as input type|Returns the minimum value in a set of values. Input types include smallint, int, bigint, numeric, real, double precision, and string.|
|string_agg( *expression*, *delimiter_string* ) → *output_string*|Combines non-null values into a string, separated by *delimiter_string*.|
|sum ( *expression* )|Returns the sum of all input values. Input types include smallint, int, bigint, numeric, real, and double precision. Return type is bigint for smallint or int inputs, numeric for bigint inputs, otherwise the same as the input data type.|
