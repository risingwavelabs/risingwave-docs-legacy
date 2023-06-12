---
id: get-started
title: Quickstart
description: Get started with RisingWave.
slug: /get-started
toc_max_heading_level: 2
---

This guide will help you get started with RisingWave.

1. [**Run RisingWave**](#run-risingwave) — Install, start, and connect to RisingWave.

1. [**Ingest data**](#ingest-data) — Connect a streaming data source to RisingWave.

2. [**Process data**](#process-data) — Use Postgres-compatible SQL to process data.

3. [**Deliver data**](#deliver-data) — Send processed data to external data destinations.

## Run RisingWave

Start a RisingWave standalone instance in your local environment with Homebrew.

1. ### Install and start RisingWave

  Install [Homebrew](https://brew.sh/) and run the following commands.

  ```shell
  brew tap risingwavelabs/risingwave # Tap the repository
  brew install risingwave # Install the latest release of RisingWave. Replace with `brew install risingwave --HEAD` if you want to install the latest development version of RisingWave.
  risingwave playground # Start RisingWave in playground mode
  ```

1. ### Connect to RisingWave

  After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results. If you don't have `psql` installed, [Install `psql`](/guides/install-psql-without-full-postgres.md) first.

  Open a new terminal window and run:

  ```shell
  psql -h localhost -p 4566 -d dev -U root
  ```

:::info
This method starts RisingWave in playground mode, where data is temporarily stored in memory. The service automatically terminates after 30 minutes of inactivity, causing all data to be lost. Use this method for quick tests only.

<defaultButton text="See other options" doc="risingwave-trial"/>
:::

## Ingest data

RisingWave is now ready to ingest and process your data from streaming sources. You can connect RisingWave to databases, message brokers, and other data sources to ingest data in various formats. See [Supported sources and formats](/sql/commands/sql-create-source.md#supported-sources) for a complete list of supported sources and formats.

For example, here is an example `CREATE SOURCE` SQL statement to connect RisingWave to a Kafka topic:

```sql
-- Create a source that reads JSON data from the user_behaviors topic of a Kafka broker, starting from the earliest available offset.
CREATE SOURCE user_behaviors (  
    -- Define source columns     
    user_id VARCHAR,          
    target_id VARCHAR,        
    target_type VARCHAR,      
    event_timestamp TIMESTAMPTZ,   
    behavior_type VARCHAR,      
    parent_target_type VARCHAR,   
    parent_target_id VARCHAR  
) WITH (            
    connector = 'kafka', -- Connect to Kafka
    topic = 'user_behaviors', -- Specify the topic name
    properties.bootstrap.server = 'message_queue:29092', -- Specify Kafka broker address     
    scan.startup.mode = 'earliest' -- Configure the offset mode for consuming data
)  
ROW FORMAT JSON; -- Define data format
```

<card
 maxWidth="300px"
 title="Sources — Data ingestion"
 content="Learn more about source creation, data ingestion, data persistence for sources, supported external sources, and SQL syntax and connector settings for each source."
 doc="data-ingestion"
/>

## Process data

Creating a source in RisingWave does not immediately trigger data ingestion. Data ingestion and processing begins when a materialized view is created based on the source. In RisingWave, the result of a materialized view is updated when a relevant event arrives in the system. When you query the result, it is returned instantly as the computation has already been completed when the data comes in.

Let's create a materialized view that counts the number of targets for each distinct `target_id` present in the `user_behaviors` source using the [`CREATE MATERIALIZED VIEW`](/sql/commands/sql-create-mv.md) command.

```sql
CREATE MATERIALIZED VIEW target_count AS
SELECT
    target_id,
    COUNT(*) AS target_count
FROM
    user_behaviors
GROUP BY
    target_id;
```

Now, RisingWave will:

* Compute the results of the materialized view based on the data flowing into the `user_behaviors` source.
* Store the results in the materialized view.
* Refresh the materialized view with up-to-date count of targets for each `target_id` as new data arrives, and thus can instantly provide the latest result when you query the materialized view.

The following content covers what you can do with RisingWave to process your data, along with its unique features for stream processing.

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={4}>

 <card
 style={{height: "84%"}}
 title="RisingWave SQL 101"
 content="A simple yet typical data processing guide for RisingWave first-timers."
 doc="risingwave-sql-101"
 />

</grid>

<grid item xs={12} sm={6} md={4}>

 <card
 style={{height: "84%"}}
 title="Demos"
 content="A series of guided tours in solving real-world stream processing tasks with simulated data."
 doc="demos"
 />
  
</grid>

<grid item xs={12} sm={6} md={4}>

<card
 style={{height: "84%"}}
 title="SQL references"
 content="RisingWave SQL functionality and syntax. Commands, functions, operators, patterns, and more."
 doc="sql-references"
 />
  
</grid>

</grid>

## Deliver data

Finally, you can output the processed data to an external data destination acting as a data sink using the [CREATE SINK](sql/commands/sql-create-sink.md) command.

Let's sink data from the `target_count` materialized view to the target table in PostgreSQL using the JDBC connector.

```sql
-- Create an upsert sink to a PostgreSQL table from the materialized view.
CREATE SINK target_count_postgres_sink  
FROM target_count 
WITH (           
   connector = 'jdbc', -- Use the JDBC connector
   jdbc.url = 'jdbc:postgresql://postgres:5432/mydb?user=myuser&password=123456', -- The JDBC URL of the PostgreSQL database  
   table.name = 'target_count', -- The target table name
   type = 'upsert' -- Sink data as a changelog stream 
);
```

<card
 maxWidth="300px"
 title="Sinks — Data delivery"
 content="Learn more about sink creation, data delivery, available sink connectors, and SQL syntax and connector settings for each sink connector."
 doc="data-delivery"
/>
