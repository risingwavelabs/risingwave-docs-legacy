---
id: sql-show-cursors
title: SHOW CURSORS
description: Show all cursors in the current session.
slug: /sql-show-cursors
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-cursors/" />
</head>

Use the `SHOW CURSORS` command to display all cursors in the current session.

## Syntax

```sql
SHOW CURSORS;
```

## Examples

```sql
SHOW CURSORS;

------RESULT
 Name
-----------
 my_cursor
(1 row)
```
