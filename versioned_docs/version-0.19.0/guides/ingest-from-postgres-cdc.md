---
 id: ingest-from-postgres-cdc
 title: Ingest data from PostgreSQL CDC
 description: Describes how to ingest data from PostgreSQL CDC.
 slug: /ingest-from-postgres-cdc
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-postgres-cdc/" />
</head>

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time.

RisingWave supports ingesting CDC data from PostgreSQL. Versions 10, 11, 12, 13, and 14 of PostgreSQL are supported.

You can ingest CDC data from PostgreSQL into RisingWave in two ways:

- Using the built-in PostgreSQL CDC connector

  With this connector, RisingWave can connect to PostgreSQL databases directly to obtain data from the binlog without starting additional services.

  :::caution Beta feature
  The built-in PostgreSQL CDC connector in RisingWave is currently in Beta. Please use with caution as stability issues may still occur. Its functionality may evolve based on feedback. Please report any issues encountered to our team.
  :::

- Using a CDC tool and a message broker

  You can use a CDC tool then use the Kafka, Pulsar, or Kinesis connector to send the CDC data to RisingWave. For more details, see the [Create source via event streaming systems](/create-source/create-source-cdc.md) topic.

## Set up PostgreSQL

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="pg_self_hosted" label="Self-hosted" default>

1. Ensure that `wal_level` is `logical`. Check by using the following statement.

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

   ```shell
   dev-# \du
                                      List of roles
   Role name |                         Attributes                         | Member of
   -----------+-----------------------------------------------------------+---------
   rw        | Create DB, Replication                                     | {}
   postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
   ```

3. Grant required privileges to the user.

   Run the following statements to grant the required privileges to the user.

   ```sql
   GRANT CONNECT ON DATABASE <database_name> TO <username>;
   GRANT USAGE ON SCHEMA <schema_name> TO <username>;
   GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <username>;
   ```

   You can use the following statement to check the privileges of the user to the tables:

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

4. Grant the RDS replication privileges to the user.

   ```sql
   GRANT rds_replication TO <username>;
   ```

</TabItem>
</Tabs>

## Enable the connector node in RisingWave

The native PostgreSQL CDC connector is implemented by the connector node in RisingWave. The connector node handles the connections with upstream and downstream systems.

The connector node is enabled by default in this docker-compose configuration. To learn about how to start RisingWave with this configuration, see [Docker Compose](/deploy/risingwave-trial.md/?method=docker-compose).

If you are running RisingWave locally with the pre-built library or with the source code, the connector node needs to be started separately. To learn about how to start the connector node in this case, see [Enable the connector node](/deploy/risingwave-trial.md/?method=binaries#optional-enable-the-connector-node).

## Create a table using the native CDC connector

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](/sql/commands/sql-create-table.md) command for more details. The data format must be Debezium JSON.

### Syntax

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

<Drawer SVG={svg} />

Note that a primary key is required.

### WITH parameters

Unless specified otherwise, the fields listed are required.

| Field         | Notes                                                                                                                                                                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| hostname      | Hostname of the database.                                                                                                                                                                                                                                                  |
| port          | Port number of the database.                                                                                                                                                                                                                                               |
| username      | Username of the database.                                                                                                                                                                                                                                                  |
| password      | Password of the database.                                                                                                                                                                                                                                                  |
| database.name | Name of the database.                                                                                                                                                                                                                                                      |
| schema.name   | Optional. Name of the schema. By default, the value is `public`.                                                                                                                                                                                                           |
| table.name    | Name of the table that you want to ingest data from.                                                                                                                                                                                                                       |
| slot.name     | Optional. The [replication slot](https://www.postgresql.org/docs/14/logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS) for this PostgreSQL source. By default, a unique slot name will be randomly generated. Each source should have a unique slot name. |

:::note
RisingWave implements CDC via PostgresQL replication. Inspect the current progress via the [`pg_replication_slots`](https://www.postgresql.org/docs/14/view-pg-replication-slots.html) view. Remove inactive replication slots via [`pg_drop_replication_slot()`](https://www.postgresql.org/docs/current/functions-admin.html#:~:text=pg_drop_replication_slot).
:::

### Data format

Data is in Debezium JSON format. [Debezium](https://debezium.io) is a log-based CDC tool that can capture row changes from various database management systems such as PostgreSQL, MySQL, and SQL Server and generate events with consistent structures in real time. The PostgreSQL CDC connector in RisingWave supports JSON as the serialization format for Debezium data. The data format does not need to be specified when creating a table with `postgres-cdc` as the source.

### Example

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
 table.name = 'shipments'
);
```
