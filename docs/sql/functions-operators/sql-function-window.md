---
id: sql-function-window
slug: /sql-function-window
title: Window functions
---
Window or windowing functions perform a calculation over a set of rows. The window is defined by the **OVER** clause, which specifies if the rows are partitioned into smaller sets, if they are ordered, and the range of rows.

## Syntax

```sql
window_function OVER ([PARTITION BY column_name ] [ORDER BY column_name,] [rows constant_or_range]) [AS output_name];
```

Supported window functions are:

- avg
- sum
- min
- lag(column_name, lag_number)
- lead(column_name, lead_number)
- first_value (column_name)
- row_number()
