---
id: data-type-jsonb
slug: /data-type-jsonb
title: JSONB
---

Use the jsonb data type to create a column that can store JSON data.

Caveats:
  - Numbers not representable by IEEE 754 double precision floating point may have poor interoperability, notably `bigint`s larger than `(2**53)-1`.
  - Avoid using a jsonb column for `GROUP BY`, `ORDER BY`, `PRIMARY`, or `INDEX` keys. The exact behavior may change in the future.
    - The suggested usage is to extract the target field and cast to a simple type.

## Define a jsonb type

Syntax:
`JSONB`

### Examples

The statement below creates a table `x` that contains a jsonb column named `j_data`.

```sql
CREATE TABLE x (j_data JSONB, d INTEGER);
```

The statement below creates a table `y` that contains a jsonb column named `metadata`.

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


## Add values to a jsonb column

To add values to a jsonb column, simply write the JSON as a string. For example, `'{"key": "value"}'`.

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


## Retrieve data from a jsonb column and casting

To retrieve data from a jsonb column, use the `->` or `->>` operators to access the JSON object's properties. The `->` operator returns a jsonb value, while the `->>` operator returns a text value.

Jsonb data types can be cast to other data types such as bool, smallint, int, bigint, decimal, real, and double precision. Casting is performed using the `::data-type` cast notation, such as `::int` for casting to an integer data type.

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
```



## Operators

The following operators represent a transformation process involving extraction, casting, and reconversion between jsonb and other data types.

`jsonb -> int -> jsonb` <br />
`jsonb -> varchar -> jsonb` <br />
`jsonb ->> int -> varchar` <br />
`jsonb ->> varchar -> varchar` <br />


## Functions

`jsonb_typeof(jsonb) -> varchar` <br />
`jsonb_array_length(jsonb) -> int`