---
id: sink-to-mysql-with-jdbc
title: Sink data from RisingWave to MySQL with the JDBC connector
description: Sink data from RisingWave to MySQL with the JDBC connector.
slug: /sink-to-mysql-with-jdbc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-mysql-with-jdbc/" />
</head>

This guide will introduce how to sink data from RisingWave to JDBC-available databases using the JDBC sink connector. MySQL is a commonly used RDS with a JDBC driver and it is available as a cloud database through AWS for easy setup and maintenance. We will show you how to configure MySQL and RisingWave to create a MySQL sink. The configurations for RisingWave when connecting to any JDBC-available database will be the same.

:::note

The supported MySQL versions are 5.7 and 8.0.x.

:::

## Set up a MySQL database

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupID = "operating-systems">
<TabItem value="AWS RDS MySQL" label="AWS RDS">

Before using the native MySQL CDC connector in RisingWave, you need to complete several configurations on MySQL.

### Set up a MySQL RDS instance on AWS

1. Log in to the AWS console. Search “RDS” in services and select the **RDS** panel.

 <img
 src={require('../images/search-rds.png').default}
 alt="Search for RDS"
 />

2. Create a database with **MySQL** as the **Engine type**. We recommend setting up a username and password or using other security options.

 <img
 src={require('../images/mysql-config.png').default}
 alt="Configurations for setting up a MySQL RDS"
 />

3. When the new instance becomes available, click on its panel.

 <img
 src={require('../images/new-panel.png').default}
 alt="MySQL instance panel"
 />

4. From the **Connectivity** panel, we can find the endpoint and connection port information.

 <img
 src={require('../images/connectivity.png').default}
 alt="Endpoint and port information"
 />

### Connect to the RDS instance from MySQL

Now we can connect to the RDS instance. Make sure you have installed MySQL on your local machine, and start a MySQL prompt. Fill in the endpoint, the port, and login credentials in the connection parameters.

```terminal
mysql -h rw-to-mysql.xxxxxx.us-east-1.rds.amazonaws.com -P 3306 -u <username> -p <password>
```

For more login options, refer to the [RDS connection guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstance.html).

### Set up a destination table

Use the following query to set up a database and a table in the RDS instance.

```sql
CREATE TABLE test_db.personnel (
 id integer,
 name varchar(200),
 PRIMARY KEY (id)
);
```

If the creation is successful, expect a returned message.

```sql
Query OK, 0 rows affected (0.10 sec)
```

</TabItem>
<TabItem value="Self-hosted MySQL" label="Self-hosted MySQL">

### Connect to MySQL

Connect to your MySQL server. See the [Connect to MySQL server](https://www.mysqltutorial.org/getting-started-with-mysql/connect-to-mysql-server/) guide for more details.

### Set up destination table

Use the following queries to set up a database and table in MySQL.

```sql
CREATE DATABASE test_db;

USE test_db;

CREATE TABLE personnel (
 id integer,
 name varchar(200),
 PRIMARY KEY (id)
);
```

</TabItem>
</Tabs>

## Set up RisingWave

### Install and launch RisingWave

To install and start RisingWave locally, see the [Get started](/get-started.md) guide. We recommend running RisingWave locally for testing purposes.

### Notes about running RisingWave from binaries

If you are running RisingWave locally from binaries and intend to use the native CDC source connectors or the JDBC sink connector, make sure you have [JDK 11](https://openjdk.org/projects/jdk/11/) or later versions installed in your environment.

## Create a sink

### Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='jdbc',
   field_name = 'field', ...
);
```

### Parameters

All `WITH` options are required.

|Parameter or clause|Description|
|---|---|
|sink_name| Name of the sink to be created.|
|sink_from| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or a SELECT query must be specified.|
|AS select_query| A SELECT query that specifies the data to be output to the sink. Either this query or a FROM clause must be specified.See [SELECT](/sql//commands/sql-select.md) for the syntax and examples of the SELECT command.|
|connector| Sink connector type must be `'jdbc'` for MySQL sink. |
|jdbc.url| The JDBC URL of the destination database necessary for the driver to recognize and connect to the database.|
|table.name| The table in the destination database you want to sink to.|
|type|Data format. Allowed formats:<ul><li> `append-only`: Output data with insert operations.</li></ul> `upsert`: Output data as a changelog stream. |
|primary_key| Required if `type` is `upsert`. The primary key of the downstream table. |

## Sink data from RisingWave to MySQL

### Create a table and sink

To sink to MySQL, make sure that RisingWave table and the MySQL table share the same table schema. Use the following queries in RisingWave to create a table and sink.

The `jdbc.url` must be accurate. The format varies slightly depending on if you are using AWS RDS MySQL or a self-hosted version of MySQL. If your MySQL is self-hosted, the `jdbc.url` would have the following format: `jdbc:mysql://127.0.0.1:3306/testdb?user=<username>&password=<password>`.

```sql
CREATE TABLE personnel (
 id integer,
 name varchar,
);

CREATE SINK s_mysql FROM personnel WITH (
 connector='jdbc',
 jdbc.url='jdbc:mysql://<aws_rds_endpoint>:<port>/test_db?user=<username>&password=<password>',
 table.name='personnel',
 type = 'upsert',
 primary_key = 'id'
);
```

### Update the table

Insert some data with the following query. Remember to use the `FLUSH` command to commit the update.

```sql
INSERT INTO personnel VALUES (1, 'Alice'), (2, 'Bob');

FLUSH;
```

### Verify the sink connection

The changes will then be synced to MySQL. To verify the update, connect to MySQL and query the table. The changes you made to the table should be reflected.

```sql
SELECT * FROM personnel;

+------+-------+
| id   | name  |
+------+-------+
|    1 | Alice |
+------+-------+
|    2 | Bob   |
+------+-------+
```

## Data type mapping

For the MySQL data type mapping table, see the [Data type mapping table](/guides/ingest-from-mysql-cdc.md#data-type-mapping) under the Ingest data from MySQL CDC topic.

Additional notes regarding sinking data to MySQL:

- Note that array data types in RisingWave when sinked to MySQL will be converted to a string. Only one-dimensional arrays can be sinked to MySQL. For instance, `ARRAY['Value 1', 'Value 2']` when sinked to MySQL will be converted to the string `Value 1, Value 2`.

- For array type, we only support `smallint`, `integer`, `bigint`, `real`, `double precision`, and `varchar` type now.
