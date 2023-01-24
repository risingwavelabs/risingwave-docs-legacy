---
id: sql-create-database
title: CREATE DATABASE
description: Create a new database.
slug: /sql-create-database
---

Use the `CREATE DATABASE` command to create a new database.

## Syntax

```sql
CREATE DATABASE [ IF NOT EXISTS ] database_name;
```
## Parameters
|Parameter or clause            | Description           |
|-------------------------------|-----------------------|
|*database_name*                |The name of the database to be created.|
|<b>IF NOT EXISTS</b> clause    |Creates a database if the database name has not already been used. Otherwise throws an error.|

## Example
```sql
CREATE DATABASE IF NOT EXISTS travel;
```