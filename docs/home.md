---
id: home
title: RisingWave User Documentation
slug: /home
description: Browse the latest user documentation, including concepts, instructions, demos, and SQL references.
hide_table_of_contents: true
---

Browse the latest user documentation, including concepts, instructions, demos, and SQL references.

<br/><br/><br/>

# New to RisingWave

Innovate your business by leveraging continuous insights on live data.

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={4}>

 <card
 style={{height: "87%"}}
 title="What’s RisingWave?"
 content="RisingWave is a distributed SQL streaming database designed to reduce the complexity and cost of extracting real-time insights from your data."
 doc="intro"
 />

</grid>

<grid item xs={12} sm={6} md={4}>

 <card
 style={{height: "87%"}}
 title="RisingWave vs Flink"
 content="At 10 times the speed and efficiency of Apache Flink, RisingWave effortlessly communicates with you in the language you know best."
 doc="risingwave-flink-comparison"
 />
  
</grid>

<grid item xs={12} sm={6} md={4}>

<card
 style={{height: "87%"}}
 title="Use cases"
 content="Discover why RisingWave may be the ideal solution for streaming ETL, real-time analytics, and event-driven applications."
 doc="use-cases"
 />
  
</grid>

</grid>

---

<grid
 container
 direction="row"
 spacing="30"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={4}>

