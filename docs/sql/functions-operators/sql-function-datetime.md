---
id: sql-function-datetime
slug: /sql-function-datetime
title: Date and time functions and operators
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-datetime/" />
</head>

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
| timestamp AT TIME ZONE *time_zone* → timestamptz <br /><br /> timestamptz AT TIME ZONE *time_zone* → timestamp | Converts times from timestamp to timestamptz (i.e., timestamp with time zone) or timestamptz to timestamp. Invalid local time during daylight saving forward is not supported. Ambiguous local time during daylight saving backward is interpreted as after the transition. | `'2021-12-31 16:00:00'::timestamp AT TIME ZONE 'us/pacific'` → `2022-01-01 00:00:00+00:00` <br /><br /> `'2022-01-01 00:00:00Z'::timestamptz AT TIME ZONE 'us/pacific'` → `2021-12-31 16:00:00` |
| timestamptz + interval → timestamptz | Adds a fixed interval to a timestamp with time zone. See note below. | `'2022-03-13 01:00:00Z'::timestamp with time zone + interval '24' hour` → `2022-03-14 01:00:00+00:00` |
| timestamptz - interval → timestamptz | Subtracts a fixed interval from a timestamp with time zone. See note below. | `'2022-03-14 01:00:00Z'::timestamp with time zone - interval '24' hour` → `2022-03-13 01:00:00+00:00` |
| timestamptz - timestamptz → interval | Subtracts a timestamp with time zone from a timestamp with time zone and converts 24-hour intervals into days. | `'2023-07-30 13:22:00-05:00'::timestamptz - '2023-07-29 13:22:00-04:00'::timestamptz` → `1 day 01:00:00` |

:::note

An interval can contain hour/minute/second (i.e., fixed length) but not year/month/day (i.e., variable length).

:::

The time zone parameter passed to `AT TIME ZONE` can be an arbitrary VARCHAR expression, rather than just a literal value. For example, the following statement converts the local timestamp column to the time zone specified in the zone column:

```sql
t.local AT TIME ZONE t.zone
```

## Date and time functions

### `current_timestamp`

Returns the current date and time.

```bash title=Syntax
current_timestamp() → *timestamptz*
```

```bash title=Example
current_timestamp() → `2023-09-06 07:06:46.724+00:00`
```

---

### `date_part`

Extracts the value of a date or timestamp.

```bash title=Syntax
date_part ( precision_string, date/time_value[, time_zone ] ) → double_precision
```

`precision_string` can be year, month, day, hour, minute, second, doy, dow, millisecond, microsecond, epoch, millennium, century, decade, isoyear, quarter, week, isodow, or julian.

`date/time_value` can be a date, timestamp, time, timestamptz, or interval.

If `date/time_value` is timestamptz, it is recommended that `time_zone` is also specified, otherwise `time_zone` will default to the session time zone.

As `date_part()` returns values of type double precision, this can result in a loss of precision; therefore, using `extract()` is recommended.

```bash title=Examples
date_part('day', date '2022-04-07') → 7

date_part('hour', timestamp '2022-04-07 22:00:30') → 22

date_part('second', time '22:00:30.123') → 30.123

date_part('day', interval '2 days') → 2

date_part('day', '2023-06-01 00:00:00Z'::timestamptz, 'Australia/Sydney') → 1
```

---

### `date_trunc`

Truncates a `date/time_value` to a specified `precision_string`.

```bash title=Syntax
date_trunc ( precision_string, date/time_value[, time_zone ] ) → date/time_value
```

`precision_string` can be microseconds, milliseconds, second, minute, hour, day, week, month, quarter, year, decade, century, or millennium.

`date/time_value` can be timestamp, timestamptz (i.e., timestamp with time zone), or interval.

If `date/time_value` is timestamptz, it is recommended that `time_zone` is also specified, otherwise `time_zone` will default to the session time zone.

`precision_string` value 'week' is not supported for interval.

