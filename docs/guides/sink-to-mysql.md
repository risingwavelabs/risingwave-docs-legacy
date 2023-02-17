---
id: sink-to-mysql-with-jdbc
title: Sink data from RisingWave to MySQL with JDBC connector
description: Sink data from RisingWave to MySQL with JDBC connector.
slug: /sink-to-mysql-with-jdbc
---

In this guide, we will introduce how to sink data from RisingWave to JDBC-available databases using the JDBC sink connector. We also show how to create and connect to a database established on the cloud to minimize the efforts. Cloud databases can become an indispensable data sink for applications. As the largest cloud provider, AWS hosts Relational Database Services (RDS) that waive the need for setup and maintenance effort and has high availability and scalability options.

## Set up a MySQL database

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="AWS RDS MySQL" label="AWS RDS">

Before using the native MySQL CDC connector in RisingWave, you need to complete several configurations on MySQL.

### Set up an MySQL RDS instance on AWS

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

4. From the **Connectivity** panel, we can find the enpoint and connection port information.

<img
  src={require('../images/connectivity.png').default}
  alt="Endpoint and port information"
/>

### Connect to the RDS instance from MySQL

Now we can connect to the RDS instance. On your local machine, make sure you have installed MySQL, and start a MySQL prompt. Fill in the endpoint, the port, and login credentials in the connection parameters. 

```terminal
mysql -h rw-to-mysql.xxxxxx.us-east-1.rds.amazonaws.com -P 3306 -u <username> -p <password>
```

For more login options, refer to the [RDS connection guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstance.html).

### Set up destination table

Use the following query to set up a database and a table in the RDS instance.

```mysql
CREATE TABLE test_db.personnel (
	id integer,
	name varchar(200)
);
```

If the creation is successful, expect a returned message.

```mysql
Query OK, 0 rows affected (0.10 sec)
```

</TabItem>
<TabItem value="Self-hosted MySQL" label="Self-hosted MySQL">

### Connect to MySQL

Connect to your MySQL server. See the [Connect to MySQL server](https://www.mysqltutorial.org/getting-started-with-mysql/connect-to-mysql-server/) guide for more details.

### Set up destination table

Use the following queries to set up a database and table in MySQL.

```mysql
CREATE DATABASE test_db;

USE test_db;

CREATE TABLE personnel (
	id integer,
	name varchar(200)
);
```

</TabItem>
</Tabs>

## Create a sink in RisingWave

### Install and launch RisingWave

To install and start RisingWave locally, see the [Get started](/get-started.md) guide. We recommend running RisingWave locally for testing purposes. 


### Enable the connector node in RisingWave

The native JDBC sink connector is implemented by the connector node in RisingWave. The connector node handles the connections with upstream and downstream systems. You can use the docker-compose configuration of the latest RisingWave demo. The connector node is enabled by default in this docker-compose configuration. To learn about how to start RisingWave with this configuration, see [Docker Compose](../deploy/risingwave-docker-compose.md).

<Tabs>
<TabItem value="AWS RDS MySQL" label="AWS RDS">

### Create sink in RisingWave

To sink to the RDS instance, make sure that RisingWave and the connector node share the same table schema. Use the following queries in RisingWave to create a table and sink.

Remember to fill in the AWS endpoint, username, and password based on the RDS instance you created. 

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

Insert some data with the following query. Remember to use the `FLUSH` command to commit the update.

```sql
INSERT INTO personnel VALUES (1, 'Alice'), (2, 'Bob');

FLUSH;
```

### Verify sink connection

The changes will then be synced to the RDS instance. To verify the update, connect to the AWS RDS instance and query the table. The changes you made to the table should be reflected.

```terminal
mysql -h rw-to-mysql.xxxxxx.us-east-1.rds.amazonaws.com -P 3306 -u <username> -p <password>
```

```sql
SELECT * FROM testdb.personnel;

+------+-------+
| id   | name  |
+------+-------+
|    1 | Alice |
+------+-------+
|    2 | Bob   |
+------+-------+
```

</TabItem>
<TabItem value="Self-hosted MySQL" label="Self-hosted MySQL">

### Create sink in RisingWave

To sink to the MySQL server, make sure that RisingWave and the destination table share the same table schema. Use the following queries in RisingWave to create a table and sink.

Remember to fill in the username and password accordingly. The JDBC URL must be accurate. 

```sql
CREATE TABLE personnel (
	id integer,
	name varchar,
);

CREATE SINK s_mysql FROM personnel WITH (
	connector='jdbc',
	jdbc.url='jdbc:mysql://127.0.0.1:3306/testdb?user=<username>&password=<password>',
	table.name='personnel'
);
```

Insert some data with the following query. Remember to use the `FLUSH` command to commit the update.

```sql
INSERT INTO personnel VALUES (1, 'Alice'), (2, 'Bob');

FLUSH;
```

### Verify sink connection

The changes will then be synced to the table in the MySQL database. To verify the update, query the table in MySQL. The changes you made to the table should be reflected.


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

</TabItem>
</Tabs>