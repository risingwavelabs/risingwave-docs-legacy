---
id: sql-show-connections
title: SHOW CONNECTIONS
description: Show existing connections.
slug: /sql-show-connections
---

Use the `SHOW CONNECTIONS` command to see connections that have been created.

## Syntax

```sql
SHOW CONNECTIONS;
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('SHOW CONNECTIONS'),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />


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