```bash title=Examples
date_trunc('hour', timestamp '2202-02-16 20:38:40.123456') → 2202-02-16 20:00:00

date_trunc('day', timestamp with time zone '2202-02-16 20:38:40.123456Z', 'Australia/Sydney') → 2202-02-16 13:00:00+00:00

date_trunc('month', interval '2333 year 4 months 5 days 02:47:33.123') → 2333 years 4 mons
```

---

### `extract`

This function has two variants.

#### `extract ( field from source )`

Extracts the value of a date or timestamp.

```bash title=Syntax
extract ( field from source [AT TIME ZONE time_zone]) → numeric
```

`field` can be year, month, day, hour, minute, second, doy, dow, millisecond, microsecond, epoch, millennium, century, decade, isoyear, quarter, week, isodow, or julian.

`source` can be the date, timestamp, timestamptz, time, or interval.

If `time_zone` is specified, `source` should be of type timestamptz.

```bash title=Examples
extract(day from date '2022-04-07') → 7

extract(hour from timestamp '2022-04-07 22:00:30') → 22

extract(second from time '22:00:30.123') → 30.123000

extract(day from interval '2 days') → 2

extract(day from '2023-06-01 00:00:00Z'::timestamptz at time zone 'us/pacific') → 31
```

---

#### `extract( epoch )`

Converts the value of timestamp with time zone to Unix epoch seconds (the number of seconds since 1970-01-01 00:00:00 UTC). Negative for timestamps prior to that.

```bash title=Syntax
extract ( epoch FROM timestamp_with_time_zone ) → seconds_numeric
```

```bash title=Example
extract(epoch from '2010-01-01 12:34:56.789012Z'::timestamp with time zone) → 1262349296.789012
```

---

### `make_date`

Creates date from year, month, and day fields.

```bash title=Syntax
make_date ( year int, month int, day int ) → date
```

```bash title=Example
make_date(2024, 1, 31) → 2024-01-31
```

---

### `make_time`

Creates time from hour, minute, and seconds fields.

```bash titile=Syntax
make_time ( hour int, min int, sec double precision ) → time
```

```bash title=Example
make_time(1, 45, 30.2) → 01:45:30.200
```

---

### `make_timestamp`

Creates timestamp from year, month, day, hour, minute, and seconds fields.

```bash titile=Syntax
make_timestamp ( year int, month int, day int, hour int, min int, sec double precision ) → timestamp
```

```bash title=Example
make_timestamp(2024, 1, 31, 1, 45, 30.2) → 2024-01-31 01:45:30.200
```

---

### `now`

Returns the current date and time. For streaming queries, `now()` can only be used with WHERE, HAVING, and ON clauses. For more information, see [Temporal filters](/sql/syntax/sql-pattern-temporal-filters.md). This constraint does not apply to batch queries.

```bash title=Syntax
now() → timestamptz
```

```bash title=Example
now() → '2023-08-04 21:29:59.662+00:00'
```

---

### `proctime`

Returns the system time with time zone when a record is processed. You can use this function to specify the processing time of a record in a table or source.

```bash title=Syntax
proctime() → timestamptz
```

```sql title=Example
CREATE TABLE t1 (v1 int, proc_time timestamptz as proctime());
```

---

### `to_char`

Converts the input to string according to the given format. Both uppercase and lowercase formats are supported.

```bash title=Syntax
to_char ( timestamptz, format ) → *string*
to_char ( timestamp, format ) → *string*
to_char ( interval, format ) → *string*
```

```bash title=Example

to_char(timestamp '2002-04-20 17:31:12.66', 'HH12:MI:SS') → '05:31:12'

to_char('2023-07-11 20:01:00-07:00'::timestamptz, 'HH12:MI:SS TZH:TZM') → 03:01:00 +00:00

to_char('1year 2 month 3day 4hour 5minute 6second'::interval, 'YYYY MM DD PM HH12 HH24 MI SS MS US') → 0001 02 03 AM 04 04 05 06 000 000000
```

