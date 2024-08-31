---
id: sql-function-aggregate
slug: /sql-function-aggregate
title: Aggregate functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-aggregate/" />
</head>

Aggregate functions compute a single result from a set of input values.

For details about the supported syntaxes of aggregate expressions, see [Aggregate expressions](../query-syntax/query-syntax-value-exp.md#aggregate-expressions).

## General-purpose aggregate functions

### `array_agg`

Returns an array from input values in which each value in the set is assigned to an array element. The `ORDER BY` clause is optional and specifies the order of rows processed in the aggregation, which determines the order of the elements in the result array.

```sql title=Syntax
array_agg ( expression [ ORDER BY [ sort_expression { ASC | DESC } ] ] ) -> output_array
```

---

### `avg`

Returns the average (arithmetic mean) of the selected values.

```bash title=Syntax
avg ( expression ) -> see description
```

Input types include smallint, int, bigint, numeric, real, and double precision.

Return type is numeric for integer inputs and double precision for float point inputs.

---

### `bool_and`

Returns true if all input values are true, otherwise false.

```bash title=Syntax
bool_and ( boolean ) -> boolean
```

---

### `bool_or`

Returns true if at least one input value is true, otherwise false.

```bash title=Syntax
bool_or ( boolean ) -> boolean
```

---

### `count`

Returns the number of non-null rows.

```bash title=Syntax
count ( expression ) -> bigint
```

The input can be of any supported data type.

---

### `jsonb_agg`

Aggregates values, including nulls, as a JSON array. The `ORDER BY` clause is optional and specifies the order of rows processed in the aggregation, which determines the order of the elements in the result array.

```bash title=Syntax
jsonb_agg ( expression ) -> jsonb
```

Currently, input types include boolean, smallint, int, bigint, real, double precision, varchar and jsonb.

---

### `jsonb_object_agg`

Aggregates name/value pairs as a JSON object.

```bash title=Syntax
jsonb_object_agg ( key , value ) -> jsonb
```

`key`: varchar only.

`value`: Currently supports null, boolean, smallint, int, bigint, real, double precision, varchar, and jsonb.

---

### `max`

Returns the maximum value in a set of values.

```bash title=Syntax
max ( expression ) -> same as input type
```

Input can be of any numeric, string, date/time, or interval type, or an array of these types.

---

### `min`

Returns the minimum value in a set of values.

```bash title=Syntax
min ( expression ) -> same as input type
```

Input can be of any numeric, string, date/time, or interval type, or an array of these types.

---

### `string_agg`

Combines non-null values into a string, separated by `delimiter_string`. The `ORDER BY` clause is optional and specifies the order of rows processed in the aggregation, which determines the order of the elements in the result array.

#### Syntax

```bash title=Syntax
string_agg ( expression, delimiter_string ) -> output_string
```

---

### `sum`

Returns the sum of all input values.

```bash title=Syntax
sum ( expression )
```

Input types include smallint, int, bigint, numeric, real, and double precision.

Return type is bigint for smallint or int inputs, numeric for bigint inputs, otherwise the same as the input data type.

## Aggregate functions for statistics

### `stddev_pop`

Calculates the population standard deviation of the input values. Returns `NULL` if the input contains no non-null values.

```bash title=Syntax
stddev_pop ( expression ) -> output_value
```

---

### `stddev_samp`

Calculates the sample standard deviation of the input values. Returns `NULL` if the input contains fewer than two non-null values.

```bash title=Syntax
stddev_samp ( expression ) -> output_value
```

---

### `var_pop`

Calculates the population variance of the input values. Returns `NULL` if the input contains no non-null values.

```bash title=Syntax
var_pop ( expression ) -> output_value
```

---

### `var_samp`

Calculates the sample variance of the input values. Returns `NULL` if the input contains fewer than two non-null values.

```bash title=Syntax
var_samp ( expression ) -> output_value
```

## Ordered-set aggregate functions

:::note
At present, ordered-set aggregate functions support only constant fraction arguments.
:::

### `mode`

Computes the mode, which is the most frequent value of the aggregated argument. If there are multiple equally-frequent values, it arbitrarily chooses the first one.

```bash title=Syntax
mode () WITHIN GROUP ( ORDER BY sort_expression anyelement ) -> same as sort_expression
```

`sort_expression`: Must be of a sortable type.

This example calculates the mode of the values in `column1` from `table1`.

```sql title=Example
SELECT mode() WITHIN GROUP (ORDER BY column1) FROM table1;
```

---

### `percentile_cont`

:::note
At present, `percentile_cont` is not supported for streaming queries yet.
:::

Computes the continuous percentile, which is a value corresponding to the specified fraction within the ordered set of aggregated argument values. It can interpolate between adjacent input items if needed.

```bash title=Syntax
percentile_cont ( fraction double precision ) WITHIN GROUP ( ORDER BY sort_expression double precision ) -> double precision
```

`fraction`: The fraction value representing the desired percentile. It should be between 0 and 1.

This example calculates the median (50th percentile) of the values in `column1` from `table1`.

```sql title=Example
SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY column1) FROM table1;
```

---

### `percentile_disc`

:::note
At present, `percentile_disc` is not supported for streaming queries yet.
:::

Computes the discrete percentile, which is the first value within the ordered set of aggregated argument values whose position in the ordering equals or exceeds the specified fraction.

```bash title=Syntax
percentile_disc ( fraction double precision ) WITHIN GROUP ( ORDER BY sort_expression anyelement ) -> same as sort_expression
```

`fraction`: The fraction value representing the desired percentile. It should be between 0 and 1.

`sort_expression`: Must be of a sortable type.

This example calculates the 75th percentile of the values in `column1` from `table1`.

```sql title=Example
SELECT percentile_disc(0.75) WITHIN GROUP (ORDER BY column1) FROM table1;
```

## Grouping operation functions

Grouping operation functions are used in conjunction with grouping sets to distinguish result rows. The arguments to the `grouping()` function are not actually evaluated, but they must exactly match expressions given in the `GROUP BY` clause of the associated query level.

### `grouping`

Returns a bit mask indicating which `GROUP BY` expressions are not included in the current grouping set. Bits are assigned with the rightmost argument corresponding to the least-significant bit; each bit is 0 if the corresponding expression is included in the grouping criteria of the grouping set generating the current result row, and 1 if it is not included.

```sql title="Syntax"
grouping ( group_by_expression(s) ) → integer
```

#### Example

```sql title="Create a table"
CREATE TABLE items_sold (brand varchar, size varchar, sales int);
```

```sql title="Insert some data"
INSERT INTO items_sold VALUES ('Foo', 'L', 10),('Foo', 'M', 20),('Bar', 'M', 15),('Bar', 'L', '5');
```

```sql title="Get grouping results"
SELECT brand, size, sum(sales), grouping(brand), grouping(size), grouping(brand,size), count(DISTINCT sales)
FROM items_sold
GROUP BY GROUPING SETS ((brand), (size), ());
------RESULTS
Bar NULL 20 0 1 1 2
Foo NULL 30 0 1 1 2
NULL L 15 1 0 2 2
NULL M 35 1 0 2 2
NULL NULL 50 1 1 3 4
```
