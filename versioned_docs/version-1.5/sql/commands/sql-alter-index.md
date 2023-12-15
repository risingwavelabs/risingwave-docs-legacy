---
id: sql-alter-index
title: ALTER INDEX
description: Modify the properties of an index.
slug: /sql-alter-index
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-index/" />
</head>

The `ALTER INDEX` command modifies the definition of an index.

## Syntax

```sql
ALTER INDEX index_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the index. For all supported clauses, see the sections below.


## Clause

### `RENAME TO`

```sql title=Syntax
ALTER INDEX index_name 
    RENAME TO new_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**RENAME TO**|This clause changes the name of the index. If the index is associated with a table constraint (either `UNIQUE`, `PRIMARY KEY`, or `EXCLUDE`), the constraint is renamed as well. There is no effect on the stored data.|
|*new_name*|The new name of the index.|

```sql title=Example
-- Change the name of the index "idx_1" to "idx_2"
ALTER INDEX idx_1 RENAME TO idx_2.
```
