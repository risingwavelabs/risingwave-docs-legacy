---
id: home
title: RisingWave User Documentation
slug: /home
description: Browse the latest user documentation, including concepts, instructions, demos, and SQL references.
hide_table_of_contents: true
---

# RisingWave User Documentation

Browse the latest user documentation, including concepts, instructions, demos, and SQL references.

<br/><br/>

# New to RisingWave

Innovate your business by leveraging continuous insights on live data.

<grid
 container
 direction="row"
 spacing="25"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={4} md={4}>

<card
style={{height: "90%"}}
img={ {light: "/img/home/1-light.svg", dark : "/img/home/1-dark.svg"} }
title="What’s RisingWave?"
content="RisingWave is a distributed SQL streaming database designed to reduce the complexity and cost of extracting real-time insights from your data."
links={[
{text:"Learn more", doc:"intro"}
]}
/>

</grid>

<grid item xs={12} sm={4} md={4}>

<card
style={{height: "90%"}}
img={ {light: "/img/home/2-light.svg", dark : "/img/home/2-dark.svg"} }
title="RisingWave vs Flink"
content="At 10 times the speed and efficiency of Apache Flink, RisingWave effortlessly communicates with you in the language you know best."
links={[
{text:"Learn more", doc:"risingwave-flink-comparison"}
]}
/>

</grid>

<grid item xs={12} sm={4} md={4}>

<card
style={{height: "90%"}}
img={ {light: "/img/home/3-light.svg", dark : "/img/home/3-dark.svg"} }
title="Use cases"
content="Discover why RisingWave may be the ideal solution for streaming ETL, real-time analytics, and event-driven applications."
links={[
{text:"Learn more", doc:"use-cases"}
]}
/>

</grid>

</grid>

<br/><br/>

# Get started

Everything you need to get started on stream processing with RisingWave, in minutes.

<grid
 container
 direction="row"
 spacing="25"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={6}>

<card
style={{height: "90%"}}
img={ {light: "/img/home/RisingWave-Cloud-light.svg", dark : "/img/home/RisingWave-Cloud-dark.svg"} }
content="RisingWave Cloud is a hosted service that provides out-of-the-box RisingWave service, without the hassles of configuration and ongoing maintenance. It comes with an easy-to-use UI for running queries and managing sources, sinks, and clusters."
links={[
{text:"Start a free cloud cluster in 5 minutes", cloud:"quickstart"},
{text:"Browse documentation", cloud:"intro"},
{text:"See pricing ", url:"https://www.risingwave.com/pricing/"}
]}
/>

</grid>

<grid item xs={12} sm={6} md={6}>

<card
style={{height: "90%"}}
img={ {light: "/img/home/RisingWave-light.svg", dark : "/img/home/RisingWave-dark.svg"} }
content="RisingWave is an open-source distributed SQL streaming database under Apache License 2.0. It's well-optimized for high-throughput and low-latency stream processing in the cloud."
links={[
{text:"Install on your laptop with 4 lines of code", doc:"get-started"},
{text:"Browse documentation", doc:"intro"},
{text:"Access GitHub repo", url:"https://github.com/risingwavelabs/risingwave"}
]}
/>

</grid>

</grid>

<br/><br/>

# Ecosystem

import StreamOutlinedIcon from '@mui/icons-material/StreamOutlined';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';

See how RisingWave can integrate with your existing data stack. [Request an integration](/docs/current/rw-integration-summary)

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
{src:"/img/ecosystem/mongodb.svg", doc:"ingest-from-mongodb-cdc", text: "MongoDB"},
{src:"/img/ecosystem/nats.svg", doc:"ingest-from-nats", text: "NATS JetStream"},
]}>

### Sources

Connect to and ingest data from external sources.

[Learn more](/docs/current/data-ingestion)

</sectionGrid >

---

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

[Learn more](/docs/current/data-delivery)

</sectionGrid >

---

