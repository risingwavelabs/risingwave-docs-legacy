---
id: use-cases
title: RisingWave use cases
slug: /use-cases
keywords: [streaming database, risingwave, use cases]
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/use-cases/" />
</head>
RisingWave can be an excellent fit for these categories of use cases.

- Streaming ETL
- Real-time analytics
- Event-driven applications

They are related categories of use cases. Streaming ETL forms the basis for both real-time analytics and event-driven applications. Real-time analytics expands on streaming ETL by incorporating dashboards, while event-driven applications build on real-time analytics by adding logic to evaluate conditions and trigger follow-up actions.

## Streaming ETL

Streaming ETL (extract, transform, and load) refers to the practice of continuously extracting, transforming, and moving data among different systems as the data comes in.

Streaming ETL provides several advantages over batch ETL jobs, such as lower latency, scalability, more granular data processing, more efficient resource usage, and better data freshness.

It typically involves the use of stream processing frameworks such as Apache Flink or RisingWave.

### How does RisingWave support streaming ETL?

- Extract: RisingWave supports ingesting data from a wide range of data sources, such as message queues, log files, or change data capture (CDC) streams from databases.
- Transform: RisingWave allows you to do all sorts of data transformations, such as mapping,  filtering, joining, aggregation, windowing and stateful processing, over streaming data.
- Load: You can sink processed data from RisingWave to downstream systems such as databases, data warehouses, or message queues.

### Where does RisingWave fit in your technical stack for streaming ETL?

![RisingWave in streaming ETL use cases](./images/use_case_etl.svg)

### Streaming ETL examples

- Continuous data integration
- IoT data processing

## Real-time analytics

Real-time analytics refers to the practice of analyzing data as it is generated or received, rather than after the fact. Real-time analytics can provide businesses with valuable insights and actionable information in near real-time, allowing them to make faster, more informed decisions.

In many industries, such as finance, healthcare, and e-commerce, real-time analytics can provide a competitive advantage by enabling businesses to respond quickly to changing market conditions, customer behavior, and operational issues. Real-time analytics can also be used to improve operational efficiency and reduce costs.

Compared to the traditional batch-based analytics, real-time analytics has clear advantages. However, it may be challenging to implement a real-time analytics application.

### How does RisingWave support real-time analytics?

RisingWave supports real-time analytics by ingesting and transforming data in real-time from a variety of data sources, such as message queues, databases, and log files. It maintains the always fresh results in its own storage, which allows for directly serving queries from dashboards. RisingWave also offers the option to sink data to a database, warehouse, or data lake. This givers user the flexibility to further enrich their dataset to query from. Additionally, it supports streaming SQL to make it easier to set up the stack.

### Where does RisingWave fit in your technical stack for real-time analytics?

![RisingWave in real-time analytics use cases](./images/use_case_analytics.svg)

### Real-time analytics examples

- [Real-time ad performance analysis](/tutorials/real-time-ad-performance-analysis.md)
- [Twitter events processing](/tutorials/fast-twitter-events-processing.md)
- [Clickstream analysis](/tutorials/clickstream-analysis.md)
- [Live stream metrics analysis](/tutorials/live-stream-metrics-analysis.md)
- Cryptocurrency intelligence

## Event-driven applications

Event-driven applications are software applications that respond to events or messages, rather than traditional request-response interactions. In an event-driven architecture, events are generated and consumed by various components of the application, and the application's behavior is determined by the events that are received.

Events can be any type of occurrence or notification that is important to the application, such as a user clicking a button, a sensor detecting a change in temperature, or a message arriving from another application. When an event is generated, it is typically published on a message bus or event stream, where it can be consumed by other components of the application.

Event-driven applications are often built using a microservices architecture, where each microservice is responsible for a specific business function and communicates with other microservices through events. This allows for greater flexibility and scalability, as each microservice can be independently developed, deployed, and scaled.

One of the key advantages of event-driven applications is their ability to handle complex, real-time interactions between different components of the application. By using events to communicate between components, event-driven applications can be more responsive and resilient to changes in the environment.

### How does RisingWave support event-driven applications?

RisingWave supports event-driven applications in several ways.

1. It enables continuous event ingestion and processing, allowing applications to respond to events in real-time. RisingWave’s support for event time processing also allows it to handle out-of-order events and late arriving data.

2. RisingWave supports stateful processing, which enables it to maintain context across multiple events and perform more sophisticated processing. RisingWave’s support for keyed state also allows event-driven applications to maintain state for each key in a data stream.

3. RisingWave supports complex event processing through its temporal operators, temporal functions, and user-defined functions, enabling it to detect complex patterns and correlations within a stream of events.

4. RisingWave provides direct integration with a variety upstream and downstream systems, such as Apache Kafka, PostgreSQL, and MySQL. This enables event-driven applications to leverage these systems for event streaming and storage, making it easier to build end-to-end event-driven architectures.

### Where does RisingWave fit in your technical stack for event-driven applications?

![RisingWave in event-driven applications](./images/use_case_event.svg)

### Event-driven application examples

- [Server performance anomaly detection](/tutorials/server-performance-anomaly-detection.md)
- Online recommendation system
- Inventory management
