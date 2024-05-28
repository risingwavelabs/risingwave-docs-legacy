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

- Using the direct MySQL CDC connector

  This connector is included in RisingWave. With this connector, RisingWave can connect to MySQL directly to obtain data from the binlog without starting additional services.

- Using a CDC tool and the Kafka connector

  You can use either the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Maxwell's daemon](https://maxwells-daemon.io/) to convert MySQL data change streams to Kafka topics, and then use the Kafka connector in RisingWave to consume data from the Kafka topics.

## Using the native MySQL CDC connector

### Set up MySQL

Before using the native MySQL CDC connector in RisingWave, you need to complete several configurations on MySQL.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="self-hosted MySQL" label="Self-hosted">

To use the MySQL CDC features, we need to create a MySQL user account with appropriate privileges on all databases for which RisingWave will read from.

#### Create a user and grant privileges

1. Create a MySQL user with the following query.

```sql
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
```

2. Grant the appropriate privileges to the user.

```sql
GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'user'@'localhost';
```

3. Finalize the privileges.

```sql
FLUSH PRIVILEGES;
```

#### Enable the binlog

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
   <img
   src={require('../images/ret-period.png').default}
   alt="Set retention period to a nonzero value"
   />

2. Create a parameter group for MySQL instances. We created a parameter group named MySQL-CDC for the instance that runs MySQL 5.7.x.
   <img
   src={require('../images/parameter-group.png').default}
   alt="Create a parameter group"
   />

3. Click the MySQL-CDC parameter group to edit the values of **binlog_format** to **ROW** and **binlog_row_image** to **full**.
   <img
   src={require('../images/binlog-format.png').default}
   alt="Set binlog_format to row"
   />
   <img
   src={require('../images/binlog-row.png').default}
   alt="Set binlog_row_image to full"
   />

4. Modify your RDS instance and apply the modified parameter group to your database.
   <img
   src={require('../images/modify-RDS.png').default}
   alt="Select modify"
   />
   <img
   src={require('../images/apply-to-database.png').default}
   alt="Apply changes to database"
   />

5. Click **Continue** and choose **Apply immediately**. Finally, click **Modify DB instance** to save the changes. Remember to reboot your MySQL instance.
   <img
   src={require('../images/save-changes.png').default}
   alt="Save changes made to MySQL RDS instance"
   />

</TabItem>
</Tabs>

### Enable the connector node in RisingWave

The native MySQL CDC connector is implemented by the connector node in RisingWave. The connector node handles the connections with upstream and downstream systems. You can use the docker-compose configuration of the latest RisingWave demo. The connector node is enabled by default in this docker-compose configuration. To learn about how to start RisingWave with this configuration, see [Docker Compose](/deploy/risingwave-docker-compose.md).

