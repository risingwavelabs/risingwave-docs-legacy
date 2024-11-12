---
 id: ingest-from-solace
 title: Ingest data from Solace
 description: Describes how to ingest data from Solace.
 slug: /ingest-from-solace
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-solace/" />
</head>

You can ingest data from [Solace](https://solace.com/)’s PubSub+ Platform, a powerful event-driven streaming solution designed for real-time enterprises. It facilitates the design, deployment, integration, and management of event-driven architectures (EDAs) across hybrid, multi-cloud, and IoT environments. It enables seamless data exchange across legacy systems, SaaS applications, messaging services, databases, and AI agents, connecting them to a real-time event-driven layer.

## Set up Solace

To set up [Solace PubSub+](https://solace.com/try-it-now/) event broker, you can either choose the free Software version using Docker or Solace PubSub+ Cloud. For more information, refer to the [Solace documentation](https://www.notion.so/Automating-Airline-Operations-with-Solace-and-RisingWave-123f0d69cb7680b09a1ec1d7315a49fa?pvs=21). 

![S1](https://github.com/user-attachments/assets/c030b1a8-60bd-46cf-97b3-a5eee5a8953b)


Consider this scenario: automating the process of notifying passengers exactly 48 hours before their flight departure that online check-in is open. Airlines need to handle continuous streams of flight and passenger data to send timely "Check-in Open" alerts to passengers who have opted in. The process begins 72 hours before departure, as flight and passenger data enter the system. Then, at 48 hours before departure, a notification is triggered for eligible passengers.

The solution involves two key steps:

1. **Event Stream Processing:** Continuous streams of flight and passenger data are received from the Departure Control System (DCS) via Solace. Each flight is tracked by a unique identifier, and each passenger by a unique Passenger Reference Number (PRN), enabling real-time processing in RisingWave.
2. **Notification Logic:** Notifications are sent only to passengers who have opted in.

### Sample data: Flight and passenger details (Solace topic: passenger_full_details)

```json
{
        "passenger_ref_number": "PRN026",
        "flight_id": "LH6456",
        "flight_number": "6456",
        "carrier_code": "LH",
        "flight_date": "2024-10-17",
        "origin": "LHR",
        "departure_time": "2024-10-17T04:40:00Z",
        "contact_info": "john.garcia@gmail.com",
        "opted_in": true
    }
```

## **Ingest data from Solace into RisingWave**

### Create a RisingWave cluster[](https://docs.risingwave.com/docs/current/ingest-from-upstash-kafka/#create-a-risingwave-cluster)

Create a RisingWave cluster in [RisingWave Cloud](https://cloud.risingwave.com/) using the free plan. See the [documentation of RisingWave Cloud](https://docs.risingwave.com/cloud/manage-clusters/) for instructions.

Solace supports popular open protocols like AMQP, JMS, MQTT, REST, and WebSocket, and open APIs such as Paho and Qpid to enable users to interact with Solace PubSub+ event broker. We will leverage the [RisingWave MQTT connector](https://docs.risingwave.com/docs/current/ingest-from-mqtt/) to read and write data from the Solace event broker. With the RisingWave cluster up and running, navigate to the Workspace and connect to the data streams using the SQL statements to create tables, materialized views and sinks.

### Step 1: Create source table

This query creates a table named combined_passenger_flight_data to store detailed passenger and flight information. The data is sourced from the Solace topic passenger_full_details, connected through the Solace broker, with the Quality of Service (QoS) level set to **at least once** and formatted as plain JSON.

```sql
CREATE TABLE combined_passenger_flight_data (
    flight_id VARCHAR,
    flight_number VARCHAR,
    carrier_code VARCHAR,
    flight_date DATE,
    origin VARCHAR,
    passenger_ref_number VARCHAR,
    departure_time TIMESTAMPTZ,
    opted_in BOOLEAN,
    contact_info VARCHAR
)
WITH (
    connector = 'mqtt',
    topic = 'passenger_full_details',
    url = 'ssl://xxxxxxxxxx:8883',
    username='solace-cloud-client',
    password='xxxxxxxxxxxx', 
    qos = 'at_least_once'
) FORMAT PLAIN ENCODE JSON;
```

### Step 2: Materialized view to filter flights 48 hours before departure

This query creates a materialized view named checkin_open_notification that selects flight and passenger information for those who opted in and have flights departing within 48 to 72 hours from the current time.

```sql
CREATE MATERIALIZED VIEW checkin_open_notification AS
SELECT flight_id, passenger_ref_number, flight_number, carrier_code, departure_time, contact_info
FROM combined_passenger_flight_data
WHERE opted_in = TRUE
  AND departure_time <= NOW() - INTERVAL '48 hours'
  AND departure_time > NOW() - INTERVAL '72 hours';
```

### Step 3: Query the materialized view[](https://docs.risingwave.com/docs/current/ingest-from-upstash-kafka/#query-the-materialized-view)

The materialized view can be queried to retrieve the latest data from the source:

```sql
SELECT * FROM checkin_open_notification LIMIT 5;
```

The table chart lists passengers who opted in for notifications and have flights departing soon, showing flight_id, passenger_ref_number, flight_number, carrier_code, departure_time, and contact_info. It highlights passengers with flights departing before 48 from now, indicating that check-in is open.

![S2](https://github.com/user-attachments/assets/faa941e5-7527-4fba-a60b-998580bebd0f)

### Step 4: Create a sink to send notifications

This query creates a sink named checkin_notifications_sink, which streams data from the checkin_open_notification view to the Solace topic checkin_open_notification. The connection to the Solace server is established with at-least-once Quality of Service (QoS), and the data is formatted as plain JSON. The online check-in notification system then retrieves this information from the Solace topic to send notifications to the passengers.

```sql
CREATE SINK checkin_notifications_sink
FROM checkin_open_notification
WITH (
    connector = 'mqtt',
    topic = 'checkin_open_notification',
    url = 'ssl://xxxxxxxxxx:8883',
    username='solace-cloud-client',
    password='xxxxxxxxxxxx', 
    qos = 'at_least_once'
) FORMAT PLAIN ENCODE JSON;
```

We have successfully created a source table to read data from the Solace with an MQTT source connector, built a materialized view (MV) for querying and performing real-time analytics on the data, and set up a sink to send processed data to a Solace topic using the MQTT sink connector for downstream systems to utilize.
