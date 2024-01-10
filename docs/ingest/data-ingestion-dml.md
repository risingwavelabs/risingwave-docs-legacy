---
id: data-ingestion-dml
title: Ingesting data with DML
description: RisingWave supports ingesting data using DML (Data Manipulation Language) operations such as INSERT, UPDATE, and DELETE. This document provides an overview of how to use DML for data ingestion and the best practices to follow.
slug: /data-ingestion-dml
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-ingestion-dml/" />
</head>

RisingWave supports ingesting data using DML (Data Manipulation Language) operations such as INSERT, UPDATE, and DELETE. This document provides an overview of how to use DML for data ingestion and the best practices to follow.

## Using DML for data ingestion

DML operations can be used for data ingestion in RisingWave in the following ways:

- **INSERT**: To add new data to a table.

- **UPDATE**: To modify existing data in a table. Note that updates are not processed for sources and append-only tables.

- **DELETE**: To remove data from a table. Note that deletes are not processed for sources and append-only tables.

## Common use cases for using DML for data ingestion

DML operations can be used for data ingestion in RisingWave in the following scenarios:

- **Data correction**

  If there are errors in the data ingested into RisingWave, you can use DML statements to correct these errors. For example, you can use an UPDATE statement to correct inaccurate data. Note that updates and deletes are not processed for sources and append-only tables. More details can be found in [CREATE SOURCE](/sql/commands/sql-create-source.md) and [CREATE TABLE](/sql/commands/sql-create-table.md).

- **Data deletion**

  In case certain data has been ingested into RisingWave erroneously, you can use a DELETE statement to eliminate this data. Note that DELETE operations do not apply to sources and append-only tables.

- **Data insertion**

  If you need to add additional data to a table, you can use an INSERT statement. This is particularly useful for adding small amounts of data without needing to create a new data source. However, for large amounts of data, consider creating a source or declaring `append only` on a table, as discussed in the [best practices](1234567890docs.risingwave.com).

- **Data transformation**

  You can use DML statements to transform the data in RisingWave. For example, you can use an UPDATE statement to change the format of a date column. Remember to create indexes on the columns used in the select statement and the where condition to optimize the performance of these transformations.

- **Testing and development**

  During testing and development, it's often easier to use DML statements to insert test data into RisingWave rather than setting up data sources. However, be mindful of the resources allocated to each query, as discussed in the FAQ.

## Best practices for using DML for data ingestion

When using DML for data ingestion, consider the following best practices:

- **Use DML for small amounts of data**

  For large amounts of data, consider creating a source or declaring `append only` on a table. See details in [When to create a source or declare append only on a table?](1234567890docs.risingwave.com).

- **Choosing between Source, Table, and Append-Only Table**

  When connecting to an external upstream system, consider the trade-off between storage space and the ability to modify data. If data modification within RisingWave is not required, consider declaring the data as a source or an append-only table to save storage space. Sources and append-only tables do not process updates or deletes, which can lead to performance optimization. If the data is frequently changing and needs to be updated or deleted, consider using a table. If the data is immutable (like transactions), consider using a source or an append-only table.

- **Consider Indexes**
  
  If the ingested data is frequently queried, consider creating indexes on the queried columns to improve query performance, as discussed in the [best practices](https://docs.risingwave.com/docs/current/best-practices/).

- **Use Transactions**

  Group together DML operations that need to be executed together into a transaction to maintain data integrity. See details in [Transactions](/concepts/transactions.md).

- **Avoid Large Transactions**

  While transactions ensure data integrity, large transactions can lock up resources and impact performance. Try to keep transactions as small and short as possible.

- **Optimize for Write Operations**

  If you're frequently using DML operations for data ingestion, consider optimizing your RisingWave configuration for write operations. This could involve adjusting resource allocation, as discussed in the FAQ.

- **Monitor Performance**

  Regularly monitor the performance of your DML operations and make adjustments as necessary, as discussed in the [FAQ](https://docs.risingwave.com/docs/current/faq/).

- **Materialized Views**

  When creating materialized views, consider the nature of the data. If the data is frequently changing, use a table. If the data is immutable, use a source or an append-only table.