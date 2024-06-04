---
id: sql-create-schema
title: CREATE SCHEMA
description: Create a new schema.
slug: /sql-create-schema
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-schema/" />
</head>

Use the `CREATE SCHEMA` command to create a new schema.

## Syntax

```sql
CREATE SCHEMA [IF NOT EXISTS] [database_name.]schema_name [AUTHORIZATION user_name];

CREATE SCHEMA [ IF NOT EXISTS ] AUTHORIZATION user_name;
```



## Parameters
|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The name of the schema to be created.|
|<b>IF NOT EXISTS</b> clause      |Creates a schema if the schema name has not already been used. Otherwise throws an error.|
|*database_name*                 |The name of the database for the schema to be created in. If not specified, the schema will be created in the default database `dev`.|
|<b>AUTHORIZATION</b> clause|Specifies the owner or authorized user of the schema. If the *schema_name* is omitted, the *user_name* is used as the schema name. See the examples below for more details.|
|*user_name*|Specifies the username of the owner or authorized user of the schema.|

## Examples

```sql
CREATE SCHEMA IF NOT EXISTS schema_1;
```

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::

```sql title="Examples of AUTHORIZATION clause"

-- Create a new schema for the user 'joe'. As the schema name is ommited, the schema name is default to the user name 'joe'.
CREATE SCHEMA IF NOT EXISTS AUTHORIZATION joe;

----RESULT
CREATE_SCHEMA

-- Create a new schema named 'new_schema', and assign 'joe' as the owner.
CREATE SCHEMA IF NOT EXISTS new_schema AUTHORIZATION joe;

----RESULT
CREATE_SCHEMA

-- Display the existing schemas. You will see 'joe' and 'new_schema'.
SHOW SCHEMAS;

----RESULT
        Name
--------------------
 information_schema
 public
 pg_catalog
 joe
 new_schema
 rw_catalog
(6 rows)
```