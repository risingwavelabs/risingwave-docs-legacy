---
id: sql-create-connection
title: CREATE CONNECTION
description: Create a connection between VPCs.
slug: /sql-create-connection
---

Use the `CREATE CONNECTION` command to create an AWS PrivateLink connection for a Kafka source connector. This is necessary in order to be able to consume messages from a Kafka service located in a different VPC from the RisingWave cluster in the cloud.

For details on how to connect to a Kafka broker, see the [Ingest data from Kafka](/create-source/create-source-kafka.md) topic.

## Syntax

```sql
CREATE CONNECTION [ IF NOT EXISTS ] connection_name
WITH (
    connection_parameter = 'value'
);
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Stack(
        rr.Sequence(
            rr.Terminal('CREATE CONNECTION'),
            rr.Optional(rr.Terminal('IF NOT EXISTS')),
            rr.NonTerminal('connection_name'),
        ),
        rr.Sequence(
            rr.Terminal('WITH'),
            rr.Terminal('('),
            rr.Sequence(
                rr.NonTerminal('connection_parameter'),
                rr.Terminal('='),
                rr.NonTerminal('value'),                
            ),
            rr.Terminal(')'),
        ),
        rr.Terminal(';'),
    )
);

<drawer SVG={svg} />


## Parameters

|Parameter or clause            | Description           |
|-------------------------------|-----------------------|
|*connection_name*              |The name of the connection to be created.|
|type                           |The type of connection.|
|provider                       |The provider of the connection.|
|service.name                   |The service name of the endpoint service.|

## Example

The statement below creates an AWS PrivateLink connection.

```sql
CREATE CONNECTION connection_name with (
    type = 'privatelink',
    provider = 'aws',
    service.name = 'com.amazonaws.xyz.us-east-1.abc-xyz-0000'
);
```