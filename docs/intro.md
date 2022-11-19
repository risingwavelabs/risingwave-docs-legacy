---
id: intro
title: What is RisingWave?
slug: /intro
sidebar_position: 1
---



RisingWave is an open-source cloud-native streaming database that uses SQL as the interface to manage and query data. It is designed to reduce the complexity and cost of building real-time applications. RisingWave consumes streaming data, performs incremental computations when new data come in, and updates results dynamically. As a database system, RisingWave maintains results in its own storage so that users can access data efficiently. You can sink data from RisingWave to an external stream for storage or additional processing.

RisingWave accepts data from sources like Apache Kafka, Apache Pulsar, Amazon Kinesis, Redpanda, and materialized CDC sources. It supports outputting data to Kafka streams.

<rollButton text="&nbsp;&nbsp;Get Started" doc="get-started" block />
<br/>

<img
  src={require('./images/archi_simple.png').default}
  alt="RisingWave Architecture"
/>


## What can you do with RisingWave?

Everything you do in RisingWave is via Postgres-compatible SQL. You can:

* Collect and transform data from streams.
* Create materialized views for the data that needs to be incrementally aggregated.
* Query data in RisingWave, including persisted data and data you add or import to RisingWave.
* Output data to external streams for storage or additional processing.

<defaultButton text="Try it out" doc="get-started"/>
<lightButton text="Supported sources" doc="sql-create-source#supported-sources"/>
<lightButton text="Supported sinks" doc="sql-create-sink"/>

## How does RisingWave work?

### SQL as the interface to manage and query data

RisingWave makes it easy to manage streams and data. All you need to interact with RisingWave is Postgres-compatible SQL. No Java or Scala codes are needed.

### Real-time results via materialized views

With RisingWave, you define the data you need as materialized views. As new data comes in, RisingWave only performs incremental aggregations as the results for previous events have already been calculated, thus reducing the processing time significantly. To further lower the latency, we optimized the storage processing logic for complex computations and high-concurrency scenarios. Queries can be processed and results can be delivered with low latency even in these demanding circumstances.

Results of materialized views are stored in RisingWave. You can issue a query to find out the latest result of a materialized view.

### Elastic and cost-effective

As a cloud-native platform, RisingWave is super elastic. You can dynamically adjust the compute and storage resources based on your actual requirements.

RisingWave is cost-effective. You pay for what you use as you scale. As compute is decoupled from storage in RisingWave, they can be scaled separately. In addition, RisingWave stores data in object storage systems (Amazon S3 and S3-compatible systems). The storage cost is down significantly compared with other centralized solutions that store data in expensive data warehouses.

### Data is correct and consistent

When data is processed in batches, if a job goes wrong, you can do some troubleshooting and rerun the job. However, it's not practical to rerun a stream processing job, because the stream never ends. In stream processing, it is crucial that data is calculated correctly and events are not missed or calculated twice. Otherwise, the data will not match the data in upstream or downstream systems.

In RisingWave, data correctness is ensured by a checkpoint-based mechanism. Every time a checkpoint is triggered, the internal states of each operator will be flushed to the cloud storage. Upon failovers, the operator recovers from the latest checkpoint on the cloud storage. 

<lightButton text="See the architecture" doc="architecture"/>
<lightButton text="Access the source code ⧉" url="https://github.com/risingwavelabs/risingwave"/>
<br/>
