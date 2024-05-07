---
id: sql-drop-schema
title: DROP SCHEMA
description: Remove a schema.
slug: /sql-drop-schema
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-drop-schema/" />
</head>

Use the `DROP SCHEMA` command to remove a schema from a database.

Before you can remove a schema, you must remove all its dependent objects (tables, materialized views, etc.).


## Syntax

```sql
DROP SCHEMA [ IF EXISTS ] [database_name.]schema_name;
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('DROP SCHEMA'),
        rr.Optional(
            rr.Terminal('IF EXISTS')
        ),
        rr.Optional(
            rr.Sequence(
                rr.NonTerminal('database_name'),
                rr.Terminal('.')
            ),
        ),
        rr.NonTerminal('schema_name'),
        rr.Terminal(';'),
    )
);

<drawer SVG={svg} />




## Parameters

|Parameter or clause                 | Description           |
|---------------------------|-----------------------|
|**IF EXISTS** clause       |Do not return an error if the specified schema does not exist.|
|*database*                 |Specify the name of a database to remove the schema in that database. You can use [`SHOW  DATABASES`](sql-show-databases.md) to get a list of all available databases. If you don't specify a database, the specified schema in the default database will be removed.|
|*schema*                   |The name of the schema you want to remove. The default schema is `public`. You can use [`SHOW SCHEMAS`](sql-show-schemas.md) to get a list of all available schemas.|



## Examples

This statement removes the `rw_schema` schema from the `rw_db` database:

```sql
DROP SCHEMA rw_db.rw_schema;
```


This statement removes the `rw_schema` schema from the `dev` database (default database):

```sql
DROP SCHEMA rw_schema;
```


Use this statement if you don't want RisingWave to return an error if the schema you want to remove does not exist:

```sql
DROP SCHEMA IF EXISTS rw_schema;
```
