---
 id: ingest-from-sqlserver-cdc
 title: Ingest data from SQL Server CDC
 description: Describes how to ingest data from SQL Server CDC.
 slug: /ingest-from-sqlserver-cdc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-sqlserver-cdc/" />
</head>

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, and then delivering the changes to a downstream service in real time.

RisingWave supports ingesting CDC data from SQL Server. Versions 2019 and 2022 of SQL Server are supported.

You can ingest CDC data from SQL Server into RisingWave in two ways:

- Using the built-in SQL Server CDC connector

  With this connector, RisingWave can connect to SQL Server databases directly to obtain data from the binlog without starting additional services.

- Using a CDC tool and a message broker
  
  You can use a CDC tool and then use the Kafka, Pulsar, or Kinesis connector to send the CDC data to RisingWave. For more details, see the [Create source via event streaming systems](/ingest/ingest-from-cdc.md) topic.

## Set up SQL Server

Microsoft offers [official images](https://hub.docker.com/r/microsoft/mssql-server) for Microsoft SQL Server based on Ubuntu. Microsoft Azure also provides [Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/) as a managed SQL Server service. In this section, we will demonstrate using a SQL Server instance running in a Docker container and highlight the differences when using Azure SQL Database.

1. [SQL Server Agent](https://learn.microsoft.com/en-us/sql/ssms/agent/sql-server-agent?view=sql-server-ver16) is a tool in SQL Server that can automate and schedule tasks in SQL Server like database backups. The SQL Server connector in RisingWave relys on SQL Server Agent to query the required information of the CDC tables, so make sure that SQL Server Agent is running. You can check by using the following statement.

    ```sql
    SELECT status_desc FROM sys.dm_server_services WHERE servicename LIKE 'SQL Server Agent%';
    ```

    If the status is `RUNNING`, then SQL Server Agent is running. If not, you can start it by running the following statement in the SQL Server container.

    ```shell
    /opt/mssql/bin/mssql-conf set sqlagent.enabled true
    ```

    Note this changing requires a restart of the instance and can affect database performance.

    Or, you can also directly start the container with environment variable `MSSQL_AGENT_ENABLED: "true"`.

    If you are using Azure SQL Database, SQL Server Agent should be available be default. Otherwise, you can enable it following the [guidance](https://learn.microsoft.com/en-us/sql/ssms/agent/start-stop-or-pause-the-sql-server-agent-service?view=sql-server-ver16).

2. Enable CDC for the database, as it is disabled by default. Run the following statement to enable CDC for the database.

    ```sql
    EXEC sys.sp_cdc_enable_db;
    ```

3. Enable CDC for the table, as it is disabled by default. Run the following statement to enable CDC for the table. This statement will create a CDC table in the `dbo` schema for table `t1`.

    ```sql
    EXEC sys.sp_cdc_enable_table @source_schema = 'dbo', @source_name = 't1', @role_name = NULL;
    ```

    Replace `dbo` with the schema name and `t1` with the table name.

:::note
SQL Server allows you to create multiple CDC tables for the same source table using different capture instance names (@capture_instance). However, RisingWave currently supports only a single capture instance per table. If your table has only one capture instance, RisingWave will automatically use it to create a CDC table. However, if there are multiple capture instances, RisingWave will select one at random for CDC table creation.
:::

## Notes about running RisingWave from binaries

If you are running RisingWave locally from binaries and intend to use the native CDC source connectors or the JDBC sink connector, make sure that you have [JDK 11](https://openjdk.org/projects/jdk/11/) or a later version installed in your environment.

## Create a table using the native CDC connector

To capture all data changes, you need to create a source and a corresponding table with primary keys. Note that we do not support creating a table with `sqlserver-cdc` as the source like `mysql-cdc` and `postgres-cdc`. You need to create a source first and then create tables from the source.

### Syntax

Syntax for creating a CDC source.

```sql
CREATE SOURCE [ IF NOT EXISTS ] source_name WITH (
   connector='sqlserver-cdc',
   <field>=<value>, ...
);
```

Syntax for creating a CDC table. Note that a primary key is required and must be consistent with the upstream table.

```sql
CREATE TABLE [ IF NOT EXISTS ] table_name (
   column_name data_type PRIMARY KEY , ...
   PRIMARY KEY ( column_name, ... )
) 
[ INCLUDE timestamp AS column_name ]
WITH (
    snapshot='true' 
)
FROM source TABLE table_name;
```

Although SQL Server is case-insensitive in most cases, to avoid potential issues, please ensure that the case of the schema names, table names, and column names in RisingWave and SQL Server is consistent.

### Connector parameters

Unless specified otherwise, the fields listed are required. Note that the value of these parameters should be enclosed in single quotation marks.

|Field|Notes|
|---|---|
|hostname| Hostname of the database. |
|port| Port number of the database.|
|username| Username of the database.|
|password| Password of the database. |
|database.name| Name of the database.|

:::note
As noted earlier, RisingWave will use the available capture instance to create a CDC table. If multiple capture instances exist, RisingWave will randomly choose one. Specifying a particular capture instance is not supported.

Additionally, unlike MySQL and PostgreSQL, the SQL Server CDC connector does not support transactional CDC, as doing so would compromise the freshness of CDC sources. For further details, refer to the [Debezium SQL Server CDC connector documentation](https://debezium.io/documentation/reference/2.6/connectors/sqlserver.html#sqlserver-transaction-metadata).
:::

The following fields are used when creating a CDC table.

|Field|Notes|
|---|---|
|snapshot| Optional. If `false`, CDC backfill will be disabled and only upstream events that have occurred after the creation of the table will be consumed. This option can only be applied for tables created from a shared source. |
|snapshot.interval| Optional. Specifies the barrier interval for buffering upstream events. The default value is `1`. |
|snapshot.batch_size| Optional. Specifies the batch size of a snapshot read query from the upstream table. The default value is `1000`. |

```sql
CREATE TABLE mytable (v1 int PRIMARY KEY, v2 varchar)
FROM mssql_source TABLE 'dbo.mytable';

SELECT * FROM t2 ORDER BY v1;

----RESULT
 v1 | v2 |         commit_ts
----+----+---------------------------
  1 | aa | 1970-01-01 00:00:00+00:00
  2 | bb | 1970-01-01 00:00:00+00:00
  3 | cc | 2024-05-20 09:01:08+00:00
  4 | dd | 2024-05-20 09:01:08+00:00
```

#### Debezium parameters

[Debezium v2.6 connector configuration properties](https://debezium.io/documentation/reference/2.6/connectors/sqlserver.html#sqlserver-advanced-connector-configuration-properties) can also be specified under the `WITH` clause when creating a table or shared source. Add the prefix `debezium.` to the connector property you want to include.

For instance, to skip unknown DDL statements, specify the `schema.history.internal.skip.unparseable.ddl` parameter as `debezium.schema.history.internal.skip.unparseable.ddl`.

```sql
CREATE SOURCE mssql_mydb WITH (
    connector = 'sqlserver-cdc',
    hostname = '127.0.0.1',
    port = '1433',
    username = 'sa',
    password = '123456',
    database.name = 'mydb',
    debezium.schema.history.internal.skip.unparseable.ddl = 'true'
);
```

### Data format

Data is in Debezium JSON format. [Debezium](https://debezium.io) is a log-based CDC tool that can capture row changes from various database management systems such as PostgreSQL, MySQL, and SQL Server and generate events with consistent structures in real time. The SQL Server CDC connector in RisingWave supports JSON as the serialization format for Debezium data.

### Metadata options

Below are the metadata columns available for SQL Server CDC.

|Field|Notes|
|---|---|
|database_name| Name of the database. |
|schema_name| Name of the schema.|
|table_name| Name of the table.|

For instance, the person table below contains columns for typical personal information. It also includes metadata fields (`database_name`, `schema_name`, `table_name`) to provide contextual information about where the data resides within the SQL Server database.

```sql
CREATE TABLE person (
    id int,
    name varchar,
    email_address varchar,
    credit_card varchar,
    city varchar,
    PRIMARY KEY (id)
) INCLUDE TIMESTAMP AS commit_ts
INCLUDE DATABASE_NAME as database_name
INCLUDE SCHEMA_NAME as schema_name
INCLUDE TABLE_NAME as table_name
FROM mssql_source TABLE 'dbo.person';
```

## Examples

Connect to the upstream database by creating a CDC source using the [`CREATE SOURCE`](/sql/commands/sql-create-source.md) command and SQL Server CDC parameters. The data format is fixed as `FORMAT PLAIN ENCODE JSON` so it does not need to be specified.

```sql
CREATE SOURCE mssql_mydb WITH (
    connector = 'sqlserver-cdc',
    hostname = '127.0.0.1',
    port = '1433',
    username = 'sa',
    password = '123456',
    database.name = 'mydb'
);
```

With the source created, you can create multiple CDC tables that ingest data from different tables and schemas in the upstream database without needing to specify the database connection parameters again. 

For instance, the following CDC table in RisingWave ingests data from table `tt3` in the schema `dbo`. When specifying the SQL Server table name in the `FROM` clause after the keyword `TABLE`, the schema name must also be specified. 

```sql
CREATE TABLE tt3 (
    v1 integer primary key,
    v2 timestamp with time zone
) FROM mssql_mydb TABLE 'dbo.tt3';
```

You can also create another CDC table in RisingWave that ingests data from table `tt4` in the schema `ods`.

```sql
CREATE TABLE tt4 (
  v1 integer primary key,
  v2 varchar,
  PRIMARY KEY (v1)
) FROM mssql_mydb TABLE 'ods.tt4';
```

To check the progress of backfilling historical data, find the corresponding internal table using the [`SHOW INTERNAL TABLES`](/sql/commands/sql-show-internal-tables.md) command and query from it.

## Data type mapping

The following table shows the corresponding data type in RisingWave that should be specified when creating a CDC table. For details on native RisingWave data types, see [Overview of data types](/sql/sql-data-types.md).

RisingWave data types marked with an asterisk indicate that while there is no corresponding RisingWave data type, the ingested data can still be consumed as the listed type.

| SQL Server type | RisingWave type |
|------------|-----------------|
|BIT |BOOLEAN |
|TINYINT, SMALLINT |SMALLINT |
|INT |INTEGER |
|BIGINT |BIGINT |
|REAL |REAL |
|FLOAT | DOUBLE PRECISION |
|NUMERIC[(M[,D])], DECIMAL[(M[,D])] |`numeric`, `numeric` supports values with a precision of up to 28 digits, and any values beyond this precision will be treated as `NULL`. |
|CHAR[(M)], VARCHAR[(M)], TEXT, NCHAR[(M)], NVARCHAR[(M)], NTEXT |CHARACTER VARYING |
|BINARY[(M)], NBINARY[(M)] |BYTEA |
|DATE |DATE |
|TIME |TIME |
|SMALLDATETIME, DATETIME, DATETIME2| TIME WITHOUT TIME ZONE (assume UTC time zone) |
|DATETIMEOFFSET |TIMESTAMP WITH TIME ZONE|
|UUID |CHARACTER VARYING, uppercase |
|XML |CHARACTER VARYING |
|Other Types |No support |

<!-- |JSON, JSONB |JSONB |
|MONEY[(M[,D])] |NUMERIC |
|HSTORE |No support |
|HSTORE |No support | -->

## Automatically map upstream table schema

RisingWave supports automatically mapping the upstream table schema when creating a CDC table from a SQL Server CDC source. Instead of defining columns individually, you can use `*` when creating a table to ingest all columns from the source table. Note that `*` cannot be used if other columns are specified in the table creation process.

Below is an example to create a table that ingests all columns from the upstream table from the SQL Server database:

```sql
CREATE TABLE supplier (*) FROM mssql_source TABLE 'dbo.supplier';
```

And this it the output of `DESCRIBE supplier;`

```sql
       Name        |       Type        | Is Hidden | Description
-------------------+-------------------+-----------+-------------
 s_suppkey         | bigint            | false     |
 s_name            | character varying | false     |
 s_address         | character varying | false     |
 s_nationkey       | bigint            | false     |
 s_phone           | character varying | false     |
 s_acctbal         | numeric           | false     |
 s_comment         | character varying | false     |
 primary key       | s_suppkey         |           |
 distribution key  | s_suppkey         |           |
 table description | supplier          |           |
(10 rows)
``` 

## Monitor the progress of direct CDC

To observe the progress of direct CDC for SQL Server, use the following methods:

### For historical data

Historical data needs to be backfilled into the table. You can check the internal state of the backfill executor as follows:

1. Create a table to backfill historical data:

    ```sql
    CREATE TABLE t3 (id INTEGER, v1 TIMESTAMP WITH TIME ZONE, PRIMARY KEY(id)) FROM mssql_source TABLE 'dbo.t3';
    ```

2. List the internal tables to find the relevant backfill executor state:

    ```sql
    SHOW INTERNAL TABLES;
    ```

    Output:

    ```
    Name
    ---------------------------------
    __internal_t3_3_streamcdcscan_4
    __internal_mssql_source_1_source_2
    (2 rows)
    ```

3. Check the internal state of the backfill executor:

    ```sql
    SELECT * FROM __internal_t3_3_streamcdcscan_4;
    ```

    Output:

    ```
    split_id | id | backfill_finished | row_count | cdc_offset
    ----------+----+-------------------+-----------+-------------------------------------------------------------------------------------------------
    3        |  5 | t                 |         4 | {"SqlServer": {"change_lsn": "00000029:000005b0:0006", "commit_lsn": "ffffffff:ffffffff:ffff"}}
    (1 row)
    ```