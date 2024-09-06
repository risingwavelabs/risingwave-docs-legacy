---
id: sql-alter-source
title: ALTER SOURCE
description: Modify existing source name.
slug: /sql-alter-source
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-source/" />
</head>

Use the `ALTER SOURCE` command to add columns to the source or modify the name of the source. If your source was created with a schema registry, columns cannot be altered.

## Syntax

```sql
ALTER SOURCE current_source_name
    {ADD COLUMN col_name data_type | RENAME TO new_source_name} ;
```

## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*current_source_name*               |The current name of the source you want to modify.|
|*col_name* | The name of the new column you want to add to the source.|
|*data_type* | The data type of the newly added column. With the struct data type, you can create a nested table. Elements in a nested table need to be enclosed with angle brackets (`<>`).|
|**ADD COLUMN** |Indicates the intention to add a column to the specified source.|
|**RENAME TO**  |Indicates the intention to rename the specified source.|
|*new_source_name*      |The new name you want to assign to the source object.|

## Example

```sql
ALTER SOURCE src
   RENAME TO src1;
```

```sql
ALTER SOURCE src1
    ADD COLUMN v3 int;
```