### Create a table using the native CDC connector in RisingWave

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](/sql/commands/sql-create-table.md) command for more details. The data format must be Debezium JSON.

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

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
rr.Sequence(
rr.Terminal('CREATE TABLE'),
rr.Optional(rr.Terminal('IF NOT EXISTS')),
rr.NonTerminal('source_name', 'wrap')
),
rr.Terminal('('),
rr.Stack(
rr.Sequence(
rr.NonTerminal('column_name', 'skip'),
rr.NonTerminal('data_type', 'skip'),
rr.Terminal('PRIMARY KEY'),
rr.Terminal(','),
),
rr.ZeroOrMore(
rr.Sequence(
rr.NonTerminal('column_name', 'skip'),
rr.NonTerminal('data_type', 'skip'),
rr.Terminal('PRIMARY KEY'),
rr.Terminal(','),
),
),
rr.Optional(
rr.Sequence(
rr.Terminal('PRIMARY KEY'),
rr.Terminal('('),
rr.NonTerminal('column_name', 'skip'),
rr.Optional(rr.Terminal(',')),
rr.ZeroOrMore(
rr.Sequence(
rr.Terminal(','),
rr.NonTerminal('column_name', 'skip'),
rr.Optional(rr.Terminal(',')),
),
),
rr.Terminal(')'),
),
),
),
rr.Terminal(')'),
rr.Sequence(
rr.Terminal('WITH'),
rr.Terminal('('),
rr.Stack(
rr.Stack(
rr.Sequence(
rr.Terminal('connector'),
rr.Terminal('='),
rr.NonTerminal('mysql-cdc', 'skip'),
rr.Terminal(','),
),
rr.OneOrMore(
rr.Sequence(
rr.NonTerminal('field', 'skip'),
rr.Terminal('='),
rr.NonTerminal('value', 'skip'),
rr.Terminal(','),
),
),
),
rr.Terminal(')'),
),
),
rr.Stack(
rr.Sequence(
rr.Terminal('ROW FORMAT'),
rr.NonTerminal('data_format', 'skip'),
),
rr.Optional(
rr.Sequence(
rr.Terminal('MESSAGE'),
rr.NonTerminal('message', 'skip'),
),
),
rr.Optional(
rr.Sequence(
rr.Terminal('ROW SCHEMA LOCATION'),
rr.NonTerminal('location', 'skip'),
rr.Terminal(';'),
),
),
),
)
);

<drawer SVG={svg} />

Note that a primary key is required.

#### WITH parameters

All the fields listed below are required.

| Field         | Notes                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| hostname      | Hostname of the database.                                                                                                   |
| port          | Port number of the database.                                                                                                |
| username      | Username of the database.                                                                                                   |
| password      | Password of the database.                                                                                                   |
| database.name | Name of the database. Note that RisingWave cannot read data from a built-in MySQL database, such as `mysql`, `sys`, etc.    |
| table.name    | Name of the table that you want to ingest data from.                                                                        |
| server.id     | A numeric ID of the database client. It must be unique across all database processes that are running in the MySQL cluster. |

#### Data format

Data is in Debezium JSON format. [Debezium](https://debezium.io) is a log-based CDC tool that can capture row changes from various database management systems such as PostgreSQL, MySQL, and SQL Server and generate events with consistent structures in real time. The MySQL CDC connector in RisingWave supports JSON as the serialization format for Debezium data. The data format does not need to be specified when creating a table with `mysql-cdc` as the source.

#### Example

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

## Using a CDC tool and the Kafka connector

<Tabs>
<TabItem value="Debezium connector for MySQL" label="Debezium connector for MySQL" default>

### Set up MySQL

Before using the Debezium connector for MySQL, you need to complete several configurations on MySQL. For details, see [Setting up MySQL](#set-up-mysql).

### Deploy the Debezium connector for MySQL

You need to download and configure the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html), and then add the configuration to your Kafka Connect cluster. For details, see [Deploying the MySQL connector](https://debezium.io/documentation/reference/stable/connectors/mysql.html#mysql-deploying-a-connector).

### Create a table using the Kafka connector in RisingWave

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](/sql/commands/sql-create-table.md) command for more details. The data format must be Debezium JSON.

```sql
CREATE TABLE source_name (
   column1 varchar,
   column2 integer,
   PRIMARY KEY (column1)
)
WITH (
   connector='kafka',
   topic='user_test_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='earliest',
   properties.group.id='demo_consumer_name'
)
ROW FORMAT DEBEZIUM_JSON;
```

</TabItem>
<TabItem value="Maxwell daemon" label="Maxwell daemon">

### Configure MySQL and run Maxwell's daemon

You need to configure MySQL and run Maxwell's daemon to convert data changes to Kafka topics. For details, see the [Quick Start](https://maxwells-daemon.io/quickstart/) from Maxwell's daemon.

### Create a table using the Kafka connector in RisingWave

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](/sql/commands/sql-create-table.md) command for more details. The data format must be Maxwell JSON.

```sql
CREATE TABLE source_name (
   column1 varchar,
   column2 integer,
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

</TabItem>
</Tabs>
