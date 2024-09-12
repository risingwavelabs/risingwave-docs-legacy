---
id: sql-show-functions
title: SHOW FUNCTIONS
description: Show all user-defined functions.
slug: /sql-show-functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-functions/" />
</head>

Run `SHOW FUNCTIONS` to get a list of existing [user-defined functions](/sql/udf/user-defined-functions.md). The returned information includes the name, argument types, return type, language, and server address of each function.


## Syntax

```sql
SHOW FUNCTIONS;
```





## Example

```
       Name       |         Arguments         |                                Return Type                                | Language |         Link
------------------+---------------------------+---------------------------------------------------------------------------+----------+-----------------------
 jsonb_concat     | jsonb[]                   | jsonb                                                                     | python   | http://localhost:8815
 array_access     | varchar[], integer        | varchar                                                                   | python   | http://localhost:8815
 hex_to_dec       | varchar                   | numeric                                                                   | python   | http://localhost:8815
 gcd              | integer, integer, integer | integer                                                                   | python   | http://localhost:8815
 gcd              | integer, integer          | integer                                                                   | python   | http://localhost:8815
 extract_tcp_info | bytea                     | struct<src_ip varchar,dst_ip varchar,src_port smallint,dst_port smallint> | python   | http://localhost:8815
 int_42           |                           | integer                                                                   | python   | http://localhost:8815
 series2          | integer                   | struct<x integer,y varchar>                                               | python   | http://localhost:8815
 series           | integer                   | integer                                                                   | python   | http://localhost:8815
 jsonb_access     | jsonb, integer            | jsonb                                                                     | python   | http://localhost:8815
(10 rows)
```
