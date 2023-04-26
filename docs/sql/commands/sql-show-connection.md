---
id: sql-show-connection
title: SHOW CONNECTION
description: Show existing connections.
slug: /sql-show-connection
---

Use the `SHOW CONNECTION` command to see connections that have been created.

## Syntax

```sql
SHOW CONNECTIONS;
```

## Example

```sql
SHOW CONNECTIONS;
```

Here is an example of what you might see. Any sources or sinks that reference the connection will also be listed.

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