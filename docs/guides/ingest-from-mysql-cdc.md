---
id: ingest-from-mysql-cdc
title: Ingest data from MySQL CDC
description: Ingest data from MySQL CDC.
slug: /ingest-from-mysql-cdc
---

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time.

RisingWave supports ingesting row-level data (`INSERT`, `UPDATE`, and `DELETE` operations) from the changes of a MySQL database.

:::note

The supported MySQL versions are 5.7 and 8.0.x.

:::

You can ingest CDC data from MySQL in two ways:

- Using the direct MySQL CDC connector
  This connector is included in RisingWave. With this connector, RisingWave can connect to MySQL directly to obtain data from the binlog without starting additional services.

- Using a CDC tool and the Kafka connector
  You can use either the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Maxwell's daemon](https://maxwells-daemon.io/) to convert MySQL data change streams to Kafka topics, and then use the Kafka connector in RisingWave to consume data from the Kafka topics.


## Using the native MySQL CDC connector

### Set up MySQL

Before using the native MySQL CDC connector in RisingWave, you need to complete several configurations on MySQL. For details, see [Setting up MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html#setting-up-mysql). Ensure that the binlog is enabled.

### Enable the connector node in RisingWave

The native MySQL CDC connector is implemented by a connector node. A connector node handles the connections with upstream and downstream systems, and it is currently only available in RiseDev, the developer tool of RisingWave. 



### Create a materialized source connection using the native CDC connector

To ensure all data changes are captured, you must create a materialized source connection (`CREATE TABLE`) and specify primary keys. The data format must be Debezium JSON.


#### Syntax

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

#### WITH parameters

All the fields listed below are required. 

|Field|Notes|
|---|---|
|hostname| Host name of the database. |
|port| Port number of the database.|
|username| User name of the database.|
|password| Password of the database. |
|database.name| Name of the database. Note that RisingWave can not read data from a built-in MySQL database, such as `mysql`.|
|table.name| Name of the table that you want to ingest data from. |
|server.id| A numeric ID of the database client. It must be unique across all database processes that are running in the MySQL cluster.|

#### Data format

`DEBEZIUM_JSON` — Data is in Debezium JSON format. [Debezium](https://debezium.io) is a log-based CDC tool that can capture row changes from various database management systems such as PostgreSQL, MySQL, and SQL Server and generate events with consistent structures in real time. The MySQL CDC connector in RisingWave supports JSON as the serialization format for Debezium data. The data format does not need to be specified.


#### Example

```sql
CREATE TABLE orders (
   order_id INT,
   order_date BIGINT,
   customer_name STRING,
   price DECIMAL,
   product_id INT,
   order_status SMALLINT,
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

## Use a CDC tool and the Kafka connector

### Use the Debezium connector for MySQL

#### Set up MySQL

Before using the Debezium connector for MySQL, you need to complete several configurations on MySQL. For details, see [Setting up MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html#setting-up-mysql).

#### Deploy the Debezium connector for MySQL

You need to download and configure the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html), and then add the configuration to your Kafka Connect cluster. For details, see [Deploying the MySQL connector](https://debezium.io/documentation/reference/stable/connectors/mysql.html#mysql-deploying-a-connector).

#### Create a materialized source connection using the Kafka connector

To ensure all data changes are captured, you must create a materialized source connection (`CREATE TABLE`) and specify primary keys. The data format must be Debezium JSON.

```sql
CREATE TABLE source_name (
   column1 VARCHAR,
   column2 INTEGER,
   PRIMARY KEY (column1)
) 
WITH (
   connector='kafka',
   topic='user_test_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='earliest',
   properties.group.id='demo_consumer_name'
);
```

### Use the Maxwell's daemon

#### Configure MySQL and run Maxwell's daemon

You need to configure MySQL and run Maxwell's daemon to convert data changes to Kafka topics. For details, see the [Quick Start](https://maxwells-daemon.io/quickstart/) from Maxwell's Daemon.

#### Create a materialized source connection using the Kafka connector

To ensure all data changes are captured, you must create a materialized source connection (`CREATE TABLE`) and specify primary keys. The data format must be Maxwell JSON.


```sql
CREATE TABLE source_name (
   column1 VARCHAR,
   column2 INTEGER,
   PRIMARY KEY (column1)
) 
WITH (
   connector='kafka',
   topic='user_test_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='earliest',
   properties.group.id='demo_consumer_name'
) 
ROW FORMAT MAXWELL;
```