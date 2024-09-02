---
id: ingest-from-mysql-cdc
title: Ingest data from MySQL CDC
description: Ingest data from MySQL CDC.
slug: /ingest-from-mysql-cdc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-mysql-cdc/" />
</head>

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time.

RisingWave supports ingesting row-level data (`INSERT`, `UPDATE`, and `DELETE` operations) from the changes of a MySQL database.

:::note

The supported MySQL versions are 5.7 and 8.0.x.

:::

You can ingest CDC data from MySQL in two ways:

- Using the built-in MySQL CDC connector

  With this connector, RisingWave can connect to MySQL databases directly to obtain data from the binlog without starting additional services.

  :::caution Beta feature
  The built-in MySQL CDC connector in RisingWave is currently in Beta. Please use with caution as stability issues may still occur. Its functionality may evolve based on feedback. Please report any issues encountered to our team.
  :::

- Using a CDC tool and a message broker

  You can use a CDC tool then use the Kafka, Pulsar, or Kinesis connector to send the CDC data to RisingWave. For more details, see the [Create source via event streaming systems](/create-source/create-source-cdc.md) topic.

## Set up MySQL

Before using the native MySQL CDC connector in RisingWave, you need to complete several configurations on MySQL.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="self-hosted MySQL" label="Self-hosted">

To use the MySQL CDC features, we need to create a MySQL user account with appropriate privileges on all databases for which RisingWave will read from.

### Create a user and grant privileges

1. Create a MySQL user with the following query.

```sql
CREATE USER 'user'@'%' IDENTIFIED BY 'password';
```

2. Grant the appropriate privileges to the user.

```sql
GRANT SELECT, RELOAD, SHOW DATABASES, LOCK TABLES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'user'@'%';
```

3. Finalize the privileges.

```sql
FLUSH PRIVILEGES;
```

### Enable the binlog

The binlog must be enabled for MySQL replication. The binary logs record transaction updates for replication tools to propagate changes.

1. Check if the `log-bin` is already on.

```sql
SHOW VARIABLES LIKE 'log_bin';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| log_bin       | OFF   |
+---------------+-------+
```

2. If it is `OFF`, configure your MySQL server configuration file, my.cnf, with the following properties described below. Restart your MySQL server to let the configurations take effect.

```terminal
server-id         = 223344
log_bin           = mysql-bin
binlog_format     = ROW
binlog_row_image  = FULL
expire_logs_days  = 10
```

3. Confirm your changes by checking the `log-bin` again.

```sql
SHOW VARIABLES LIKE 'log_bin';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| log_bin       | ON    |
+---------------+-------+
```

