---
id: develop-overview
title: Develop with RisingWave Cloud
description: Get started with building streaming services using RisingWave Cloud.
slug: /develop-overview
---

RisingWave Cloud leverages the superpower of RisingWave Database, an open-source distributed SQL database specifically designed for stream processing. RisingWave Database provides an interface language that resembles PostgreSQL, enabling your team to build real-time data services without the high engineering cost and complexity of traditional stream processing.

## RisingWave Database user docs

Developers can refer to the user documentation for RisingWave Database to develop streaming applications with RisingWave Cloud. The documentation covers essential topics such as data ingestion, SQL references, data delivery, client libraries, and ecosystem, providing comprehensive information on how to utilize the capabilities of RisingWave Database to build and manage data workflows that consume streaming data, perform incremental computations, and update results dynamically.

<defaultButton text="Switch to RisingWave Database user docs →" doc="intro"/> <lightButton text="See recommended topics ↓" cloud="develop-overview#top-read-topics-for-developers"/>

## How to use the docs

RisingWave Database is a rapidly evolving system, with [new features](https://www.risingwave.dev/docs/current/release-notes/) added with each release. However, this also means that some features may not function properly in older versions. Therefore, when using the RisingWave Database user docs, it's important to select the corresponding version of the documentation based on the version of your RisingWave cluster.

<grid
nums={2}
cols={2}
children={[

<div>

### Check RisingWave Database version

To check the version you're currently using, go to [**Clusters**](https://risingwave-cloud.com/clusters/).

<img
  src={require('./images/cluster-rwversion.png').default}
  alt="Check RisingWave Database verison of clusters"
  width="95%"
/>

</div>,

<div>

### Select docs version

Select the corresponding docs version when using the RisingWave Database user docs.

<img
  src={require('./images/select-docs-version.gif').default}
  alt="Select docs version"
/>

</div>
]}
/>

## Top read topics for developers

### Ecosystem

 <grid
 nums={3}
 cols={3}
 children={[

 <card
 title="Integrations"
 content="See how RisingWave Database can integrate with your existing data stack. Vote your favorite data tools and streaming services to help us prioritize the integration development."
 url="https://www.risingwave.dev/docs/current/rw-integration-summary/"
 />,
 <card
 title="Data ingestion"
 content="Connect to and ingest data from external sources such as databases and message brokers. See supported data sources."
 url="https://www.risingwave.dev/docs/current/data-ingestion/"
 />,
 <card
 title="Data delivery"
 content="Stream processed data out of RisingWave Database to message brokers and databases. See supported data destinations."
 url="https://www.risingwave.dev/docs/current/delivery-overview/"
 />
 ]}
 />

### Process data with RisingWave Database

<card
title="SQL references"
content="SQL syntax and functionality supported by RisingWave Database. While RisingWave Database is wire-compatible with PostgreSQL, it has some unique features and notable differences."
links={[
{text:"Overview", url:"https://www.risingwave.dev/docs/current/sql-references/"},
{text:"Commands", url:"https://www.risingwave.dev/docs/current/sql-commands/"},
{text:"Query syntax", url:"https://www.risingwave.dev/docs/current/query-syntax/"},
{text:"Data types", url:"https://www.risingwave.dev/docs/current/sql-data-types/"},
{text:"Functions and operators", url:"https://www.risingwave.dev/docs/current/sql-functions/"},
{text:"Query patterns", url:"https://www.risingwave.dev/docs/current/sql-patterns/"}
]}
/>

### Use RisingWave Database in your applications

<card
title="Client libraries"
content="RisingWave Database offers support for popular PostgreSQL drivers, enabling seamless integration with your applications for interacting with it."
links={[
{text:"Java", url:"https://www.risingwave.dev/docs/current/java-client-libraries/"},
{text:"Node.js", url:"https://www.risingwave.dev/docs/current/nodejs-client-libraries/"},
{text:"Python", url:"https://www.risingwave.dev/docs/current/python-client-libraries/"},
{text:"Go", url:"https://www.risingwave.dev/docs/current/go-client-libraries/"}
]}
/>

### More to read

 <grid
 nums={2}
 cols={2}
 children={[

 <card
 title="About RisingWave"
 links={[
 {text:"Key concepts", url:"https://www.risingwave.dev/docs/current/key-concepts/"},
 {text:"Architechture", url:"https://www.risingwave.dev/docs/current/architecture/"},
 {text:"RisingWave vs. Apache Flink", url:"https://www.risingwave.dev/docs/current/risingwave-flink-comparison/"},
 {text:"Release notes", url:"https://www.risingwave.dev/docs/current/release-notes/"}
 ]}
 />,
 <card
 title="Blog"
 content="Product insights, engineering deep-dives, community events, industry highlights, and company news posted regularly by our CEO, engineers, product experts, community runners, communication specialists, and community contributors."
 url="https://www.risingwave-labs.com/blog/"
 />,
 ]}
 />