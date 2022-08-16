---
id: sql-function-datetime
slug: /sql-function-datetime
title: Date/time functions and operators
---



## Date/time operators

| Operation | Description | Example |
| ----------- | ----------- | ----------- |
| date + interval → timestamp | Add an interval to a date. | `date '2022-04-08' + interval '10 hour'` → `2022-04-08 10:00:00` |
| date - interval → timestamp | Subtract an interval from a date. | `date '2022-04-08' - interval '10 hour'` → `2022-04-07 14:00:00` |
| date + int → date | Add an integer to a date. | `date '2022-06-23' + 4` → `2022-06-27` <br /> `4 + Date '2022-06-23'` → `2022-06-27` |
| date - int → date | Subtract an int from a date. | `date '2022-06-23' - 4` → `2022-06-19` |
| date + time → timestamp | Add time to a date. | `date '2022-06-23' + time '19:24:00'` → `2022-06-23 19:24:00` <br /> `time '19:24:00' +  date '2022-06-23'` → `2022-06-23 19:24:00` |
| time - time → time | Subtract time from time. | `time '18:20:49' -  time '16:07:16'` → `02:13:33` |
| time + interval → time | Add an interval to time. | `time '18:20:49' +  interval '1 hour'` → `19:20:49` |
| time - interval → time | Subtract an interval from time. | `time '18:20:49' -  interval '2 hours'` → `16:20:49` |
| interval = interval → bool | Compare interval equality. | `interval '1' month = interval '30' day` → `t` |


## Date/time functions

|Function|Description|Example|
|---|---|---|
| EXTRACT (*field* FROM *source*) → numeric |Extract the value of a data or timestamp. <br /> *field* is one of: YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, DOY, DOW. <br /> *source* is one of: date,  timestamp.|`EXTRACT(day from date '2022-04-07')` → `7` <br /> `EXTRACT (hour from timestamp '2022-04-07 22:00:30')` → `22`|
