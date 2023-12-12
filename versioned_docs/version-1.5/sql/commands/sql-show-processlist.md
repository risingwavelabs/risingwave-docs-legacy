---
id: sql-show-processlist
title: SHOW PROCESSLIST
description: Display system current workload.
slug: /sql-show-processlist
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-processlist/" />
</head>

Use the `SHOW PROCESSLIST` command to display the current workload of the system. The output of this command consists of id, user, host, database, time, and info. 

The following table explains the output in detail:

| Output | Description|
|-----------|-------------|
|`id`|The id of the process.|
|`user`|The username associated with the process.|
|`host`|The host to which the client is connected.|
|`database`|The database if one is selected.|
|`time`|The elapsed time since the running sql.|
|`info`|The statement being executed.|


:::info
This command only shows the frontend received processlist now.
:::

## Syntax

```sql
SHOW PROCESSLIST;
```

## Example

```sql
SHOW PROCESSLIST;
------RESULT
Id   | User |      Host       | Database | Time |                 Info
-------+------+-----------------+----------+------+---------------------------------------
 56 | root | 127.0.0.1:57542 | dev      | 6ms  | SELECT c FROM sbtest1 WHERE id=197719
 57 | root | 127.0.0.1:57545 | dev      |      |
 64 | root | 127.0.0.1:57552 | dev      |      |
 67 | root | 127.0.0.1:57554 | dev      |      |
 52 | root | 127.0.0.1:57540 | dev      | 0ms  | SELECT c FROM sbtest1 WHERE id=961513
 16 | root | 127.0.0.1:57054 | dev      | 0ms  | show processlist;
 58 | root | 127.0.0.1:57546 | dev      |      |
 54 | root | 127.0.0.1:57543 | dev      | 3ms  | SELECT c FROM sbtest1 WHERE id=99465
 55 | root | 127.0.0.1:57544 | dev      | 1ms  | SELECT c FROM sbtest1 WHERE id=601879
 53 | root | 127.0.0.1:57541 | dev      |      |
 65 | root | 127.0.0.1:57553 | dev      | 0ms  | SELECT c FROM sbtest1 WHERE id=547609
 61 | root | 127.0.0.1:57549 | dev      | 2ms  | SELECT c FROM sbtest1 WHERE id=394922
 60 | root | 127.0.0.1:57548 | dev      | 4ms  | SELECT c FROM sbtest1 WHERE id=453909
 63 | root | 127.0.0.1:57551 | dev      | 0ms  | SELECT c FROM sbtest1 WHERE id=190594
 62 | root | 127.0.0.1:57550 | dev      | 0ms  | SELECT c FROM sbtest1 WHERE id=128925
 66 | root | 127.0.0.1:57555 | dev      |      |
 59 | root | 127.0.0.1:57547 | dev      | 0ms  | SELECT c FROM sbtest1 WHERE id=772039
(17 rows)
```

## Terminate the process

After using the `SHOW PROCESSLIST` command to display the running processes, you can terminate the idle process by the `KILL` command.

### Syntax

```sql
KILL process_id;
```

### Example
```sql
SHOW PROCESSLIST;
------RESULT
 Id | User |      Host       | Database |  Time   |                            Info
----+------+-----------------+----------+---------+------------------------------------------------------------
 0  | root | 127.0.0.1:60858 | dev      | 35363ms | insert into t select i from generate_series(1, 1000000) i;
 1  | root | 127.0.0.1:60935 | dev      | 0ms     | show processlist;
 2  | root | 127.0.0.1:60941 | dev      | 4304ms  | create materialized view mv2 as select * from t;
(3 rows)

KILL 2;
------RESULT
KILL

KILL 0;
------RESULT
KILL
```
