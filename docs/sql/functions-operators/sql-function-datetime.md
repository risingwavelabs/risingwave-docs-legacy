---
id: sql-function-datetime
slug: /sql-function-datetime
title: Date/time functions and operators
---



## Date/time operators

| Operation | Description | Example |
| ----------- | ----------- | ----------- |
| date + interval → timestamp | Add an interval to a date. | `date '2022-04-08' + interval '10 hour'` → `2022-04-08 10:00:00` |
| date - interval → timestamp | Subtract an interval to a date. | `date '2022-04-08' - interval '10 hour'` → `2022-04-07 14:00:00` |

## Date/time functions

|Function|Description|Example|
|---|---|---|
| EXTRACT (*field* FROM *source*) → numeric |Extract the value of a data or timestamp. <br /> *field* is one of: YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, DOY, DOW. <br /> *source* is one of: date,  timestamp.|`EXTRACT(day from date '2022-04-07')` → `7` <br /> `EXTRACT (hour from timestamp '2022-04-07 22:00:30')` → `22`|