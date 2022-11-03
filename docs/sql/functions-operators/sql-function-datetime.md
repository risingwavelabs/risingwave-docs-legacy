---
id: sql-function-datetime
slug: /sql-function-datetime
title: Date and time functions and operators
---



## Date and time operators

| Operation | Description | Example |
| ----------- | ----------- | ----------- |
| date + interval → timestamp | Adds an interval to a date. | `date '2022-04-08' + interval '10 hour'` → `2022-04-08 10:00:00` |
| interval / int → time | Divides an interval by an int. Error is thrown for division by zero. | `interval '14000' / int '14'` → `00:16:40` |
| interval / float → time | Divides an interval by a float. Error is thrown for division by zero. | `interval '20' / float '12.5'` → `00:00:1.6` |
| interval / decimal → time | Divides an interval by a decimal. Error is thrown for division by zero. | `interval '12 days' / 4.2` → `2 days 20:34:17.143` |
| date - interval → timestamp | Subtracts an interval from a date. | `date '2022-04-08' - interval '10 hour'` → `2022-04-07 14:00:00` |
| date + int → date | Adds a number of days to a date. | `date '2022-06-23' + 4` → `2022-06-27` <br /> `4 + Date '2022-06-23'` → `2022-06-27` |
| date - int → date | Subtracts a number of days from a date. | `date '2022-06-23' - 4` → `2022-06-19` |
| date + time → timestamp | Adds a time to a date. | `date '2022-06-23' + time '19:24:00'` → `2022-06-23 19:24:00` <br /> `time '19:24:00' +  date '2022-06-23'` → `2022-06-23 19:24:00` |
| time - time → time | Subtracts a time from a time. | `time '18:20:49' -  time '16:07:16'` → `02:13:33` |
| time + interval → time | Adds an interval to a time. | `time '18:20:49' +  interval '1 hour'` → `19:20:49` |
| time - interval → time | Subtracts an interval from a time. | `time '18:20:49' -  interval '2 hours'` → `16:20:49` |
| interval = interval → bool | Compares interval equality. | `interval '1' month = interval '30' day` → `t` |
| real * interval → time | Multiplies an interval by a float. | `real '6.1' * interval '1' second` → `00:00:06.1` <br /> `interval '1' second * real '6.1'` → `00:00:06.1` |

## Date and time functions

|Function|Description|Example|
|---|---|---|
| extract ( *field* FROM *source* ) → *numeric_ouput* | Extracts the value of a date or timestamp. <br /> *field* can be year, month, day, hour, minute, second, doy, or dow. <br /> *source* can be the date or timestamp.|`extract(day from date '2022-04-07')` → `7` <br /> `extract(hour from timestamp '2022-04-07 22:00:30')` → `22`|
| extract ( epoch FROM timestamp with time zone ) → *seconds_decimal_output* | Converts the value of timestamp with time zone to Unix epoch seconds (the number of seconds since 1970-01-01 00:00:00 UTC). Negative for timestamps prior to that.|`extract(epoch from '2010-01-01 12:34:56.789012Z'::timestamp with time zone)` → `1262349296.789012`|
| to_char ( *timestamp*, *format* ) → *string_ouput* |Converts timestamp to string according to the given format. Both uppercase and lowercase formats are supported.|`to_char(timestamp '2002-04-20 17:31:12.66', 'HH12:MI:SS')` → `05:31:12` <br /> `to_char(timestamp '2006-01-02 15:04:05', 'yyyy-mm-dd hh24:mi:ss')` → `2006-01-02 15:04:05`|
| to_timestamp ( *seconds_double_precision* ) → *timestamp_with_time_zone_output* |Converts Unix epoch seconds (the number of seconds since 1970-01-01 00:00:00+00) to timestamp with time zone.|`to_timestamp(1262349296.7890123)` → `2010-01-01 12:34:56.789012+00:00`|
