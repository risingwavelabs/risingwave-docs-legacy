---
id: sink-to-tidb
title: Sink data from RisingWave to TiDB with the JDBC connector
description: Sink data from RisingWave to TiDB with the JDBC connector.
slug: /sink-to-tidb
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-tidb/" />
</head>

As TiDB is compatible with MySQL, you can sink data to TiDB the same way you would sink data to MySQL with the JDBC connector. 

For the syntax, settings, and examples, see [Sink data from RisingWave to MySQL with the JDBC connector](sink-to-mysql.md).

### Data type mapping

The following table shows the corresponding data types between RisingWave and TiDB. For details on native RisingWave data types, see [Overview of data types](../sql/sql-data-types.md).

| TiDB type  | RisingWave type |
|------------|-----------------|
| BOOLEAN | BOOLEAN |
| TINYINT | SMALLINT |
| SMALLINT | SMALLINT |
| MEDIUMINT | INT |
| BIGINT | BIGINT |
| FLOAT | REAL |
| DOUBLE | DOUBLE |
| DECIMAL | DECIMAL |
| DATE | DATE |
| DATETIME | TIMESTAMP |
| TIME | TIME |
| TIMESTAMP | TIMESTAMP |
| CHAR | VARCHAR |
| BINARY | BYTEA |
| VARBINARY | BYTEA |
| BLOB | BYTEA |
| TEXT | TEXT |
| JSON | JSONB |