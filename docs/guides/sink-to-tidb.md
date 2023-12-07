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

| RisingWave type | TiDB type |
|-----------------|------------|
| BOOLEAN | BOOLEAN |
| SMALLINT | TINYINT |
| SMALLINT | SMALLINT |
| INT | MEDIUMINT |
| BIGINT | BIGINT |
| REAL | FLOAT |
| DOUBLE | DOUBLE |
| DECIMAL | DECIMAL |
| DATE | DATE |
| TIMESTAMP | DATETIME |
| TIME | TIME |
| TIMESTAMP | TIMESTAMP |
| TIMESTAMPTZ | TIMESTAMP |
| VARCHAR | CHAR |
| BYTEA | BINARY |
| BYTEA | VARBINARY |
| BYTEA | BLOB |
| TEXT | TEXT |
| JSONB | JSON |

:::note
`TIMESTAMPTZ` types in RisingWave will be converted to `TIMESTAMP` when sinked to TiDB. TiDB doesn't natively support `TIMESTAMPTZ`, but it processes timezone conversions during storage and retrieval. For more information, see [Timezone Handling](https://docs.pingcap.com/tidb/stable/data-type-date-and-time#timezone-handling).
:::