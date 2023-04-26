---
id: sql-create-connection
title: CREATE CONNECTION
description: Create a connection between VPCs.
slug: /sql-create-connection
---

Use the `CREATE CONNECTION` command to create an AWS PrivateLink connection for a Kafka fource connector. This is necessary in order to be able to consume messages from a Kafka service located in a different VPC from the RisingWave cluster in the cloud.

For details on how to connect to a Kafka broker, see the [Ingest data from Kafka](../../create-source/create-source-kafka.md) topic.

## Syntax

```sql
CREATE CONNECTION [IF NOT EXIST ] connection_name
WITH (
    connection_parameter = 'value'
);
```

## Parameters

|Parameter or clause            | Description           |
|-------------------------------|-----------------------|
|*connection_name*              |The name of the connection to be created.|
|type                           |The type of connection.|
|provider                       |The provider of the connection.|
|service.name                   |The service name of the AWS PrivateLink.|

## Example

The statement below creates an AWS PrivateLink connection.

```sql
CREATE CONNECTION connection_name with (
    type = 'privatelink',
    provider = 'aws',
    service.name = 'com.amazonaws.xyz.us-east-1.abc-xyz-0000'
);
```