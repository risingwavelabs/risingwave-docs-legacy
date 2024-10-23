---
id: sql-create-database
title: CREATE DATABASE
description: Create a new database.
slug: /sql-create-database
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-database/" />
</head>

Use the `CREATE DATABASE` command to create a new database.

## Syntax

```sql
CREATE DATABASE [ IF NOT EXISTS ] database_name
    [ WITH ] [ OWNER [=] user_name ];
```



## Parameters
|Parameter or clause            | Description           |
|-------------------------------|-----------------------|
|*database_name*                |The name of the database to be created.|
|<b>IF NOT EXISTS</b> clause    |Creates a database if the database name has not already been used. Otherwise throws an error.|
|<b>OWNER [=] user_name</b> clause|Specifies the user who owns the database to be created.|

## Example
```sql
CREATE DATABASE IF NOT EXISTS travel
    WITH OWNER = travel_admin;
```

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive. See also [Identifiers](/sql/sql-identifiers.md).

:::