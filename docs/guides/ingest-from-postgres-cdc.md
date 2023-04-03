---
 id: ingest-from-postgres-cdc
 title: Ingest data from PostgreSQL CDC
 description: Describes how to ingest data from PostgreSQL CDC.
 slug: /ingest-from-postgres-cdc
---

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time.

:::note
The supported PostgreSQL versions are 10, 11, 12, 13, and 14.
:::

You can ingest CDC data from PostgreSQL in two ways:

- Using the PostgreSQL CDC connector

    This connector is included in RisingWave. With this connector, RisingWave can connect to PostgreSQL directly to obtain data from the binlog without starting additional services.

- Using a CDC tool and a message broker

    You can use a CDC tool then use the Kafka, Pulsar, or Kinesis connector to consume data from the topics in RisingWave.

## Use the native PostgreSQL CDC connector

### Set up PostgreSQL

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="pg_self_hosted" label="Self-hosted" default>

1. Ensure that the `wal_level` of your PostgreSQL is `logical`. Check by using the following statement.

    ```sql
    SHOW wal_level;
    ```

    By default, it is `replica`. For CDC, you will need to set it to logical in the database configuration file (`postgresql.conf`) or via a `psql` command. The following command will change the `wal_level`.

    ```sql
    ALTER SYSTEM SET wal_level = logical;
    ```

    Keep in mind that changing the `wal_level` requires a restart of the PostgreSQL instance and can affect database performance.

2. Assign `REPLICATION`, `LOGIN` and `CREATEDB` role attributes to the user.

    For an existing user, run the following statement to assign the attributes:

    `ALTER USER <username> REPLICATION LOGIN CREATEDB;`

    For a new user, run the following statement to create the user and assign the attributes:

    `CREATE USER <username> REPLICATION LOGIN CREATEDB;`

    You can check your role attributes by using the `\du` psql command:

    ```
    dev-# \du
                                       List of roles
    Role name |                         Attributes                         | Member of
    -----------+-----------------------------------------------------------+---------
    rw        | Create DB, Replication                                     | {}
    postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
    ```

3. Grant required priviledges to the user.

    Run the following statements to grant the required priviledges to the user.

    ```sql
    GRANT CONNECT ON DATABASE <database_name> TO <username>;   
    GRANT USAGE ON SCHEMA <schema_name> TO <username>;  
    GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <username>; 
    ```

    You can use the following statement to check the priviledges of the user to the tables:
    ```sql
    postgres=# SELECT table_name, grantee, privilege_type
    FROM information_schema.role_table_grants
    WHERE  grantee='<username>';
    ```

    An example result:

    ```sql
     table_name | grantee | privilege_type
     -----------+---------+----------------
     lineitem   | rw      | SELECT
     customer   | rw      | SELECT
     nation     | rw      | SELECT
     orders     | rw      | SELECT
     part       | rw      | SELECT
     partsupp   | rw      | SELECT
     supplier   | rw      | SELECT
     region     | rw      | SELECT
     (8 rows)
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

The native PostgreSQL CDC connector is implemented by the connector node in RisingWave. The connector node handles the connections with upstream and downstream systems. You can use the docker-compose configuration of the latest RisingWave demo, in which the connector node is enabled by default. To learn about how to start RisingWave with this configuration, see [Docker Compose](../deploy/risingwave-docker-compose.md). 

### Create a table using the native CDC connector

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](../sql/commands/sql-create-table.md) command for more details. The data format must be Debezium JSON. 

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
                rr.Optional(rr.Terminal(',')),
            ),
            rr.ZeroOrMore(
                rr.Sequence(
                    rr.Terminal(','),
                    rr.NonTerminal('column_name', 'skip'),
                    rr.NonTerminal('data_type', 'skip'),
                    rr.Terminal('PRIMARY KEY'),
                    rr.Optional(rr.Terminal(',')),
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
                        rr.Choice(1,
                            rr.Terminal('mysql-cdc'),
                            rr.Terminal('postgres-cdc'),
                        ),
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
    )
);


<drawer SVG={svg} />






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


## Use a CDC tool and a message broker

<Tabs>
<TabItem value="kafka" label="Kafka" default>

### Deploy the Debezium connector

Before using the native PostgreSQL CDC connector in RisingWave, you need to complete several configurations for PostgreSQL. For details, see [Set up PostgreSQL](#set-up-postgresql). There are instructions on how to set up self-hosted PostgreSQL and AWS RDS.

You need to download and configure the [Debezium connector for PostgreSQL](https://debezium.io/documentation/reference/stable/connectors/postgresql.html), and then add the configuration to your Kafka Connect cluster. For more details, see the [Deployment](https://debezium.io/documentation/reference/stable/connectors/postgresql.html#postgresql-deployment) section.

### Create a table with Kafka 

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](../sql/commands/sql-create-table.md) command and the [Kafka](../create-source/create-source-kafka.md) topic for more details. The data format must be Debezium JSON. 

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
<TabItem value="pulsar" label="Pulsar">

### Deploy the Debezium connector

Before using the native PostgreSQL CDC connector in RisingWave, you need to complete several configurations for PostgreSQL. For details, see [Set up PostgreSQL](#set-up-postgresql). There are instructions on how to set up self-hosted PostgreSQL and AWS RDS.

You need to download and configure the [Debezium connector for PostgreSQL](https://debezium.io/documentation/reference/stable/connectors/postgresql.html), and then add the configuration to your Pulsar cluster. For more details on configuration and usage, see the [Debezium source connector](https://pulsar.apache.org/docs/2.11.x/io-cdc-debezium/) page.

### Create a table with Pulsar

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](../sql/commands/sql-create-table.md) command and the [Pulsar](../create-source/create-source-pulsar.md) topic for more details. The data format must be Debezium JSON. 

 ```sql
CREATE TABLE source_name (
    column1 varchar,
    column2 integer,
    PRIMARY KEY (column1)
) 
WITH (
   connector='pulsar',
   topic='demo_topic',
   service.url='pulsar://localhost:6650/',
   admin.url='http://localhost:8080',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT DEBEZIUM_JSON;
```

</TabItem>
<TabItem value="kinesis" label="Kinesis">

### Set up AWS DMS

You can use AWS DMS to capture CDC data from PostgreSQL and set Kinese Data Streams as an AWS DMS target. For more details on the configurations for AWS DMS and Kinesis Data Streams, see [Stream change data to Amazon Kinesis Data Streams with AWS DMS](https://aws.amazon.com/blogs/big-data/stream-change-data-to-amazon-kinesis-data-streams-with-aws-dms/).

### Create a table with Kinesis

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](../sql/commands/sql-create-table.md) command and the [Kinesis](../create-source/create-source-kinesis.md) topic for more details. The data format must be Debezium JSON. 

```sql
CREATE TABLE source_name (
    column1 varchar,
    column2 integer,
    PRIMARY KEY (column1)
) 
WITH (
    connector='kinesis',
    stream='kafka',
    aws.region='user_test_topic',
    endpoint='172.10.1.1:9090,172.10.1.2:9090',
    aws.credentials.session_token='AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT+FvwqnKwRcOIfrRh3c/L To6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE/IvU1dYUg2RVAJBanLiHb4IgRmpRV3z rkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb/AXlzBBko7b15fjrBs2+cTQtp Z3CYWFXG8C5zqx37wnOE49mRl/+OtkIKGO7fAE',
    aws.credentials.role.arn='arn:aws-cn:iam::602389639824:role/demo_role',
    aws.credentials.role.external_id='demo_external_id'
)
ROW FORMAT DEBEZIUM_JSON;
```

</TabItem>
</Tabs>




