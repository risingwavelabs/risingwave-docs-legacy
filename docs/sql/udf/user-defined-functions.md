---
id: user-defined-functions
slug: /user-defined-functions
title: User-defined functions
description: Define your own functions.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/user-defined-functions/" />
</head>

In modern data processing and analysis, SQL language is a powerful tool for handling structured data. However, as the complexity of data analysis increases, standard SQL statements and built-in functions may not be sufficient to meet all data processing needs. This is where user-defined functions (UDFs) come into play, allowing you to define custom functions to achieve more complex calculations and operations.

## When do you need UDFs

UDFs are crucial when there is a need to perform calculations that cannot be supported by standard SQL functions. Here are some typical scenarios and examples:

- Complex mathematical or statistical calculations, such as calculating the greatest common divisor of two numbers.
- Custom data transformations or validations, such as extracting information from network packets.
- Need to use external services or resources, such as accessing OpenAI API to generate text.
- Migration from existing systems, such as migrating Flink UDFs and implementing functions not currently supported by RisingWave.

It is important to note that UDFs have lower execution efficiency compared to built-in functions due to cross-language communication and data conversion. Therefore, users should always prioritize the use of built-in functions.

## Types of UDFs in RisingWave

At present, there are two ways to define your UDF in RisingWave. The first option is to use it as an external function, leveraging the capabilities of languages such as Python and Java to perform advanced data processing and analysis tasks. The second option is to use a SQL UDF. Currently, we support basic SQL UDFs with named and unnamed parameters, and we are actively working on enhancing the capabilities of SQL UDFs.

:::note Beta feature
UDF is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

### UDFs as external functions

RisingWave supports creating UDFs with the following programming languages:

- [Python](/sql/udf/udf-python.md)

- [Java](/sql/udf/udf-java.md)

- [Rust](/sql/udf/udf-rust.md)

- [JavaScript](/sql/udf/udf-javascript.md)

### SQL UDFs

For details about how to create a SQL UDF and its use cases, see:

- [`CREATE FUNCTION`](/sql/commands/sql-create-function.md)

## See also

You may also use UDFs to query data stored in different databases

- [Query foreign data](/sql/udf/udf-foreign-data.md)
