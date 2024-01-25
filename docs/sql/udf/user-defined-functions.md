---
id: user-defined-functions
slug: /user-defined-functions
title: User-defined functions
description: Define your own functions with the help of the RisingWave UDF API.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/user-defined-functions/" />
</head>

You can define your own functions (including table functions) and call these functions in RisingWave. With the user-defined function (UDF), you can tailor RisingWave to your needs.

At present, there are two ways to define your UDF. The first option is to use it as an external function, leveraging the capabilities of languages such as Python and Java to perform advanced data processing and analysis tasks. The second option is to use a SQL UDF. Currently, we support basic anonymous SQL UDFs and are actively working on enhancing the capabilities of SQL UDFs.

:::note Beta feature
UDF is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

## UDFs as external functions

RisingWave supports creating UDFs with the following programming languages:

- [Python](/sql/udf/udf-python.md)

- [Java](/sql/udf/udf-java.md)

## SQL UDFs

For details about how to create a SQL UDF and its use cases, see:

- [`CREATE FUNCTION`](/sql/commands/sql-create-function.md)

## See also

You may also use UDFs to query data stored in different databases

- [Query foreign data](/sql/udf/udf-foreign-data.md)
