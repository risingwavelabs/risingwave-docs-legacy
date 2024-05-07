---
id: aws-privatelink-setup
title: Create an AWS PrivateLink connection
description: How to create an AWS PrivateLink connection.
slug: /aws-privatelink-setup
---

If you are using a cloud-hosted source or sink, such as AWS MSK, there might be connectivity issues when your service is located in a different VPC from where you have deployed RisingWave. To establish a secure, direct connection between these two different VPCs and allow RisingWave to read consumer messages from the broker or send messages to the broker, use the [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html) service.

:::note Beta Feature
The support for AWS PrivateLink connection is a beta feature and is subject to change in future versions. There is no guarantee that this feature will be maintained.
:::

Follow the steps below to create an AWS PrivateLink connection.

1. Create a [target group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-target-group.html) for each broker. Set the **target type** as **IP addresses** and the **protocol** as **TCP**. Ensure that the VPC of the target group is the same as your cloud-hosted source.

2. Create a [Network Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-network-load-balancer.html). Ensure that it is enabled in the same subnets your broker sources are in and the Cross-zone load balancing is also enabled.

3. Create a [TCP listener](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-listener.html) for each MSK broker that corresponds to the target groups created. Ensure the ports are unique.

4. Complete the [health check](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html) for each target group.

5. Create a [VPC endpoint service](https://docs.aws.amazon.com/vpc/latest/privatelink/create-endpoint-service.html) associated with the Network Load Balancer created. Be sure to add the AWS principal of the account that will access the endpoint service to allow the service consumer to connect. See [Manage permissions](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#add-remove-permissions) for more details.

6. Use the [`CREATE CONNECTION`](/sql/commands/sql-create-connection.md) command in RisingWave to create an AWS PrivateLink connection referencing the endpoint service created. Here is an example of creating an AWS PrivateLink connection.

    ```sql
    CREATE CONNECTION connection_name WITH (
        type = 'privatelink',
        provider = 'aws',
        service.name = 'com.amazonaws.xyz.us-east-1.abc-xyz-0000'
    );
    ```

7. Create a source or sink with AWS PrivateLink connection.
    - Use the `CREATE SOURCE` command to create a Kafka source with PrivateLink connection. For more details on the syntax, see the [Ingest data from Kafka](/ingest/ingest-from-kafka.md) topic. Here is an example of connecting to a Kafka source through AWS PrivateLink.

    ```sql
    CREATE SOURCE tcp_metrics_rw (
    device_id VARCHAR,
    metric_name VARCHAR,
    report_time TIMESTAMP,
    metric_value DOUBLE PRECISION
    ) WITH (
    connector = 'kafka',
    topic = 'tcp_metrics',
    properties.bootstrap.server = 'ip1:9092, ip2:9092',
    connection.name = 'my_connection',
    privatelink.targets = '[{"port": 8001}, {"port": 8002}]',
    scan.startup.mode = 'earliest'
    ) FORMAT PLAIN ENCODE JSON;
    ```

     - Use the `CREATE SINK` command to create a Kafka sink with PrivateLink connection. For more details on the syntax, see the [Sink to Kafka](create-sink-kafka.md) topic. Here is an example of sinking to Kafka with an AWS PrivateLink.

    ```sql
    CREATE SINK sink2 FROM mv2
    WITH (
    connector='kafka',
    type='append-only',
    properties.bootstrap.server='b-1.xxx.amazonaws.com:9092,b-2.test.xxx.amazonaws.com:9092',
    topic='msk_topic',
    force_append_only='true',
    connection.name = 'connection1',
    privatelink.targets = '[{"port": 8001}, {"port": 8002}]'
    );
    ```
