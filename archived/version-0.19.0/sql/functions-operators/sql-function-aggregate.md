---
id: sql-function-aggregate
slug: /sql-function-aggregate
title: Aggregate functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-aggregate/" />
</head>

Aggregate functions compute a single result from a set of input values.

The DISTINCT option, ORDER BY clauses, and FILTER clauses can be used in aggregate expressions. The DISTINCT option cannot be used with an ORDER BY clause. For details about the supported syntax, see [Aggregate expressions](/sql/query-syntax/query-syntax-value-exp.md#aggregate-expressions).

---  

### `array_agg`

Returns an array from input values in which each value in the set is assigned to an array element. The `ORDER BY` clause is optional and specifies the order of rows processed in the aggregation, which determines the order of the elements in the result array.

```sql title=Syntax
array_agg ( expression [ ORDER BY [ sort_expression { ASC | DESC } ] ] ) -> output_array       
```  

---  

### `avg`

Returns the average (arithmetic mean) of the selected values.

```sql title=Syntax
avg ( expression ) -> see description   
```  

Input types include smallint, int, bigint, numeric, real, and double precision.

Return type is numeric for integer inputs and double precision for float point inputs.

---  

### `bool_and`

Returns true if all input values are true, otherwise false.

```sql title=Syntax
bool_and ( boolean ) -> boolean
```

---  

### `bool_or`

Returns true if at least one input value is true, otherwise false.

```sql title=Syntax
bool_or ( boolean ) -> boolean
```

---  

### `count`

Returns the number of non-null rows.

```sql title=Syntax  
count ( expression ) -> bigint    
```  

Input types include bool, smallint, int, bigint, numeric, real, double precision, and string.  

---  

### `jsonb_agg`

Aggregates values, including nulls, as a JSON array. The `ORDER BY` clause is optional and specifies the order of rows processed in the aggregation, which determines the order of the elements in the result array.

```sql title=Syntax  
jsonb_agg ( expression ) -> jsonb    
```

Currently, input types include boolean, smallint, int, bigint, real, double precision, varchar and jsonb.

---  

### `jsonb_object_agg`

Aggregates name/value pairs as a JSON object.

```sql title=Syntax  
jsonb_object_agg ( key , value ) -> jsonb   
```

`key`: varchar only.

`value`: Currently supports null, boolean, smallint, int, bigint, real, double precision, varchar and jsonb.

---  

### `max`

Returns the maximum value in a set of values.  

```sql title=Syntax
max ( expression ) -> same as input type    
```  

Input types include smallint, int, bigint, numeric, real, double precision, and string.  

---  

### `min`

Returns the minimum value in a set of values.  

```sql title=Syntax
min ( expression ) -> same as input type  
```  

Input types include smallint, int, bigint, numeric, real, double precision, and string.  

---  

### `stddev_pop`

Calculates the population standard deviation of the input values. Returns `NULL` if the input contains no non-null values.  

```sql title=Syntax
stddev_pop ( expression ) -> output_value
```

---  

### `stddev_samp`

Calculates the sample standard deviation of the input values. Returns `NULL` if the input contains fewer than two non-null values.  

```sql title=Syntax
stddev_samp ( expression ) -> output_value
```

---  

### `string_agg`

Combines non-null values into a string, separated by `delimiter_string`. The `ORDER BY` clause is optional and specifies the order of rows processed in the aggregation, which determines the order of the elements in the result array.

```sql title=Syntax
string_agg ( expression, delimiter_string ) -> output_string  
```

---  

### `sum`

Returns the sum of all input values.  

```sql title=Syntax
sum ( expression )  
```

Input types include smallint, int, bigint, numeric, real, and double precision.

Return type is bigint for smallint or int inputs, numeric for bigint inputs, otherwise the same as the input data type.

---  

### `var_pop`

Calculates the population variance of the input values. Returns `NULL` if the input contains no non-null values.

```sql title=Syntax
var_pop ( expression ) -> output_value
```

---  

### `var_samp`

Calculates the sample variance of the input values. Returns `NULL` if the input contains fewer than two non-null values.

```sql title=Syntax
var_samp ( expression ) -> output_value
```
