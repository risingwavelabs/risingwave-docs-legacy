---
id: sql-create-connection
title: CREATE CONNECTION
description: Create a connection between VPCs.
slug: /sql-create-connection
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-connection/" />
</head>

Use the `CREATE CONNECTION` command to create an AWS PrivateLink connection for a Kafka source connector. This is necessary in order to be able to consume messages from a Kafka service located in a different VPC from the RisingWave cluster in the cloud.

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

<Drawer SVG={svg} />

## Parameters

All WITH options are required unless stated otherwise.

| Parameter or clause | Description                                                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| _connection_name_   | The name of the connection to be created.                                                                                          |
| type                | The type of connection.                                                                                                            |
| provider            | The provider of the connection.                                                                                                    |
| service.name        | The service name of the endpoint service.                                                                                          |
| tags                | Optional. The AWS tags used to check for resource leakage. This parameter should have the format: `key1=value1, key2=value2, ...`. |

:::note
You can either tag the VPC endpoints by specifying the `tags` parameter when using the `CREATE CONNECTION` command or by specifying the environment variable `RW_PRIVATELINK_ENDPOINT_DEFAULT_TAGS`. When specifying the tags, follow the format of `key1=value1, key2=value2, ...`. If both are specified, the tags specified in the environment variable will be appended to the ones specified by the `tags` parameter.
:::

## Example

The statement below creates an AWS PrivateLink connection.

```sql
CREATE CONNECTION connection_name WITH (
    type = 'privatelink',
    provider = 'aws',
    service.name = 'com.amazonaws.xyz.us-east-1.abc-xyz-0000'
);
```

## Create an AWS PrivateLink connection

If you are using a cloud-hosted source or sink, such as AWS MSK, there might be connectivity issues when your service is located in a different VPC from where you have deployed RisingWave. To establish a secure, direct connection between these two different VPCs and allow RisingWave to read consumer messages from the broker or send messages to the broker, use the [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html) service.

:::note Beta Feature
The support for AWS PrivateLink connection is a beta feature and the syntax for `CREATE CONNECTION` is subject to change in future versions.
:::

Follow the steps below to create an AWS PrivateLink connection.

1. Create a [target group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-target-group.html) for each broker. Set the **target type** as **IP addresses** and the **protocol** as **TCP**. Ensure that the VPC of the target group is the same as your cloud-hosted source.

2. Create a [Network Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-network-load-balancer.html). Ensure that it is enabled in the same subnets your broker sources are in and the Cross-zone load balancing is also enabled.

3. Create a [TCP listener](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-listener.html) for each MSK broker that corresponds to the target groups created. Ensure the ports are unique.

4. Complete the [health check](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html) for each target group.

5. Create a [VPC endpoint service](https://docs.aws.amazon.com/vpc/latest/privatelink/create-endpoint-service.html) associated with the Network Load Balancer created. Be sure to add the AWS principal of the account that will access the endpoint service to allow the service consumer to connect. See [Manage permissions](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#add-remove-permissions) for more details.

6. Use the `CREATE CONNECTION` command in RisingWave to create an AWS PrivateLink connection referencing the endpoint service created. Here is an example of creating an AWS PrivateLink connection.

   ```sql
   CREATE CONNECTION connection_name WITH (
       type = 'privatelink',
       provider = 'aws',
       service.name = 'com.amazonaws.xyz.us-east-1.abc-xyz-0000'
   );
   ```

7. Create a source or sink with VPC connection.

   - Use the `CREATE SOURCE/TABLE` command to create a Kafka source with PrivateLink connection. For more details, see [Create source with AWS PrivateLink connection](/ingest/ingest-from-kafka.md#create-source-with-aws-privatelink-connection).
   - Use the `CREATE SINK` command to create a Kafka sink with PrivateLink connection. For more details, see [Create sink with AWS PrivateLink connection](/guides/create-sink-kafka.md#create-sink-with-aws-privatelink-connection).