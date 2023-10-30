---
id: sql-function-conditional
slug: /sql-function-conditional
title: Conditional expressions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-conditional/" />
</head>

## `CASE`
Goes through conditions in sequence and returns the value of the result associated with the matching condition.

### Syntax 1
```sql
CASE 
    WHEN condition THEN result 
    [ ... ]
    [ ELSE result ]
END
```

#### Parameters
| Parameter | Description |
| --------- | ----------- |
| *condition* | An expression that evaluates to a BOOLEAN value. |
|*result*| A value or an expression that evaluates to a value. <br/> The **CASE** expression returns *result* if its associated *condition* evaluates to true. |

#### Returns
- The *result* associated with the first *condition* that evaluates to true. Or,
- The *result* in the **ELSE** clause if no *condition* evaluates to true. Or,
- NULL if there is no **ELSE** clause and no *condition* evaluates to true.

### Syntax 2
```sql
CASE expression
    WHEN value THEN result 
    [ ... ]
    [ ELSE result ]
END
```
#### Parameters
| Parameter | Description |
| --------- | ----------- |
| *expression* | An expression that evaluates to a value. <br/> *expression* is computed in the first place and its value will be compared with *value* in the **WHEN** clause. |
| *value* | A value or an expression that evaluates to a value. <br/> Each value is a potential match for the *expression*. |
|*result*| A value or an expression that evaluates to a value. <br/> The **CASE** expression returns *result* if its associated *value* matches the *expression*. |

#### Returns
- The *result* associated with the first *value* that matches the *expression*. Or,
- The *result* in the **ELSE** clause if no *value* matches the *expression*. Or,
- NULL if there is no **ELSE** clause and no *value* matches the *expression*.


#### Example
The following statement (using Syntax 1) classifies the distance of each trip in the table 'taxi_trips' into four levels.

```sql
SELECT id, distance,
  CASE 
    WHEN (distance < 3) THEN 'short'
    WHEN (distance >= 3 AND distance < 10) THEN 'mid'
    WHEN (distance >= 10 AND distance < 20) THEN 'long'
    WHEN (distance >= 20) THEN 'extra'
  END AS "Category"
  FROM taxi_trips;
```
```
 id | distance | Category 
----+----------+----------
  1 |       16 | long
  2 |       23 | extra
  3 |        6 | mid
  4 |        9 | mid
```

The following statement (using Syntax 2) classifies the distance of each trip according to its digits.

```sql
SELECT id, distance,
  CASE LENGTH (distance::VARCHAR)
    WHEN  1 THEN 'One-digit'
    WHEN  2 THEN 'Double-digit'
    WHEN  3 THEN 'Three-digit'
  END AS Digit
  FROM taxi_trips;
```
```
 id | distance |    Digit     
----+----------+--------------
  1 |       16 | Double-digit
  2 |       23 | Double-digit
  3 |        6 | One-digit
  4 |        9 | One-digit
(4 rows)
```

## `COALESCE`
Returns the first non-null value or null if all values are null.

#### Syntax

```sql
COALESCE ( value [ , ... ] )
```


## `NULLIF`
Returns null if *value1* equals to *value2*, otherwise returns *value1*.
#### Syntax

```sql
NULLIF ( value1, value2 )
```

## `greatest`

This function returns the largest value in a list of expressions. NULL values in the argument list are ignored. The result will be NULL only if all the expressions evaluate to NULL.

```sql title=Syntax
greatest(value1, value2, ...) → ANY
```

```sql title=Examples
create table t(id INT, v1 INT2, v2 INT4, v3 INT8);

insert into t values (1, 1, 2, 3), (2, 2, NULL, 5), (3, NULL, NULL, 8), (4, NULL, NULL, NULL);

greatest(1, 2, 3) → 3

select greatest(v1, v2, v3) from t order by id;
-- results: 3, 5, 8, NULL
``` 

## `least`

This function returns the smallest value in a list of expressions. NULL values in the argument list are ignored. The result will be NULL only if all the expressions evaluate to NULL.

```sql title=Syntax
least(value1, value2, ...) → ANY
```

```sql title=Examples
create table t(id INT, v1 INT2, v2 INT4, v3 INT8);

insert into t values (1, 1, 2, 3), (2, 2, NULL, 5), (3, NULL, NULL, 8), (4, NULL, NULL, NULL);

select least(1, 2, 3); -- results: 1

select least(v1, v2, v3) from t order by id; -- results: 1, 2, 8, NULL
``` 
