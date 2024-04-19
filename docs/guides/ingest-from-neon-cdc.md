---
 id: ingest-from-neon-cdc
 title: Ingest data from Neon CDC
 description: Describes how to ingest data from Neon CDC.
 slug: /ingest-from-neon-cdc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-neon-cdc/" />
</head>

Neon is a Serverless Postgres designed for the cloud that separates compute and storage to offer modern developer features such as autoscaling, branching, bottomless storage, and others.

Follow these steps to ingest CDC data from Neon into RisingWave:

## 1. Sign up for a Neon Cloud account

Start by signing up for a free Neon Cloud account, which will grant you access to PostgreSQL services. To create your account, visit [Neon Cloud Account](https://console.neon.tech/sign_in).

## 2. Create your first Neon project

Navigate to the Neon Console and select "Create a project." Assign a name and region to your first Neon PostgreSQL project. You will be presented with connection details for your Neon project, so be sure to save them for later use when connecting to your PostgreSQL server.

## 3. Connect to the Neon PostgreSQL server

You can connect to Neon through the SQL Editor in Neon, psql, or from other clients or applications.

For more information about Neon, please refer to the [official documentation of Neon](https://neon.tech/docs/introduction).

## 4. Configure Neon for CDC
1. Ensure that `wal_level` is `logical`. Check by using the following statement.

    ```sql
    SHOW wal_level;
    ```

    By default, it is `replica`. For CDC, you will need to set it to logical through the SQL Editor in Neon, psql, or from other clients. The following command will change the `wal_level`.

    ```sql
    ALTER SYSTEM SET wal_level = logical;
    ```
2. Assign `REPLICATION`, `LOGIN`，and `CREATEDB` role attributes to the user.

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

4. Grant required privileges to the user.

    Run the following statements to grant the required privileges to the user.

    ```sql
    GRANT CONNECT ON DATABASE <database_name> TO <username>;   
    GRANT USAGE ON SCHEMA <schema_name> TO <username>;  
    GRANT SELECT ON ALL TABLES IN SCHEMA <schema_name> TO <username>; 
    GRANT CREATE ON DATABASE <database_name> TO <username>;
    ```

    You can use the following statement to check the privileges of the user to the tables:

    ```sql
    postgres=# SELECT table_name, grantee, privilege_type
    FROM information_schema.role_table_grants
    WHERE  grantee='<username>';
    ```

    An example result based on three tables that we created in Neon:

    ```sql
     table_name | grantee | privilege_type
     -----------+---------+----------------
     customer   | rw      | SELECT
     orders     | rw      | SELECT
     supplier   | rw      | SELECT
     (3 rows)
    ```
## 5. Ingest CDC data from Neon into RisingWave
    
The following example creates a table in RisingWave that reads CDC data from the `customer` table in Neon. The `customer` table is in the `public` schema within the `dev` database. When connecting to a specific table in Neon, use the `CREATE TABLE` command.

```sql
CREATE TABLE customer (
    customer_id INTEGER,
    customer_name VARCHAR,
    email VARCHAR,
    phone_number VARCHAR
    PRIMARY KEY (customer_id)
) WITH (
    connector = 'postgres-cdc',
    hostname = '127.0.0.1',
    port = '5432',
    username = 'postgres',
    password = 'postgres',
    database.name = 'dev',
    schema.name = 'public',
    table.name = 'customer'
);
```
Similarly, you can create another table reading CDC data in RisingWave based on the `orders` table in Neon with a `public` schema within the `dev` database.
```sql
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    order_timestamp TIMESTAMP,
    total_amount NUMERIC,
    status VARCHAR
) WITH (
    connector = 'postgres-cdc',
    hostname = '127.0.0.1',
    port = '5432',
    username = 'postgres',
    password = 'postgres',
    database.name = 'dev',
    schema.name = 'public',
    table.name = 'order'
);
```
After the table is created, you can view and transform the CDC data from Neon based on your needs.

:::note
RisingWave supports creating a single PostgreSQL source that allows you to read CDC data from multiple tables located in the same database. Our Neon connector also supports this feature. For further information, refer to the [PostgreSQL CDC](https://docs.risingwave.com/docs/current/ingest-from-postgres-cdc/) in the documentation.
:::
