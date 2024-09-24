---
 id: sink-to-postgres
 title: Sink data from RisingWave to PostgreSQL
 description: Sink data from RisingWave to PostgreSQL with the JDBC connector.
 slug: /sink-to-postgres
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-postgres/" />
</head>

This guide will show you how to sink data from RisingWave to PostgreSQL using the JDBC connector. The sink parameters are similar to those for other JDBC-available databases, such as MySQL. However, we will cover the configurations specific to PostgreSQL and how to verify that data is successfully sunk.

You can test out this process on your own device by using the `postgres-sink` demo in the [`integration_test directory`](https://github.com/risingwavelabs/risingwave/tree/main/integration_tests) of the RisingWave repository.

## Set up a PostgreSQL database

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="AWS_rds_pg" label="AWS RDS">

### Set up a PostgreSQL RDS instance on AWS

Here we will use a standard class instance without Multi-AZ deployment as an example.

1. Log in to the AWS console. Search “RDS” in services and select the RDS panel.

2. Create a database with **PostgreSQL** as the **Engine** type. We recommend setting up a username and password or using other security options.

3. When the new instance becomes available, click on its panel.

4. From the Connectivity panel, we can find the endpoint and connection port information.

    ![Postgres connectivity info](../images/pg-connection.png)

### Connect to the RDS instance from Postgres

Now we can connect to the RDS instance. Make sure you have installed psql on your local machine, and start a psql prompt. Fill in the endpoint, the port, and login credentials in the connection parameters.

```terminal
psql --host = pg-to-rw.xxxxxx.us-east-1.rds.amazonaws.com --port=5432 --username=awsuser --password
```

For more login options, refer to the [RDS connection guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html).

</TabItem>
<TabItem value="pg_self_hosted" label="Self-hosted" default>

### Launch and set up PostgreSQL

To install PostgreSQL locally, see their [download options](https://www.postgresql.org/download/).

:::note

If you are using the demo version, connect to PostgreSQL with the following command. Ensure that all other programs are disconnected from port 5432.

```terminal
psql postgresql://myuser:123456@127.0.0.1:5432/mydb
```

:::

Ensure that the Postgres user is granted the following privileges on the used table with the following SQL query.

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON [table_name] TO [username];
```

</TabItem>
</Tabs>

### Create a table in PostgreSQL

Use the following query to set up a table in PostgreSQL. We will sink to this table from RisingWave.

```sql
CREATE TABLE target_count (
  target_id VARCHAR(128) PRIMARY KEY,
  target_count BIGINT
);
```

## Set up RisingWave

### Install and launch RisingWave

To install and start RisingWave locally, see the [Get started](/get-started.md) guide. We recommend running RisingWave locally for testing purposes.

### Notes about running RisingWave from binaries

If you are running RisingWave locally from binaries and intend to use the native CDC source connectors or the JDBC sink connector, make sure you have [JDK 11](https://openjdk.org/projects/jdk/11/) or later versions installed in your environment.

## Create a sink​

### Syntax​

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='jdbc',
   field_name = 'field', ...
);
```

### Parameters​

All `WITH` options are required unless noted.

|Parameter or clause|Description|
|---|---|
|sink_name| Name of the sink to be created.|
|sink_from| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or a SELECT query must be specified.|
|AS select_query| A SELECT query that specifies the data to be output to the sink. Either this query or a FROM clause must be specified.See [SELECT](/sql/commands/sql-select.md) for the syntax and examples of the SELECT command.|
|connector| Sink connector type must be `'jdbc'` for PostgresQL sink. |
|jdbc.url | The JDBC URL of the destination database necessary for the driver to recognize and connect to the database. |
|jdbc.query.timeout|Specifies the timeout for the operations to downstream. If not set, the default is 10 minutes.|
|table.name | The table in the destination database you want to sink to. |
|schema.name | Optional. The schema in the destination database you want to sink to. The default value is `public`. |
|type| Sink data type. Supported types:<ul><li> `append-only`: Sink data as INSERT operations.</li><li> `upsert`: Sink data as UPDATE, INSERT and DELETE operations. </li></ul>|
|primary_key| Required if `type` is `upsert`. The primary key of the sink, which should match the primary key of the downstream table. |

## Sink data from RisingWave to PostgreSQL

### Create source and materialized view

You can sink data from a table or a materialized view in RisingWave to PostgreSQL.

For demonstration purposes, we'll create a source and a materialized view, and then sink data from the materialized view. If you already have a table or materialized view to sink data from, you don't need to perform this step.

Run the following query to create a source to read data from a Kafka broker.

```sql
CREATE SOURCE user_behaviors (
    user_id VARCHAR,
    target_id VARCHAR,
    target_type VARCHAR,
    event_timestamp TIMESTAMPTZ,
    behavior_type VARCHAR,
    parent_target_type VARCHAR,
    parent_target_id VARCHAR
) WITH (
    connector = 'kafka',
    topic = 'user_behaviors',
    properties.bootstrap.server = 'message_queue:29092',
    scan.startup.mode = 'earliest'
) FORMAT PLAIN ENCODE JSON;
```

Next, we will create a materialized view that queries the number of targets for each `target_id`. Note that the materialized view and the target table share the same schema.

```sql
CREATE MATERIALIZED VIEW target_count AS
SELECT
    target_id,
    COUNT(*) AS target_count
FROM
    user_behaviors
GROUP BY
    target_id;
```

### Sink from RisingWave

Use the following query to sink data from the materialized view to the target table in PostgreSQL. Ensure that the `jdbc_url` is accurate and reflects the PostgreSQL database that you are connecting to. See [`CREATE SINK`](/sql/commands/sql-create-sink.md) for more details.

```sql
CREATE SINK target_count_postgres_sink FROM target_count WITH (
    connector = 'jdbc',
    jdbc.url = 'jdbc:postgresql://postgres:5432/mydb?user=myuser&password=123456',
    table.name = 'target_count',
    type = 'upsert',
    primary_key = 'target_id'
);
```

### Verify update

To ensure that the target table has been updated, query from `target_count` in PostgreSQL.

```sql
SELECT * FROM target_count
LIMIT 10;
```

## Data type mapping

For the PostgreSQL data type mapping table, see the [Data type mapping table](/guides/ingest-from-postgres-cdc.md#data-type-mapping) under the Ingest data from PostgreSQL CDC topic.

Additional notes regarding sinking data to PostgreSQL:

- A `varchar` column in RisingWave can be sinked to a `uuid` column in Postgres.

- Only one-dimensional arrays in RisingWave can be sinked to PostgreSQL.

- For array type, we only support `smallint`, `integer`, `bigint`, `real`, `double precision`, and `varchar` type now.
