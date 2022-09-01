---
id: sql-function-datetime
slug: /sql-function-datetime
title: Date/time functions and operators
---



## Date/time operators

| Operation | Description | Example |
| ----------- | ----------- | ----------- |
| date + interval → timestamp | Add an interval to a date. | `date '2022-04-08' + interval '10 hour'` → `2022-04-08 10:00:00` |
| interval / int → time | Divide an interval by an int. Error is thrown for division by zero. | `interval '14000' / int '14'` → `00:16:40` |
| interval / float → time | Divide an interval by a float. Error is thrown for division by zero. | `interval '20' / float '12.5'` → `00:00:1.6` |
| interval / decimal → time | Divide an interval by a decimal. Error is thrown for division by zero. | `interval '12 days' / 4.2` → `2 days 20:34:17.143` |
| date - interval → timestamp | Subtract an interval from a date. | `date '2022-04-08' - interval '10 hour'` → `2022-04-07 14:00:00` |
| date + int → date | Add a number of days to a date. | `date '2022-06-23' + 4` → `2022-06-27` <br /> `4 + Date '2022-06-23'` → `2022-06-27` |
| date - int → date | Subtract a number of days from a date. | `date '2022-06-23' - 4` → `2022-06-19` |
| date + time → timestamp | Add a time to a date. | `date '2022-06-23' + time '19:24:00'` → `2022-06-23 19:24:00` <br /> `time '19:24:00' +  date '2022-06-23'` → `2022-06-23 19:24:00` |
| time - time → time | Subtract a time from a time. | `time '18:20:49' -  time '16:07:16'` → `02:13:33` |
| time + interval → time | Add an interval to a time. | `time '18:20:49' +  interval '1 hour'` → `19:20:49` |
| time - interval → time | Subtract an interval from a time. | `time '18:20:49' -  interval '2 hours'` → `16:20:49` |
| interval = interval → bool | Compare interval equality. | `interval '1' month = interval '30' day` → `t` |
| real * interval → time | Multiply an interval by a float. | `real '6.1' * interval '1' second` → `00:00:06.1` <br /> `interval '1' second * real '6.1'` → `00:00:06.1` |

## Date/time functions

|Function|Description|Example|
|---|---|---|
| EXTRACT (*field* FROM *source*) → numeric |Extract the value of a data or timestamp. <br /> *field* is one of: YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, DOY, DOW. <br /> *source* is one of: date,  timestamp.|`EXTRACT(day from date '2022-04-07')` → `7` <br /> `EXTRACT (hour from timestamp '2022-04-07 22:00:30')` → `22`|
| to_char (timestamp, text) → text |Converts time stamp to string according to the given format.|`to_char(timestamp '2002-04-20 17:31:12.66', 'HH12:MI:SS')` → `05:31:12` <br /> `to_char(timestamp '2006-01-02 15:04:05', 'YYYY-MM-DD HH24:MI:SS')` → `2006-01-02 15:04:05`|