![What's RisingWave](/img/home/1.svg)

### What’s RisingWave?

RisingWave is a distributed SQL streaming database designed to reduce the complexity and cost of extracting real-time insights from your data.

[Learn more](/intro.md)

</grid>

<grid item xs={12} sm={6} md={4}>

![RisingWave vs Flink](/img/home/2.svg)

### RisingWave vs Flink

At 10 times the speed and efficiency of Apache Flink, RisingWave effortlessly communicates with you in the language you know best.

[Learn more](/risingwave-flink-comparison.md)
  
</grid>

<grid item xs={12} sm={6} md={4}>

![Use cases](/img/home/3.svg)

### Use cases

Discover why RisingWave may be the ideal solution for streaming ETL, real-time analytics, and event-driven applications.

[Learn more](/use-cases.md)
  
</grid>

</grid>

<br/><br/><br/>

# Get started

Everything you need to get started on stream processing with RisingWave, in minutes.

 <grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={6}>

![RisingWave Cloud](/img/home/RisingWave-Cloud.svg)

 <card
 style={{height: "80%"}}
 title="RisingWave Cloud"
 content="RisingWave Cloud is a hosted service that provides out-of-the-box RisingWave service, without the hassles of configuration and ongoing maintenance. It comes with an easy-to-use UI for running queries and managing sources, sinks, and clusters."
 links={[
 {text:"Start a free cloud cluster in 5 minutes", cloud:"quickstart"},
 {text:"Browse documentation", cloud:"intro"},
 {text:"See pricing ", url:"https://www.risingwave.com/pricing/"}
 ]}
 />

</grid>

<grid item xs={12} sm={6} md={6}>

![RisingWave](/img/home/RisingWave.svg)

<card
 style={{height: "80%"}}
 title="RisingWave"
 content="RisingWave is an open-source distributed SQL streaming database under Apache License 2.0. It's well-optimized for high-throughput and low-latency stream processing in the cloud."
 links={[
 {text:"Install on your laptop with 4 lines of code", doc:"get-started"},
 {text:"Browse documentation", doc:"intro"},
 {text:"Access GitHub repo", url:"https://github.com/risingwavelabs/risingwave"}
 ]}
 />
  
</grid>

</grid>

<br/><br/><br/>

# Ecosystem

See how RisingWave can integrate with your existing data stack. [Request an integration](/rw-integration-summary.md)

<sectionGrid cols={4} icons={[
  {src:"/img/ecosystem/kafka.svg", doc:"create-source-kafka", text: "Kafka"},
  {src:"/img/ecosystem/redpanda.svg", doc:"create-source-redpanda", text: "Redpanda"},
  {src:"/img/ecosystem/confluent.svg", doc:"confluent-kafka-source", text: "Confluent Cloud"},
  {src:"/img/ecosystem/msk.svg", doc:"connector-amazon-msk", text: "MSK"},
  {src:"/img/ecosystem/pulsar.svg", doc:"create-source-pulsar", text: "Pulsar"},
  {src:"/img/ecosystem/astra.svg", doc:"connector-astra-streaming", text: "Astra Streaming"},
  {src:"/img/ecosystem/streamnative.svg", text: "StreamNative Cloud"},
  {src:"/img/ecosystem/s3.svg", doc:"create-source-s3", text: "S3"},
  {src:"/img/ecosystem/kinesis.svg", doc:"create-source-kinesis", text: "Kinesis"},
  {src:"/img/ecosystem/postgresql.svg", doc:"ingest-from-postgres-cdc", text: "PostgreSQL"},
  {src:"/img/ecosystem/mysql.svg", doc:"ingest-from-mysql-cdc", text: "MySQL"},
  {src:"/img/ecosystem/tidb.svg", doc:"create-source-cdc", text: "TiDB"},
  {src:"/img/ecosystem/citus.svg", doc:"ingest-from-citus-cdc", text: "Citus"},
]}>

### Sources

Connect to and ingest data from external sources.

[Learn more](/data-ingestion.md)

</sectionGrid >

<sectionGrid cols={4} icons={[
  {src:"/img/ecosystem/kafka.svg", doc:"create-sink-kafka", text: "Kafka"},
  {src:"/img/ecosystem/kinesis.svg", doc:"sink-to-aws-kinesis", text: "Kinesis"},
  {src:"/img/ecosystem/postgresql.svg", doc:"sink-to-postgres", text: "PostgreSQL"},
  {src:"/img/ecosystem/mysql.svg", doc:"sink-to-mysql-with-jdbc", text: "MySQL"},
  {src:"/img/ecosystem/tidb.svg", doc:"sink-to-tidb", text: "TiDB"},
  {src:"/img/ecosystem/iceberg.svg", doc:"sink-to-iceberg", text: "Iceberg"},
]}>

### Sinks

Stream processed data out of RisingWave to external targets.

[Learn more](/data-delivery.md)

</sectionGrid >

<sectionGrid cols={4} icons={[
  {src:"/img/ecosystem/grafana.svg", doc:"grafana-integration", text: "Grafana"},
  {src:"/img/ecosystem/superset.svg", doc:"superset-integration", text: "Superset"},
  {src:"/img/ecosystem/dbeaver.svg", text: "DBeaver"},
  {src:"/img/ecosystem/redash.svg", text: "Redash"},
]}>

### BI tools

Unlock actionable insights and create stunning visualizations for your data.

</sectionGrid >

<sectionGrid cols={4} icons={[
  {src:"/img/ecosystem/java.svg", doc:"java-client-libraries", text: "Java"},
  {src:"/img/ecosystem/nodejs.svg", doc:"nodejs-client-libraries", text: "Node.js"},
  {src:"/img/ecosystem/python.svg", doc:"python-client-libraries", text: "Python"},
  {src:"/img/ecosystem/go.svg", doc:"go-client-libraries", text: "Go"},
]}>

### Client libraries

Integrate RisingWave into your applications using PostgreSQL drivers.

</sectionGrid >

<br/><br/><br/>

# Essential topics

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import JoinInnerOutlinedIcon from '@mui/icons-material/JoinInnerOutlined';
import NextWeekOutlinedIcon from '@mui/icons-material/NextWeekOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';

<br/>

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="flex-start"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={6} sm={6} md={3}>

### <RocketLaunchOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> Get started
---

[Run RisingWave for testing](/deploy/risingwave-trial.md)

[Deploy with RisingWave Cloud](/deploy/risingwave-cloud.md)

[Deploy with Kubernetes operator](/deploy/risingwave-kubernetes.md)
  
</grid>

<grid item xs={6} sm={6} md={3}>

### <InfoOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> About
---

[Release notes](/release-notes.md)

[Architecture](/Architecture.md)

[Key concepts and terms](/key-concepts.md)

[Fault tolerance](/fault-tolerance.md)

[Data persistence](/data-persistence.md)

</grid>

<grid item xs={6} sm={6} md={3}>

### <JoinInnerOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> SQL references
---

[Commands](/docs/current/sql-commands)

[Query syntax](/docs/current/query-syntax)

[Data types](/docs/sql/sql-data-types.md)

[Functions and operators](/docs/current/sql-functions)

[Patterns](/docs/current/sql-patterns)

[See all →](/docs/current/sql-references)
  
</grid>

<grid item xs={6} sm={6} md={3}>

### <NextWeekOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> Demos
---

[Real-time ad performance analysis](/tutorials/real-time-ad-performance-analysis.md)

[Server performance anomaly detection](/tutorials/server-performance-anomaly-detection.md)

[Fast Twitter events processing](/tutorials/fast-twitter-events-processing.md)

[Clickstream analysis](/tutorials/clickstream-analysis.md)

[Live stream metrics analysis](/tutorials/live-stream-metrics-analysis.md)

[Use RisingWave to monitor RisingWave metrics](/tutorials/monitor-rw-metrics.md)

</grid>

</grid>

<br/>

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="flex-start"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={6} sm={6} md={3}>

### <ManageAccountsOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> Manage
---

[View statement progress](/manage/view-statement-progress.md)

[View and adjust system parameters](/manage/view-configure-system-parameters.md)

[Back up and restore meta service](/manage/meta-backup.md)

[Dedicated compute node](/manage/dedicated-compute-node.md)

[Telemetry](/telemetry.md)
  
</grid>

<grid item xs={6} sm={6} md={3}>

### <CloudOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> RisingWave Cloud
---

[Manage clusters](/cloud/cluster-manage-clusters.md)

[Manage database users](/cloud/cluster-manage-database-users.md)

[Monitor materialized views](/cloud/cluster-monitor-materialized-views.md)

[Manage sources](/cloud/source-manage-sources.md)

[Manage sinks](/cloud/sink-manage-sinks.md)

[Query console](/cloud/console-overview.md)
  
</grid>

</grid>