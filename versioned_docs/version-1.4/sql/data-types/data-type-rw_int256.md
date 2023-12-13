---
id: data-type-rw_int256
slug: /data-type-rw_int256
title: rw_int256
description: rw_int256 is a custom data type that represents a signed 256-bit integer with a storage size of 32 bytes.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-type-rw_int256/" />
</head>

:::note Beta Feature
`rw_int256` data type is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

:::note
`rw_int256` values can be very large, and therefore require more memory and processing power compared to smaller data types.
:::

## Overview

`rw_int256` is a custom data type that represents a signed 256-bit integer with a storage size of 32 bytes.

It is designed to handle large integer values, and can be useful in financial calculations, cryptography, and data analysis.

## Usage

You can define a column with the `rw_int256` type:

```sql title=Syntax
CREATE TABLE table_name (column_name rw_int256);
```

```sql title=Example
CREATE TABLE t (v rw_int256);
INSERT INTO t VALUES (1), (100), (10000), (100000000), (10000000000000000), ('100000000000000000000000000000000'), (0), (-1), (-100), (-10000), (-100000000), (-10000000000000000), ('-100000000000000000000000000000000');
```

## Casting

You can also convert other data types to `rw_int256`:

```sql
cast ('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe' AS rw_int256);
-- or
'10000000000000000' :: rw_int256;
```

Or convert `rw_int256` to `double`.

## Supported functions

### `count`

Returns the number of non-null rows.

```sql title=Syntax
count ( [ DISTINCT ] rw_int256 ) -> bigint
```

```sql title=Example
SELECT count(v) FROM t;
```

```
13
```

---

### `min`

Returns the minimum value in a set of values.

```sql title=Syntax
min ( rw_int256 ) -> rw_int256
```

```sql title=Example
SELECT min(v) FROM t;
```

```
-100000000000000000000000000000000
```

---

### `max`

Returns the maximum value in a set of values.

```sql title=Syntax
max ( rw_int256 ) -> rw_int256
```

```sql title=Example
SELECT max(v) FROM t;
```

```
100000000000000000000000000000000
```

---

### `sum`

Returns the sum of all input values.

```sql title=Syntax
sum ( [ DISTINCT ] rw_int256 ) -> rw_int256
```

```sql title=Example
SELECT sum(v) FROM t;
```

```
0
```

---

### `avg`

Returns the average (arithmetic mean) of the selected values.

```sql title=Syntax
avg ( [ DISTINCT ] rw_int256 ) -> double
```

```sql title=Example
SELECT avg(v) FROM t;
```

```
0
```

---

### `hex_to_int256`

Converts a hexadecimal string to a 256-bit integer.

```sql title=Syntax
hex_to_int256 ( string ) -> rw_int256
```

```sql title=Example-1
SELECT hex_to_int256('0xdeadbeef');
```

```
3735928559
```

```sql title=Example-2
SELECT hex_to_int256('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01');
```

```
-255
```

---

### Standard deviation and variance

Returns population standard deviation, sample standard deviation, population variance, and sample variance.

```sql title=Signature
stddev_pop ( rw_int256 ) -> double -- standard deviation
stddev_samp ( rw_int256 ) -> double -- sample standard deviation
var_pop ( rw_int256 ) -> double -- population variance
var_samp ( rw_int256 ) -> double -- sample variance
```

```sql title=Example
SELECT stddev_pop(v), stddev_samp(v), var_pop(v), var_samp(v) FROM t;
```

```
       stddev_pop       |     stddev_samp      |        var_pop         |        var_samp        
------------------------+----------------------+------------------------+------------------------
 3.9223227027636808e+31 | 4.08248290463863e+31 | 1.5384615384615386e+63 | 1.6666666666666666e+63
(1 row)
```
