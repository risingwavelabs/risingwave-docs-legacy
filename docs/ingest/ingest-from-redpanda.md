---
id: ingest-from-redpanda
title: Ingest data from Redpanda
description: Connect RisingWave to a Redpanda broker.
slug: /ingest-from-redpanda
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-redpanda/" />
</head>


You can ingest data from [Redpanda](https://redpanda.com), an event streaming platform that supports real-time data streaming. Redpanda Cloud, a fully managed service, provides automated upgrades, patching, data balancing, and built-in connectors. It offers customizable cluster options to meet your data sovereignty, infrastructure, and development needs.

## Setup Redpanda

This guide will walk you through the steps to create a Redpanda cluster on Redpanda Cloud and connect it to RisingWave for data ingestion. For more details about Redpanda, refer to the [Redpanda Documentation](https://docs.redpanda.com/current/get-started/quick-start-cloud/).

### Step 1: Sign Up for Redpanda Cloud

Begin by signing up for a free Redpanda Cloud account. You can register by visiting the [Redpanda Cloud Sign-Up Page](https://cloud.redpanda.com/sign-up).

![Sign-Up Page for Redpanda Cloud](https://github.com/user-attachments/assets/19b3908f-a97c-4162-9738-d95f7e486ed1)
*Sign-Up for Redpanda Cloud*

### Step 2: Create a Redpanda Cluster

Once you’ve signed up, create a new Redpanda cluster. Choose the **Serverless** cluster option, which offers a free tier for users.

![Choosing the Serverless Cluster Option](https://github.com/user-attachments/assets/92ff93de-4aad-409b-bf93-289f43ab614c)
*Choosing the Serverless Cluster Option*

After logging in, set up your Redpanda cluster with the following details:

- **Cluster Name**: A unique name for your Redpanda cluster.
- **Region**: Select the region for your cluster.
- **Resource Group**: Choose a resource group that meets your requirements.

![Filling in Redpanda Cluster Details](https://github.com/user-attachments/assets/2e73f360-afe9-4b5d-aa5f-75b1d0596ac5)
*Filling in Redpanda Resource Group Details*

### Step 3: Create a Redpanda Topic

After setting up your cluster, the next step is to create a Redpanda topic. Redpanda simplifies this by providing default configurations for partitioning and retention policies.

![Creating a Redpanda Topic](https://github.com/user-attachments/assets/1d02298b-4f40-4b83-89bd-920a12b0d3a1)
*Creating a Redpanda Topic*

Once the topic is created, you’re ready to ingest data.

![Topic Successfully Created](https://github.com/user-attachments/assets/bc6ae244-df2b-4f87-a510-cbc89e996466)
*Topic Successfully Created*

### Step 4: Connect to Redpanda Using Kafka Clients

Redpanda is compatible with Kafka clients, allowing you to easily produce and consume data from Redpanda topics. For example, you can extract real-time data from external APIs (such as Aviationstack) and publish it to your Redpanda topic.

To interact with your Redpanda cluster, create a new user:

![Creating a Redpanda User](https://github.com/user-attachments/assets/e8066b38-aa71-4e8c-8173-c56868d7ab53)
*Creating a Redpanda User*

Grant the necessary permissions for this user to manage topics, and produce and consume messages.

![Granting User Permissions in Redpanda](https://github.com/user-attachments/assets/3a3c8b62-f241-477d-9a86-be6a7d79d48a)
*Granting User Permissions in Redpanda*

## Ingest Data into RisingWave

Now that your Redpanda cluster is set up, you can ingest and process data using RisingWave.

### Step 1: Create a RisingWave Cluster

Sign up for RisingWave Cloud and create a new RisingWave cluster using the free plan. Follow the instructions in the [RisingWave Cloud Documentation](https://docs.risingwave.com/cloud/manage-clusters/) to complete the setup.

### Step 2: Create a Source in RisingWave

After deploying the RisingWave cluster, create a source to consume data from your Redpanda topic. Use the following SQL query to set up the source:

```sql
CREATE SOURCE flight_tracking_source (
    flight_date VARCHAR,
    flight_status VARCHAR,
    departure_airport VARCHAR,
    departure_timezone VARCHAR,
    departure_scheduled TIMESTAMP WITH TIME ZONE,
    arrival_airport VARCHAR,
    arrival_timezone VARCHAR,
    arrival_scheduled TIMESTAMP WITH TIME ZONE,
    airline_name VARCHAR,
    flight_number VARCHAR,
    flight_info VARCHAR
)
WITH (
    connector = 'kafka',
    topic = 'flights_tracking',
    properties.bootstrap.server = 'xxxxxxx.cloud.redpanda.com:9092',
    properties.sasl.mechanism = 'SCRAM-SHA-256',
    properties.security.protocol = 'SASL_SSL',
    properties.sasl.username = 'xxxxxx',
    properties.sasl.password = 'xxxxxx',
    scan.startup.mode = 'earliest'
) FORMAT PLAIN ENCODE JSON;
```

### Step 3: Create a Materialized View

To analyze the data, create a materialized view that tracks the number of flights per airline over one-hour intervals:

```sql
CREATE MATERIALIZED VIEW Airline_Flight_Counts AS
SELECT 
    airline_name,
    COUNT(airline_name) AS total_flights,
    window_start, 
    window_end
FROM TUMBLE (flight_tracking_source, arrival_scheduled, INTERVAL '1 hour')
GROUP BY airline_name, window_start, window_end
ORDER BY total_flights DESC;
```

### Step 4: Query the Materialized View

You can now query the `Airline_Flight_Counts` view to retrieve the latest data:

```sql
SELECT * FROM Airline_Flight_Counts LIMIT 5;
```

The output will look something like this:

![Querying the Materialized View](https://github.com/user-attachments/assets/8f0efd82-4552-4b3e-8e81-f7870c4016ab)
*Querying the Materialized View*

You have successfully consumed data from Redpanda into RisingWave, created a source, materialized view, and performed queries on it. This setup enables real-time analytics on flight tracking data, and you can optionally sink it to another Redpanda topic or other downstream systems for further analysis.
