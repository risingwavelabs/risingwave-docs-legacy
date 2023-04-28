---
id: aws-privatelink-setup
title: Create an AWS PrivateLink connection
description: How to create an AWS PrivateLink connection.
slug: /aws-privatelink-setup
---

If you are using a cloud-hosted source, such as AWS MSK, there might be connectivity issues when your source service is located in a different VPC from where you have deployed RisingWave. To establish a secure, direct connection between these two different VPCs and allow RisingWave to read consumer messages from the broker, use the [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html) service.

:::note
This is a beta feature and is subject to change in future versions. There is no guarantee that this feature will be maintained.
:::

Follow the steps below to create an AWS PrivateLink connection.

1. Create a [target group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-target-group.html) for each broker. Set the **target type** as **IP addresses** and the **protocol** as **TCP**. Ensure that the target group's VPC is the same as your cloud-hosted source.

2. Create a [Network Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-network-load-balancer.html). Ensure that it is enabled in the same subnets your broker sources are in and the Cross-zone load balancing is also enabled. 

3. Create a [TCP listener](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-listener.html) for each MSK broker that corresponds to the target groups created. Ensure the ports are unique.

4. Complete the [health check](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html) for each target group.

5. Create a [VPC endpoint service](https://docs.aws.amazon.com/vpc/latest/privatelink/create-endpoint-service.html) associated with the Networkd Load Balancer created.

6. Use the [`CREATE CONNECTION`](../sql/commands/sql-create-connection.md) command in RisingWave to create an AWS PrivateLink connection referencing the endpoint service created. Here is an example of creating an AWS PrivateLink connection.
    ```sql
    CREATE CONNECTION connection_name with (
        type = 'privatelink',
        provider = 'aws',
        service.name = 'com.amazonaws.xyz.us-east-1.abc-xyz-0000'
    );
    ```

7. Finally, use the `CREATE SOURCE` command to create a Kafka source with PrivateLink support. For more details on the syntax, see the [Ingest data from Kafka](../create-source/create-source-kafka.md) topic. Here is an example of connecting to a Kafka source through AWS PrivateLink.

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
    ) ROW FORMAT JSON;
    ```