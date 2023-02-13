---
id: sql-function-datetime
slug: /sql-function-datetime
title: Date and time functions and operators
---



## Timespan operators

| Operation | Description | Example |
| ----------- | ----------- | ----------- |
| interval * double precision → interval | Multiplies an interval by a double. | `real '6.1' * interval '1' second` → `00:00:06.1` <br /> `interval '1' second * real '6.1'` → `00:00:06.1` |
| interval / double precision → interval | Divides an interval by a double. Error is thrown for division by zero. | `interval '12 days' / 4.2` → `2 days 20:34:17.143` <br /> `interval '14000' / int '14'` → `00:16:40`|
| interval + interval → interval | Adds an interval to an interval. | `interval '20' hour + interval '10' hour` → `30:00:00`|
| interval - interval → interval | Subtracts an interval from an interval. | `interval '20' hour - interval '10' hour` → `10:00:00`|
| time + interval → time | Adds an interval to a time. | `time '18:20:49' +  interval '1 hour'` → `19:20:49` |
| time - interval → time | Subtracts an interval from a time. | `time '18:20:49' -  interval '2 hours'` → `16:20:49` |
| time - time → interval | Subtracts a time from a time. | `time '18:20:49' -  time '16:07:16'` → `02:13:33` |



## Offsetting operators

| Operation | Description | Example |
| ----------- | ----------- | ----------- |
| timestamp + interval → timestamp | Adds an interval to a timestamp. | `'2022-03-13 01:00:00'::timestamp + interval '24' hour` → `2022-03-14 01:00:00` |
| timestamp - interval → timestamp | Subtracts an interval from a timestamp. | `'2022-03-14 01:00:00'::timestamp - interval '24' hour` → `2022-03-13 01:00:00` |
| timestamp - timestamp → interval | Subtracts a timestamp from a timestamp. | `'2022-03-13 03:00:00'::timestamp - '2022-03-13 01:00:00'` → `02:00:00` |
| date + int → date | Adds a number of days to a date. | `date '2022-06-23' + 4` → `2022-06-27` <br /> `4 + Date '2022-06-23'` → `2022-06-27` |
| date - int → date | Subtracts a number of days from a date. | `date '2022-06-23' - 4` → `2022-06-19` |
| date - date → int | Subtracts a date from a date. | `date '2020-03-01' - '2020-02-01'` → `29` |
| date + interval → timestamp | Adds an interval to a date. | `date '2022-04-08' + interval '10 hour'` → `2022-04-08 10:00:00` |
| date - interval → timestamp | Subtracts an interval from a date. | `date '2022-04-08' - interval '10 hour'` → `2022-04-07 14:00:00` |
| date + time → timestamp | Adds a time to a date. | `date '2022-06-23' + time '19:24:00'` → `2022-06-23 19:24:00` <br /> `time '19:24:00' +  date '2022-06-23'` → `2022-06-23 19:24:00` |



## Timestamp with time zone operators

| Operation | Description | Example |
| ----------- | ----------- | ----------- |
| *timestamp_value* AT TIME ZONE *zone* → *timestamptz_value* <br /><br /> *timestamptz_value* AT TIME ZONE *zone* → *timestamp_value* | Converts times from timestamp to timestamptz (i.e., timestamp with time zone) or timestamptz to timestamp. Invalid local time during daylight saving forward is not supported. Ambiguous local time during daylight saving backward is interpreted as after the transition. | `'2021-12-31 16:00:00'::timestamp AT TIME ZONE 'us/pacific'` → `2022-01-01 00:00:00+00:00` <br /><br /> `'2022-01-01 00:00:00Z'::timestamptz AT TIME ZONE 'us/pacific'` → `2021-12-31 16:00:00` |
| timestamptz + *interval_fixed* → timestamptz | Adds a fixed interval to a timestamp with time zone. See note below. | `'2022-03-13 01:00:00Z'::timestamp with time zone + interval '24' hour` → `2022-03-14 01:00:00+00:00` |
| timestamptz - *interval_fixed* → timestamptz | Subtracts a fixed interval from a timestamp with time zone. See note below. | `'2022-03-14 01:00:00Z'::timestamp with time zone - interval '24' hour` → `2022-03-13 01:00:00+00:00` |

:::note

*interval_fixed* can contain hour/minute/second (i.e., fixed length) but not year/month/day (i.e., variable length).

:::



## Date and time functions

|Function|Description|Example|
|---|---|---|
| date_trunc ( '*precision_string*', *date/time_value*[, *time_zone* ]) → *date/time_value* | Truncates a *date/time_value* to a specified *precision_string*. <br /> *precision_string* can be microseconds, milliseconds, second, minute, hour, day, week, month, quarter, year, decade, century, or millennium. <br /> *date/time_value* can be timestamp, timestamptz (i.e., timestamp with time zone), or interval. *time_zone* must be specified if *date/time_value* is timestamptz. <br /> *precision_string* value 'week' is not supported for interval. |`date_trunc('hour', timestamp '2202-02-16 20:38:40.123456')` → `2202-02-16 20:00:00` <br /><br /> `date_trunc('day', timestamp with time zone '2202-02-16 20:38:40.123456Z', 'Australia/Sydney')` → `2202-02-16 13:00:00+00:00` <br /><br /> `date_trunc('month', interval '2333 year 4 months 5 days 02:47:33.123')` → `2333 years 4 mons`|
| extract ( *field* FROM *source* ) → *numeric_output* | Extracts the value of a date or timestamp. <br /> *field* can be year, month, day, hour, minute, second, doy, or dow. <br /> *source* can be the date or timestamp.|`extract(day from date '2022-04-07')` → `7` <br /> `extract(hour from timestamp '2022-04-07 22:00:30')` → `22`|
| extract ( epoch FROM *timestamp_with_time_zone* ) → *seconds_numeric_output* | Converts the value of timestamp with time zone to Unix epoch seconds (the number of seconds since 1970-01-01 00:00:00 UTC). Negative for timestamps prior to that.|`extract(epoch from '2010-01-01 12:34:56.789012Z'::timestamp with time zone)` → `1262349296.789012`|
| to_char ( *timestamp*, *format* ) → *string_output* |Converts timestamp to string according to the given format. Both uppercase and lowercase formats are supported.|`to_char(timestamp '2002-04-20 17:31:12.66', 'HH12:MI:SS')` → `05:31:12` <br /> `to_char(timestamp '2006-01-02 15:04:05', 'yyyy-mm-dd hh24:mi:ss')` → `2006-01-02 15:04:05`|
| to_timestamp ( *seconds_double_precision* ) → *timestamp_with_time_zone_output* |Converts Unix epoch seconds (the number of seconds since 1970-01-01 00:00:00+00) to timestamp with time zone.|`to_timestamp(1262349296.7890123)` → `2010-01-01 12:34:56.789012+00:00`|
