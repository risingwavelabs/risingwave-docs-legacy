---
id: ingest-from-mqtt
title: Ingest data from MQTT brokers
description: Ingest data from MQTT brokers into RisingWave.
slug: /ingest-from-mqtt
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-mqtt/" />
</head>

You can ingest data from a MQTT broker into RisingWave by using the MQTT source connector in RisingWave.

The [Message Queuing Telemetry Transport](https://mqtt.org/) (MQTT) protocol is ideal for connecting remote devices with a small code footprint and minimal network bandwidth. MQTT today is used in a wide variety of industries, such as automotive, manufacturing, telecommunications, oil and gas, etc.

## Prerequisites

Before ingesting data from MQTT into RisingWave, please ensure the following:

- The MQTT server is running and accessible from your RisingWave cluster.
- If authentication is required for the MQTT broker, make sure you have the client username and password. The client user must have the `subscribe` permission for the topic.
- Create the MQTT topic from which you want to ingest data.
- Ensure that your RisingWave cluster is running.

For example, we create a topic named `iot_data` with the data from various IoT devices at a given timestamp, including temperature, humidity readings, and a status field indicating whether the device is in a normal or abnormal state.  For more information to learn about MQTT and get started with it, refer to the [MQTT guide](https://mqtt.org/getting-started/).

## Ingest data into RisingWave

When creating a source, we have the option to either persist the data in RisingWave using `CREATE TABLE` or use `CREATE SOURCE` while specifying the connection settings and data format.

### Syntax

```sql
CREATE { TABLE | SOURCE} [ IF NOT EXISTS ] source_name  
(
   column_name data_type PRIMARY KEY,
   -- Add more columns if needed: column_name2 data_type2, column_name3 data_type3, ...

   -- Define the primary key constraint if needed
   -- PRIMARY KEY (column_name, ...)

)
WITH (
   connector = 'mqtt',
   url = '<your MQTT server>:<port>',
   topic = '<topic>',
   qos = '<qos_level>', 

   -- Optional connection parameters
   connect_mode = <connect_mode>,
   username = '<your user name>',
   password = '<your password>',

   -- Delivery parameters
   scan.startup.mode = 'startup_mode',
   scan.startup.timestamp.millis = 'xxxxx'
)
FORMAT PLAIN ENCODE data_encode; -- Format options: plain (encode BYTES and JSON)

```

### Parameters

| Field              | Notes                                                                                                                                                       |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `url`              | Required. The URL of the broker to connect to, e.g., `tcp://localhost`. Must be prefixed with `tcp://`, `mqtt://`, `ssl://`, or `mqtts://` to denote the protocol. `mqtts://` and `ssl://` use native certificates if no CA is specified. |
| `qos`              | Optional. The quality of service for publishing messages. Defaults to `at_most_once`. Options include `at_most_once`, `at_least_once`, or `exactly_once`.   |
| `max_packet_size`              | Optional. The maximum message size for MQTT client.   |
| `username`         | Optional. Username for the MQTT broker.                                                                                                                     |
| `password`         | Optional. Password for the MQTT broker.                                                                                                                     |
| `client_prefix`    | Optional. Prefix for the MQTT client ID. Defaults to "risingwave".                                                                                          |
| `clean_start`      | Optional. Determines if all states from queues are removed when the client disconnects. If true, the broker clears all client states upon disconnect; if false, the broker retains the client state and resumes pending operations upon reconnection. |
| `inflight_messages`| Optional. Maximum number of inflight messages. Defaults to 100.                                                                                             |
| `tls.client_cert`  | Optional. Path to the client's certificate file (PEM) or a string with the certificate content. Required for client authentication. Can use `fs://` prefix for file paths.                                          |
| `tls.client_key`   | Optional. Path to the client's private key file (PEM) or a string with the private key content. Required for client authentication. Can use `fs://` prefix for file paths.                                           |
| `topic`            | Required. The topic name to subscribe or publish to. Can include wildcard topics, e.g., `/topic/#`.                                                         |


This SQL statement creates a table named `iot_sensor_data` with columns for device ID, timestamp, temperature, humidity, and device status. The table is configured to connect to an MQTT broker using the MQTT connector, with specific URL, topic, and quality of service (QoS) settings, the data is encoded as JSON.

```sql
CREATE TABLE iot_sensor_data(
  device_id VARCHAR,
  ts TIMESTAMP,
  temperature DECIMAL,
  humidity DECIMAL,
  device_status VARCHAR
  
)
WITH (                                                                                                                                                                                                                                                         
   connector='mqtt',                                                                                                                                                                                                                                           
   url='tcp://localhost',                                                                                                                                                                                                                                      
   topic= 'iot_data',                                                                                                                                                                                                                                            
   qos = 'at_least_once',                                                                                                                                                                                                                                 
  ) FORMAT PLAIN ENCODE JSON;
```

### Query the table

Let's retrieve data from the created table:

```sql
SELECT * FROM iot_sensor_data LIMIT 5;
```

Expected result:

```
 device_id  |       ts               | temperature | humidity |  device_status  
------------+------------------------+-------------+----------+----------
 device_001 | 2024-01-26 00:00:00+00 |        25.5 |     60.2 | normal
 device_002 | 2024-01-26 00:00:01+00 |        10.8 |       22 | abnormal
 device_003 | 2024-01-26 00:00:02+00 |        40.2 |     70.5 | normal
 device_001 | 2024-01-26 00:00:03+00 |          10 |       80 | abnormal
 device_002 | 2024-01-26 00:00:04+00 |        32.5 |     52.8 | normal
(5 rows)
```

After creating the table and querying it, you can now transform this IoT data in RisingWave from the MQTT server based on your requirements.
