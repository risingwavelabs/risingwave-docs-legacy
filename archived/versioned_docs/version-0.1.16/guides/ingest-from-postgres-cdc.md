---
 id: ingest-from-postgres-cdc
 title: Ingest data from PostgreSQL CDC
 description: Describe how to ingest data from PostgreSQL CDC.
 slug: /ingest-from-postgres-cdc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-postgres-cdc/" />
</head>

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time.

:::note
The supported PostgreSQL versions are 10, 11, 12, 13, and 14.
:::

You can ingest CDC data from PostgreSQL in two ways:

- Using the PostgreSQL CDC connector

    This connector is included in RisingWave. With this connector, RisingWave can connect to PostgreSQL directly to obtain data from the binlog without starting additional services.

- Using a CDC tool and the Kafka connector

    You can use the [Debezium connector for PostgreSQL](https://debezium.io/documentation/reference/stable/connectors/postgresql.html) and then use the Kafka connector in RisingWave to consume data from the Kafka topics.

## Using the native PostgreSQL CDC connector

### Set up PostgreSQL

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="pg_self_hosted" label="Self-hosted" default>

Ensure that the `wal_level` of your PostgreSQL is `logical`. Check by using the following query.

```sql
SHOW wal_level;
```

By default, it will be `replica`. For CDC, you will need to set it to logical in the database configuration file (`postgresql.conf`) or via a `psql` command. The following command will change the `wal_level`.

```sql
ALTER SYSTEM SET wal_level = logical;
```

Keep in mind that changing the `wal_level` requires a restart of the PostgreSQL instance and can affect database performance.

For PostgreSQL connector to work properly, you should grant the user following privileges:

- `REPLICATION` privileges in the database to add the table to a publication.
    
    ```sql
    ALTER USER <username> REPLICATION;
    ```
    
- `CREATEDB` privileges on the database to add publications.
    
    ```sql
    ALTER USER <username> CREATEDB;
    ```
    
- `SELECT` privileges on the tables to copy the initial table data. Table owners automatically have `SELECT` permission for the table.

You can check your privileges by using the `\du` psql command:
```
dev-# \du
List of roles
Role name  |                        Attributes                          | Member of
-----------+------------------------------------------------------------+-----------
postgres   | Superuser, Create role, Create DB, Replication, Bypass RLS |    {}
```

</TabItem>

<TabItem value="AWS_rds_pg" label="AWS RDS">

Here we will use a standard class instance without Multi-AZ deployment as an example.

1. Check whether the `wal_level` parameter is set to `logical`. If it is `logical` then we are done. Otherwise, create a parameter group for your Postgres instance. We created a parameter group named **pg-cdc** for the instance that is running Postgres 12. Next, click the **pg-cdc** parameter group to edit the value of `rds.logical_replication` to 1.

<img
  src={require('../images/wal-level.png').default}
  alt="Change the wal-level for pg instance"
/>

2. Go to the **Databases** page and modify your instance to use the **pg-cdc** parameter group.

<img
  src={require('../images/pg-cdc-parameter.png').default}
  alt="Apply modified parameter group to pg instance"
/>

3. Click **Continue** and choose **Apply immediately**. Finally, click **Modify DB instance** to save changes. Remember to reboot the Postgres instance to put the changes into effect.

<img
  src={require('../images/modify-instances.png').default}
  alt="Apply changes"
/>

</TabItem>
</Tabs>

### Enable the connector node in RisingWave

The native PostgreSQL CDC connector is implemented by the connector node in RisingWave. The connector node handles the connections with upstream and downstream systems. You can use the docker-compose configuration of the latest RisingWave demo, in which the connector node is enabled by default. To learn about how to start RisingWave with this configuration, see [Docker Compose](/deploy/risingwave-docker-compose.md). 

### Create a table using the native CDC connector

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](/sql/commands/sql-create-table.md) command for more details. The data format must be Debezium JSON. 

 #### Syntax

 ```sql
 CREATE TABLE [ IF NOT EXISTS ] source_name (
    column_name data_type PRIMARY KEY , ...
    PRIMARY KEY ( column_name, ... )
 ) 
 WITH (
    connector='postgres-cdc',
    <field>=<value>, ...
 );
 ```
 Note that a primary key is required.

 #### WITH parameters

 All the fields listed below are required. 

 |Field|Notes|
 |---|---|
 |hostname| Hostname of the database. |
 |port| Port number of the database.|
 |username| Username of the database.|
 |password| Password of the database. |
 |database.name| Name of the database.|
 |schema.name| Name of the schema. |
 |table.name| Name of the table that you want to ingest data from. |
 |slot.name| The slot name for each Postgres source. Each source should have a unique slot name.|

 #### Data format

 Data is in Debezium JSON format. [Debezium](https://debezium.io) is a log-based CDC tool that can capture row changes from various database management systems such as PostgreSQL, MySQL, and SQL Server and generate events with consistent structures in real time. The PostgreSQL CDC connector in RisingWave supports JSON as the serialization format for Debezium data. The data format does not need to be specified when creating a table with `postgres-cdc` as the source.


 #### Example

 ```sql
 CREATE TABLE shipments (
    shipment_id integer,
    order_id integer,
    origin string,
    destination string,
    is_arrived boolean,
    PRIMARY KEY (shipment_id)
) WITH (
 connector = 'postgres-cdc',
 hostname = '127.0.0.1',
 port = '5432',
 username = 'postgres',
 password = 'postgres',
 database.name = 'dev',
 schema.name = 'public',
 table.name = 'shipments',
 slot.name = 'shipments'
);
 ```


## Use the Debezium connector for PostgreSQL

### Set up PostgreSQL

Before using the native PostgreSQL CDC connector in RisingWave, you need to complete several configurations for PostgreSQL. For details, see [Set up PostgreSQL](#set-up-postgresql). There are instructions on how to set up the self-hosted PostgreSQL and AWS RDS.

### Deploy the Debezium connector for PostgreSQL

You need to download and configure the [Debezium connector for PostgreSQL](https://debezium.io/documentation/reference/stable/connectors/postgresql.html), and then add the configuration to your Kafka Connect cluster. For details, see the [Deployment](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-deployment) section.

### Create a table using the Kafka connector

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


