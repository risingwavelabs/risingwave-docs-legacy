---
id: data-type-jsonb
slug: /data-type-jsonb
title: JSONB
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-type-jsonb/" />
</head>

Use the `JSONB` data type to create a column that can store JSON data.

Notes:

- Numbers not representable by IEEE 754 double precision floating point may have poor interoperability, notably numbers in the `bigint` type larger than `(2**53)-1`.
- Avoid using a `JSONB` column for `GROUP BY` and `ORDER BY` clauses or `PRIMARY` and `INDEX` keys. The exact behavior may change in the future.
  - The suggested usage is to extract the target field and cast to a simple type.
- If you have JSON data contained in a string..
  * use `STRUCT` if the schema is known,
  * or use `VARCHAR` and convert it into `JSONB` later.

## Define a JSONB type

Syntax:
`JSONB`

### Examples

The statement below creates a table `x` that contains a `JSONB` column named `j_data`.

```sql
CREATE TABLE x (j_data JSONB, d INTEGER);
```

The statement below creates a table `y` that contains a `JSONB` column named `metadata`.

```sql
CREATE TABLE y (id VARCHAR, metadata JSONB);
```

Below is a real world example.

```sql
CREATE TABLE product (
        name VARCHAR,
        price NUMERIC,
        attributes JSONB
        );
```

## Add values to a JSONB column

To add values to a `JSONB` column, simply write the JSON as a string. For example, `'{"key": "value"}'`.

### Examples

The statement below adds values to table `x`.

```sql
INSERT INTO x VALUES ('{"a": 3, "b": 4}', 5);
```

The statement below adds values to table `y`.

```sql
INSERT INTO y VALUES ('ABCD1234', '{"color": "blue", "size": "M"}');
```

The statement below adds values to table `product`.

```sql
INSERT INTO product (name, price, attributes)
VALUES 
        (
            'T-Shirt', 
            19.99, 
            '{"color": "red", "size": "L"}'
        );
```

## Retrieve data from a JSONB column and casting

To retrieve data from a `JSONB` column, use the `->` or `->>` operators to access the JSON object's properties. The `->` operator returns a `jsonb` value, while the `->>` operator returns a varchar value.

For details about the JSON operators, see [JSON operators](/sql/functions-operators/sql-function-json.md#json-operators).

`JSONB` data types can be cast to other data types such as bool, smallint, int, bigint, decimal, real, and double precision. Casting is performed using the `::data-type` cast notation, such as `::int` for casting to an integer data type.

### Examples

Here are some examples for retrieving data and casting:

```sql
INSERT INTO product VALUES ('USB cable', 4.99, '{"lengthInFeet": 3, "backorder": true, "brand": "sin90", "compatible": ["pc", "mac", "phone"]}');

SELECT
  (attributes -> 'lengthInFeet')::INT * 30.48 AS cm,
  NOT (attributes -> 'backorder')::BOOL AS available,
  UPPER(attributes ->> 'brand') AS brand_good,
  UPPER((attributes -> 'brand')::VARCHAR) AS brand_bad,
  attributes -> 'compatible'
FROM product;

-----Result

  cm   | available | brand_good | brand_bad |        ?column?        
-------+-----------+------------+-----------+------------------------
 91.44 | f         | SIN90      | "SIN90"   | ["pc", "mac", "phone"]
(1 row)

```

The output shows that the `brand_bad` column contains additional double quotes. So when the target column is a varchar, stick to the dedicated operator `->>` directly rather than using the cast. Only cast a boolean or a number.

## JSONB functions and operators

For the full list of JSONB functions and operators, see [JSON functions and operators](/sql/functions-operators/sql-function-json.md).
