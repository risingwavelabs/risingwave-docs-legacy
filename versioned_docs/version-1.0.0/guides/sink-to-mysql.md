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

	![Search for RDS](../images/search-rds.png)

2. Create a database with **MySQL** as the **Engine type**. We recommend setting up a username and password or using other security options.

	![Configurations for setting up a MySQL RDS](../images/mysql-config.png)

3. When the new instance becomes available, click on its panel.

	![MySQL instance panel](../images/new-panel.png)

4. From the **Connectivity** panel, we can find the endpoint and connection port information.

	![Endpoint and port information](../images/connectivity.png)

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
	name varchar(200)
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
	name varchar(200)
);
```

</TabItem>
</Tabs>

## Set up RisingWave

### Install and launch RisingWave

To install and start RisingWave locally, see the [Get started](/get-started.md) guide. We recommend running RisingWave locally for testing purposes.


### Enable the connector node in RisingWave

The native MySQL CDC connector is implemented by the connector node in RisingWave. The connector node handles the connections with upstream and downstream systems.

The connector node is enabled by default in this docker-compose configuration. To learn about how to start RisingWave with this configuration, see [Docker Compose](/deploy/risingwave-trial.md/?method=docker-compose).

If you are running RisingWave locally with the pre-built library or with the source code, the connector node needs to be started separately. To learn about how to start the connector node in this case, see [Enable the connector node](/deploy/risingwave-trial.md/?method=binaries#optional-enable-the-connector-node).

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

All WITH options are required.

|Parameter or clause|Description|
|---|---|
|sink_name| Name of the sink to be created.|
|sink_from| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or a SELECT query must be specified.|
|AS select_query| A SELECT query that specifies the data to be output to the sink. Either this query or a FROM clause must be specified.See [SELECT](/sql//commands/sql-select.md) for the syntax and examples of the SELECT command.|
|connector| Sink connector type. Currently, only `‘kafka’` and `‘jdbc’` are supported. If there is a particular sink you are interested in, go to the [Integrations](/rw-integration-summary.md) page to see the full list of connectors and integrations we are working on. |
|jdbc.url| The JDBC URL of the destination database necessary for the driver to recognize and connect to the database.|
|table.name| The table in the destination database you want to sink to.|
|type|Data format. Allowed formats:<ul><li> `append-only`: Output data with insert operations.</li><li> `upsert`: Output data as a changelog stream. </li></ul> If creating an `upsert` sink, see the [Overview](/data-delivery.md) on when to define the primary key.|

## Sink data from RisingWave to MySQL

### Create a table and sink

To sink to MySQL, make sure that RisingWave and the connector node share the same table schema. Use the following queries in RisingWave to create a table and sink.

The `jdbc.url` must be accurate. The format varies slightly depending on if you are using AWS RDS MySQL or a self-hosted version of MySQL. If your MySQL is self-hosted, the `jdbc.url` would have the following format: `jdbc:mysql://127.0.0.1:3306/testdb?user=<username>&password=<password>`.

```sql
CREATE TABLE personnel (
	id integer,
	name varchar,
);

CREATE SINK s_mysql FROM personnel WITH (
	connector='jdbc',
	jdbc.url='jdbc:mysql://<aws_rds_endpoint>:<port>/test_db?user=<username>&password=<password>',
	table.name='personnel'
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