<sectionGrid cols={4} icons={[
{src:"/img/ecosystem/grafana.svg", doc:"grafana-integration", text: "Grafana"},
{src:"/img/ecosystem/superset.svg", doc:"superset-integration", text: "Superset"},
{src:"/img/ecosystem/dbeaver.svg", text: "DBeaver"},
{src:"/img/ecosystem/redash.svg", text: "Redash"},
]}>

### BI tools

Unlock actionable insights and create stunning visualizations for your data.

</sectionGrid >

---

<sectionGrid cols={4} icons={[
{src:"/img/ecosystem/java.svg", doc:"java-client-libraries", text: "Java"},
{src:"/img/ecosystem/nodejs.svg", doc:"nodejs-client-libraries", text: "Node.js"},
{src:"/img/ecosystem/python.svg", doc:"python-client-libraries", text: "Python"},
{src:"/img/ecosystem/go.svg", doc:"go-client-libraries", text: "Go"},
]}>

### Client libraries

Integrate RisingWave into your applications using PostgreSQL drivers.

</sectionGrid >

<br/><br/>

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

[Run RisingWave for testing](/docs/current/get-started/)

[Deploy with RisingWave Cloud](/docs/current/risingwave-cloud)

[Deploy with Kubernetes operator](/docs/current/risingwave-kubernetes)

</grid>

<grid item xs={6} sm={6} md={3}>

### <InfoOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> About

---

[Release notes](/docs/release-notes)

[Architecture](/docs/current/architecture)

[Key concepts and terms](/docs/current/key-concepts)

[Fault tolerance](/docs/current/fault-tolerance)

[Data persistence](/docs/current/data-persistence)

</grid>

<grid item xs={6} sm={6} md={3}>

### <NextWeekOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> Demos

---

[Real-time ad performance analysis](/docs/current/real-time-ad-performance-analysis)

[Server performance anomaly detection](/docs/current/server-performance-anomaly-detection)

[Fast Twitter events processing](/docs/current/fast-twitter-events-processing)

[Clickstream analysis](/docs/current/clickstream-analysis)

[Live stream metrics analysis](/docs/current/live-stream-metrics-analysis)

[Use RisingWave to monitor RisingWave metrics](/docs/current/use-risingwave-to-monitor-risingwave-metrics)

</grid>

<grid item xs={6} sm={6} md={3}>

### <JoinInnerOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> Transformation

---

[Dynamic filters](/docs/current/sql-pattern-dynamic-filters)

[Temporal filters](/docs/current/sql-pattern-temporal-filters)

[Joins](/docs/current/query-syntax-join-clause)

[Top-N by group](/docs/current/sql-pattern-topn)

[Time window functions](/docs/current/sql-function-time-window)

[User-defined functions](/docs/current/user-defined-functions)

[Window functions](/docs/current/window-functions)

[Emit on window close](/docs/current/emit-on-window-close)

[Watermarks](/docs/current/watermarks)

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

### <JoinInnerOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> References

---

[Commands](/docs/current/sql-commands)

[Query syntax](/docs/current/query-syntax)

[Data types](/docs/current/sql-data-types)

[Functions and operators](/docs/current/sql-functions)

[System catalogs](/docs/current/system-catalogs)

[See all →](/docs/current/sql-references)

</grid>

<grid item xs={6} sm={6} md={3}>

### <ManageAccountsOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> Manage

---

[View statement progress](/docs/current/view-statement-progress)

[View and adjust system parameters](/docs/current/view-configure-system-parameters)

[Back up and restore meta service](/docs/current/meta-backup)

[Dedicated compute node](/docs/current/dedicated-compute-node)

[Telemetry](/docs/current/telemetry)

</grid>

<grid item xs={6} sm={6} md={3}>

### <CloudOutlinedIcon sx={{ verticalAlign: "sub", color: "var(--ifm-font-color-base)" }} /> RisingWave Cloud

---

[Manage clusters](/cloud/manage-clusters)

[Manage database users](/cloud/manage-database-users)

[Monitor materialized views](/cloud/monitor-materialized-views)

[Manage sources](/cloud/manage-sources)

[Manage sinks](/cloud/manage-sinks)

[Query console](/cloud/console-overview)

</grid>

</grid>
