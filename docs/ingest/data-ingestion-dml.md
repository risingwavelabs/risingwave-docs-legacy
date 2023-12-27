---
id: data-ingestion-dml
title: Data ingestion with DML
description: RisingWave supports ingesting data using DML (Data Manipulation Language) operations such as INSERT, UPDATE, and DELETE. This document provides an overview of how to use DML for data ingestion and the best practices to follow.
slug: /data-ingestion-dml
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-ingestion-dml/" />
</head>

RisingWave supports ingesting data using DML (Data Manipulation Language) operations such as INSERT, UPDATE, and DELETE. This document provides an overview of how to use DML for data ingestion and the best practices to follow.

## Using DML for data ingestion

DML operations can be used for data ingestion in RisingWave in the following ways:

- **INSERT**: To add new data to a normal table (i.e. table without connector settings) in RisingWave.
- **UPDATE**: To modify existing data in a normal table in RisingWave.
- **DELETE**: To remove data from a normal table in RisingWave.

## Best practices for using DML for data ingestion

When using DML for data ingestion, consider the following best practices:

1. **Batch operations**: Group together multiple DML operations to improve performance.
2. **Use prepared statements**: If the same DML operation is executed multiple times, use a prepared statement to improve performance.
3. **Error handling**: Include error handling in your DML operations to handle any issues that might occur during data ingestion.
4. **Use transactions**: Group together DML operations that need to be executed together into a transaction to maintain data integrity.
5. **Consider indexes**: If the ingested data is frequently queried, consider creating indexes on the queried columns to improve query performance.
6. **Monitor performance**: Regularly monitor the performance of your DML operations and make adjustments as necessary.

## Common use cases for using DML for data ingestion

DML operations can be used for data ingestion in RisingWave in the following scenarios:

1. **Data correction**: Use UPDATE to correct errors in the ingested data.
2. **Data deletion**: Use DELETE to remove data that should not have been ingested.
3. **Data insertion**: Use INSERT to add additional data to RisingWave, especially when adding small amounts of data.
4. **Data transformation**: Use DML operations to transform the data in RisingWave.
5. **Testing and development**: During testing and development, use DML operations to insert test data into RisingWave.

Remember, these are general use cases and might need to be adjusted based on your specific needs and data.