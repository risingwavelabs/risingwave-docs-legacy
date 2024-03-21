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

Follow these steps to successfully ingest CDC data from Neon into RisingWave:

## 1. Sign Up for a Neon Cloud Account

Start by signing up for a free Neon Cloud account, which will grant you access to PostgreSQL services. To create your account, visit [Neon Cloud Account](https://console.neon.tech/sign_in).

## 2. Create Your First Neon Project

Navigate to the Neon Console and select "Create a project." Assign a name and region to your first Neon PostgreSQL project. You will be presented with connection details for your Neon project, so be sure to save them for later use when connecting to your PostgreSQL server.

## 3. Connect to the Neon PostgreSQL Server

You can connect to Neon through Neon's SQL Editor, psql, or from other clients or applications.

For more information about Neon, please refer to [Neon's official documentation](https://neon.tech/docs/introduction).

## 4. Configure Neon for CDC
1. Ensure that `wal_level` is `logical`. Check by using the following statement.

    ```sql
    SHOW wal_level;
    ```

    By default, it is `replica`. For CDC, you will need to set it to logical through Neon's SQL Editor, psql, or from other clients. The following command will change the `wal_level`.

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

3. Grant required privileges to the user.

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

    An example result:

    ```sql
     table_name | grantee | privilege_type
     -----------+---------+----------------
     customer   | rw      | SELECT
     orders     | rw      | SELECT
     supplier   | rw      | SELECT
     region     | rw      | SELECT
     (4 rows)
    ```

      
