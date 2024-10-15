---
id: sql-show-connections
title: SHOW CONNECTIONS
description: Show existing connections.
slug: /sql-show-connections
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-connections/" />
</head>

Use the `SHOW CONNECTIONS` command to see connections that have been created.

## Syntax

```sql
SHOW CONNECTIONS;
```



## Example

Here is an example of what you might see. Any sources or sinks that reference the connection will also be listed.

```sql
SHOW CONNECTIONS;
```

```
Name             | Type        |   Properties
-----------------+-------------+----------------
connection_name  | privatelink | provider: aws
                 |             | service_name: com.amazonaws.xyz.us-east-1.abc-xyz-0000
                 |             | endpoint_id: xyz-0000
                 |             | availability_zones: ["use1-az6", "use1-az4"]
                 |             | sources: ["tcp_metrics"]
                 |             | sinks: ["sink1"]
```

## Related topics

[CREATE CONNECTION](sql-create-connection.md)
