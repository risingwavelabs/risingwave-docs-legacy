---
id: sink-to-mqtt
title: Sink data from RisingWave to MQTT
description: Sink data from RisingWave to MQTT.
slug: /sink-to-mqtt
---
This guide describes how to sink data from RisingWave to the MQTT topic using the MQTT sink connector in RisingWave.

The [Message Queuing Telemetry Transport](https://mqtt.org/) (MQTT) protocol is ideal for connecting remote devices with a small code footprint and minimal network bandwidth. MQTT today is used in a wide variety of industries, such as automotive, manufacturing, telecommunications, oil and gas, etc.

## Prerequisites

Before sinking data from RisingWave to an MQTT topic, please ensure the following:

- The RisingWave cluster is running.
- An MQTT broker is running and accessible from your RisingWave cluster.
- Create an MQTT topic that you want to sink data to.
- You have permission to publish data to the MQTT topic.

For example, we have an `iot_sensor_data` table in RisingWave that stores data from various IoT devices at a given timestamp, including temperature and humidity readings, along with a status field indicating whether the device is in a normal or abnormal state. For more information to learn about MQTT and get started with it, refer to the [MQTT guide](https://mqtt.org/getting-started/).
### Syntax
To sink data from RisingWave to an MQTT topic, create a sink using the syntax below:

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='mqtt',
   url = '<your MQTT server>:<port>',
   topic = '<topic>',
   qos =  '<qos_level>', 
   type = '<append-only>'
   username = '<your user name>',
   password = '<your password>')
FORMAT PLAIN ENCODE data_encode -- Format options: plain (encode BYTES and JSON) (
    force_append_only='true',
);
```
This query sets up an MQTT sink `mqtt_sink` to forward data from `iot_sensor_data` to an MQTT server. It configures the MQTT connector, server URL, target topic, data type, message retention, quality of service, and JSON encoding.

```sql
CREATE SINK mqtt_sink
FROM iot_sensor_data 
WITH
(
    connector='mqtt',
    url='tcp://mqtt-server',
    topic= 'sink_iot_data',
    type = 'append-only',
    retain = 'true',
    qos = 'at_least_once',
) FORMAT PLAIN ENCODE JSON (
    force_append_only='true',
);
```
After the sink is created, you will continuously consume the data in the MQTT topic from RisingWave in append-only mode.

### Parameters

| Field              | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `url`              | Required. The URL of the broker to connect to, e.g., `tcp://localhost`. Must be prefixed with `tcp://`, `mqtt://`, `ssl://`, or `mqtts://` to denote the protocol. `mqtts://` and `ssl://` use native certificates if no CA is specified.                                                                                                                                                                                                                                                                          |
| `qos`              | Optional. The quality of service for publishing messages. Defaults to `at_most_once`. Options include `at_most_once`, `at_least_once`, or `exactly_once`.                                                                                                                                                                                                                                                                                                                                                            |
| `username`         | Optional. Username for the MQTT broker.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `password`         | Optional. Password for the MQTT broker.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `client_prefix`    | Optional. Prefix for the MQTT client ID. Defaults to "risingwave".                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `clean_start`      | Optional. Determines if all states from queues are removed when the client disconnects. If true, the broker clears all client states upon disconnect; if false, the broker retains the client state and resumes pending operations upon reconnection.                                                                                                                                                                                                                                                             |
| `inflight_messages`| Optional. Maximum number of inflight messages. Defaults to 100.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `tls.client_cert`  | Optional. Path to the client's certificate file (PEM) or a string with the certificate content. Required for client authentication. Can use `fs://` prefix for file paths.                                                                                                                                                                                                                                                                               |
| `tls.client_key`   | Optional. Path to the client's private key file (PEM) or a string with the private key content. Required for client authentication. Can use `fs://` prefix for file paths.                                                                                                                                                                                                                                                                                 |
| `topic`            | Required. The topic name to subscribe or publish to. Can include wildcard topics, e.g., `/topic/#`.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `retain`           | Optional. Whether the message should be retained by the broker.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `r#type`           | Required. Type identifier.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