See [Setting up MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html#setting-up-mysql) for more details.

</TabItem>
<TabItem value="AWS RDS MySQL" label="AWS RDS">

If your MySQL is hosted on AWS RDS, the configuration process is different. We will use a standard class MySQL instance without Multi-AZ deployment for illustration.

1. Turn on binary logging and choose a non-zero value for the **Retention period**.
  ![Set retention period to a nonzero value](../images/ret-period.png)

2. Create a parameter group for MySQL instances. We created a parameter group named MySQL-CDC for the instance that runs MySQL 5.7.x.
  ![Create a parameter group](../images/parameter-group.png)

3. Click the MySQL-CDC parameter group to edit the values of **binlog_format** to **ROW** and **binlog_row_image** to **full**.
  ![Set binlog_format to row](../images/binlog-format.png)
  ![Set binlog_row_image to full](../images/binlog-row.png)

4. Modify your RDS instance and apply the modified parameter group to your database.
  ![Select modify](../images/modify-RDS.png)
  ![Apply changes to database](../images/apply-to-database.png)

5. Click **Continue** and choose **Apply immediately**. Finally, click **Modify DB instance** to save the changes. Remember to reboot your MySQL instance.
  ![Save changes made to MySQL RDS instance](../images/save-changes.png)

</TabItem>
</Tabs>

## Enable the connector node in RisingWave

The native MySQL CDC connector is implemented by the connector node in RisingWave. The connector node handles the connections with upstream and downstream systems.

The connector node is enabled by default in this docker-compose configuration. To learn about how to start RisingWave with this configuration, see [Docker Compose](../deploy/risingwave-trial.md?method=docker-compose).

If you are running RisingWave locally with the pre-built library or with the source code, the connector node needs to be started separately. To learn about how to start the connector node in this case, see [Enable the connector node](../deploy/risingwave-trial.md?method=binaries#optional-enable-the-connector-node).

## Create a table using the native CDC connector in RisingWave

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](/sql/commands/sql-create-table.md) command for more details. The data format must be Debezium JSON.

### Syntax

```sql
CREATE TABLE [ IF NOT EXISTS ] source_name (
   column_name data_type PRIMARY KEY , ...
   PRIMARY KEY ( column_name, ... )
)
WITH (
   connector='mysql-cdc',
   <field>=<value>, ...
);
```

Note that a primary key is required.

### WITH parameters

All the fields listed below are required.

|Field|Notes|
|---|---|
|hostname| Hostname of the database. |
|port| Port number of the database.|
|username| Username of the database.|
|password| Password of the database. |
|database.name| Name of the database. Note that RisingWave cannot read data from a built-in MySQL database, such as `mysql`, `sys`, etc.|
|table.name| Name of the table that you want to ingest data from. |
|server.id| A numeric ID of the database client. It must be unique across all database processes that are running in the MySQL cluster.|

### Data format

Data is in Debezium JSON or Debezium AVRO format. [Debezium](https://debezium.io) is a log-based CDC tool that can capture row changes from various database management systems such as PostgreSQL, MySQL, and SQL Server and generate events with consistent structures in real time. The MySQL CDC connector in RisingWave supports JSON or AVRO as the serialization format for Debezium data. The data format does not need to be specified when creating a table with `mysql-cdc` as the source.

### Example

```sql
CREATE TABLE orders (
   order_id int,
   order_date bigint,
   customer_name string,
   price decimal,
   product_id int,
   order_status smallint,
   PRIMARY KEY (order_id)
) WITH (
 connector = 'mysql-cdc',
 hostname = '127.0.0.1',
 port = '3306',
 username = 'root',
 password = '123456',
 database.name = 'mydb',
 table.name = 'orders',
 server.id = '5454'
);
```

### Data type mapping

The following table shows the corresponding data type in RisingWave that should be specified when creating a source. For details on native RisingWave data types, see [Overview of data types](../sql/sql-data-types.md).

RisingWave data types marked with an asterisk indicates that while there is no corresponding RisingWave data type, the ingested data can still be consumed as the listed type.

| MySQL type | RisingWave type |
|------------|-----------------|
| BOOLEAN, BOOL | BOOLEAN |
| BIT(1) | BOOLEAN* |
| BIT(>1) | No support |
| TINYINT | SMALLINT |
| SMALLINT[(M)] | SMALLINT |
| MEDIUMINT[(M)] |INTEGER |
| INT, INTEGER[(M)] | INTEGER |
| BIGINT[(M)] | BIGINT |
| REAL[(M,D)]| REAL |
| FLOAT[(P)] | REAL |
| FLOAT(M,D) | DOUBLE PRECISION |
| DOUBLE[(M,D)] | DOUBLE PRECISION |
| CHAR[(M)] | CHARACTER VARYING |
| VARCHAR[(M)] | CHARACTER VARYING |
| BINARY[(M)] | BYTEA |
| VARBINARY[(M)] | BYTEA |
| TINYBLOB | BYTEA |
| TINYTEXT | CHARACTER VARYING |
| BLOB | BYTEA |
| TEXT | CHARACTER VARYING |
| MEDIUMBLOB | BYTEA |
| MEDIUMTEXT| CHARACTER VARYING |
|LONGBLOB| BYTEA |
| LONGTEXT | BYTEA or CHARACTER VARYING |
| JSON | JSONB |
| ENUM | CHARACTER VARYING* |
| SET | No support |
| YEAR[(2\|4)] | INTEGER |
| TIMESTAMP[(M)] | TIMESTAMP WITH TIME ZONE |
| DATE | DATE |
| TIME[(M)] | TIME WITHOUT TIME ZONE |
| DATETIME, DATETIME(0), DATETIME(1), DATETIME(2), DATETIME(3) | TIMESTAMP WITHOUT TIME ZONE |
| DATETIME(4), DATETIME(5), DATETIME(6) | TIMESTAMP WITHOUT TIME ZONE |
| NUMERIC[(M[,D])] | NUMERIC |
| DECIMAL[(M[,D])] | NUMERIC |
| GEOMETRY, LINESTRING, POLYGON, <br />MULTIPOINT, MULTILINESTRING, <br />MULTIPOLYGON, GEOMETRYCOLLECTION | STRUCT |
