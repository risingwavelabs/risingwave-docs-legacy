---
 id: ingest-from-citus-cdc
 title: Ingest data from Citus CDC
 description: Describes how to ingest data from Citus CDC.
 slug: /ingest-from-citus-cdc
---

Change Data Capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time.

Citus database is an extension to PostgreSQL that transforms PostgreSQL into a distributed database. For more details, see [Citus data](https://www.citusdata.com).

## Set up Citus

1. Create a `superuser` role in the Citus cluster.

    ```sql
    ---create role on coordinator node
    CREATE ROLE dbz Superuser LOGIN;

    ---create role on worker nodes
    SELECT run_command_on_workers ($cmd$
    CREATE ROLE dbz Superuser LOGIN;
    $cmd$);
    ```

2. Ensure that `wal_level` is `logical` on each worker node by modifying `postgresql.conf`.

3. Set the replica identity to `FULL` for the table you want to ingest data from.

    ```sql
    ---execute on coordinator node
    ALTER TABLE github_events REPLICA IDENTITY FULL;
    ```

### Limitations

There are a few limitations when ingesting CDC data from Citus in RisingWave.

- A PostgreSQL `superuser` role is required.
- Only [distributed tables](https://docs.citusdata.com/en/v10.2/get_started/concepts.html#table-types) are supported.
- Newly added worker nodes are not detected.

## Enable the connector node in RisingWave

The native CDC connector is implemented by the connector node in RisingWave. The connector node handles the connections with upstream and downstream systems.

The connector node is enabled by default in the docker-compose configuration. To learn about how to start RisingWave with this configuration, see [Docker Compose](/deploy/risingwave-docker-compose.md).

If you are running RisingWave locally with the pre-built library or with the source code, the connector node needs to be started separately. To learn about how to start the connector node in this case, see [Enable the connector node](/deploy/risingwave-trial.md/?method=binaries#optional-enable-the-connector-node).

## Create a table in RisingWave using the native CDC connector

### Syntax

Note that a primary key must be specified.

```sql
CREATE TABLE [ IF NOT EXISTS ] source_name (
    column_name data_type PRIMARY KEY , ...
    [PRIMARY KEY ( column_name, ... )]
) 
WITH (
    connector='citus-cdc',
    <field>=<value>, ...
);
```

### WITH parameters

Unless specified otherwise, the fields listed are required. 

|Field|Notes|
|---|---|
|hostname| Hostname of the coordinator node.|
|port| Port number of the coordinator node.|
|username| Username of the database.|
|password| Password of the database. |
|database.servers| The host and port of Citus worker nodes.|
|database.name| Name of the database.|
|schema.name| Optional. Name of the schema. By default, the value is `public`. |
|table.name| Name of the table that you want to ingest data from. |
|slot.name| Optional. The slot name for each source. Each source should have a unique slot name.|

### Example

```sql
CREATE TABLE github_events_rw (
    event_id bigint,
    event_type text,
    event_public boolean,
    repo_id bigint,
    payload jsonb,
    repo jsonb,
    user_id bigint,
    org jsonb,
    created_at timestamp,
    PRIMARY KEY (event_id, user_id)
) WITH (
    connector = 'citus-cdc',
    hostname = '127.0.0.1',
    port = '5432',
    username = 'dbz',
    password = '123456',
    database.servers = '172.31.29.245:5432,172.31.31.177:5432',
    database.name = 'postgres',
    schema.name = 'public',
    table.name = 'github_events',
    slot.name = 'github_events_dbz_slot1',
);
```