---
id: sql-alter-source
title: ALTER SOURCE
description: Modify existing source name.
slug: /sql-alter-source
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-source/" />
</head>

Use the `ALTER SOURCE` command along with `RENAME TO` to modify the existing source name.

## Syntax

```sql
ALTER SOURCE current_source_name
   RENAME TO new_source_name;
```

## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*current_source_name*               |The current name of the source you want to modify.|
|**RENAME TO**  |Indicates the intention to rename the specified source.|
|*new_source_name*      |The new name you want to assign to the source object.|

## Example

```sql
ALTER SOURCE src
   RENAME TO src1;
```