---

### `to_date`

Converts a string to a date according to the given format.

```bash title=Syntax
to_date ( date_string, format ) → date
```

```bash title=Example
to_date('05 Dec 2000', 'DD Mon YYYY') → '2000-12-05'
```

---

### `to_timestamp`

This function has two variants.

#### `to_timestamp ( seconds_double_precision )`

Converts Unix epoch seconds (the number of seconds since 1970-01-01 00:00:00+00) to timestamptz.

```bash title=Syntax
to_timestamp ( seconds_double_precision ) → timestamptz
```

```bash title=Example
to_timestamp(1262349296.7890123) → '2010-01-01 12:34:56.789012+00:00'
```

---

#### `to_timestamp ( string, timestamp_format )`

Converts a string to timestamptz according to the given format.

```bash title=Syntax
to_timestamp ( string, timestamp_format ) → timestamptz
```

```bash title=Example
to_timestamp('2022 12 25', 'YYYY MM DD') → '2022-12-25 00:00:00+00:00'

to_timestamp('2022-12-25 00:00:00.900006', 'YYYY-MM-DD HH24:MI:SS.US') → '2022-12-25 00:00:00.900006+00:00'

to_timestamp('2022-12-25 00:00:00.906', 'YYYY-MM-DD HH24:MI:SS.MS') → '2022-12-25 00:00:00.906+00:00'

to_timestamp('2023-07-11 20:01:00-07:00', 'YYYY-MM-DD HH24:MI:SSTZH:TZM') → '2023-07-12 03:01:00+00:00'
```

## Template patterns for date / time formatting

For date and time formatting functions like `to_char`, `to_timestamp`, and `to_date`, the format needs to be specified by using the supported template patterns. Any text that is not a template pattern is simply copied verbatim.

Please see the table below for the template patterns supported in RisingWave.

| Pattern   | Description |
|-----------|-------------|
| `HH24` or `hh24`      | hour of day (00–23)        |
| `HH12` or `hh12`      | hour of day (01–12)         |
| `HH` or `hh`       | hour of day (01–12)        |
| `AM`, `PM` |       meridiem indicator (without periods)  |
| `am`, `pm` |       meridiem indicator (without periods)  |
| `MI` or `mi`       | minute (00–59)        |
| `SS` or `ss`        |     second (00–59)    |
| `YYYY` or `yyyy`     |  year (4 or more digits)        |
| `YY` or `yy`        | last 2 digits of year      |
| `IYYY` or `iyyy`      |ISO 8601 week-numbering year (4 or more digits)         |
| `IY` or `iy`        | last 2 digits of ISO 8601 week-numbering year         |
| `MM` or `mm`        | month number (01–12)        |
| `Month`     |  full capitalized month name (blank-padded to 9 chars)         |
| `Mon`    | abbreviated capitalized month name (3 chars in English)         |
| `DD` or `dd`   |  day of month (01–31)         |
| `US` or `us`      |  microsecond (000000–999999)       |
| `MS` or `ms`      | millisecond (000–999)        |
| `TZH:TZM` or `tzh:tzm`| time-zone hours and minutes|
|`TZHTZM` or `tzhtzm`   | time-zone hours and minutes   |
| `TZH` or `tzh`      |Time-zone hours. This pattern works only in `to_timestamp`.   |

## Delaying execution functions

The following functions are available to delay execution of the current session's process.

### `pg_sleep`

The `pg_sleep()` function makes the current session's process sleep until the given number of seconds have elapsed. Fractional-second delays can be specified.

```bash title=Syntax
pg_sleep ( double precision )
```

```sql title=Example
SELECT pg_sleep(1.5);
```

### `pg_sleep_for`

`pg_sleep_for` is a convenience function to allow the sleep time to be specified as an interval.

```bash title=Syntax
pg_sleep_for ( interval )
```

```sql title=Example
SELECT pg_sleep_for('5 minutes');
```
