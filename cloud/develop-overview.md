---
id: develop-overview
title: Develop with RisingWave Cloud
description: Get started with building streaming services using RisingWave Cloud.
slug: /develop-overview
---

RisingWave Cloud leverages the superpower of RisingWave Database, an open-source distributed SQL database specifically designed for stream processing. RisingWave Database provides an interface language that resembles PostgreSQL, enabling your team to build real-time data services without the high engineering cost and complexity of traditional stream processing.

## RisingWave Database user docs

Developers can refer to the user documentation for RisingWave Database to develop streaming applications with RisingWave Cloud. The documentation covers essential topics such as data ingestion, SQL references, data delivery, client libraries, and ecosystem, providing comprehensive information on how to utilize the capabilities of RisingWave Database to build and manage data workflows that consume streaming data, perform incremental computations, and update results dynamically.

<defaultButton text="RisingWave Database user docs" url="https://www.risingwave.dev/docs/current/intro/"/> <lightButton text="See recommended topics" cloud="develop-overview#top-read-topics-for-developers"/>

## How to use the docs

RisingWave Database is a rapidly evolving system, with [new features](https://www.risingwave.dev/docs/current/release-notes/) added with each release. However, this also means some features may not function properly in older versions. Therefore, when using the RisingWave Database user docs, it's important to select the corresponding documentation version based on your RisingWave cluster's version.


<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="baseline">

<grid item xs={6} md={6}>

### Check RisingWave Database version

To check your current version, go to [**Clusters**](https://risingwave.cloud/clusters/).

<img
  src={require('./images/cluster-rwversion.png').default}
  alt="Check RisingWave Database verison of clusters"
  width="95%"
/>

</grid>

<grid item xs={6} md={6}>

### Select docs version

Select the version of the corresponding docs when using the RisingWave Database user docs.

<img
  src={require('./images/select-docs-version.gif').default}
  alt="Select docs version"
/>
  
</grid>

</grid>

## Top read topics for developers

### Ecosystem

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
 title="Integrations"
 content="See how RisingWave Database can integrate with your existing data stack. Vote for your favorite data tools and streaming services to help us prioritize the integration development."
 url="https://www.risingwave.dev/docs/current/rw-integration-summary/"
 />

</grid>

<grid item xs={12} sm={6} md={4}>

 <card
 style={{height: "87%"}}
 title="Sources"
 content="Connect to and ingest data from external sources such as databases and message brokers. See supported data sources."
 url="https://www.risingwave.dev/docs/current/data-ingestion/"
 />
  
</grid>

<grid item xs={12} sm={6} md={4}>

<card
 style={{height: "87%"}}
 title="Sinks"
 content="Stream processed data out of RisingWave Database to message brokers and databases. See supported data destinations."
 url="https://www.risingwave.dev/docs/current/data-delivery/"
 />
  
</grid>

</grid>

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
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={6}>

 <card
 style={{height: "90%"}}
 title="About RisingWave"
 content="Continue to learn about RisingWave Database."
 links={[
 {text:"Key concepts", url:"https://www.risingwave.dev/docs/current/key-concepts/"},
 {text:"Architechture", url:"https://www.risingwave.dev/docs/current/architecture/"},
 {text:"RisingWave vs. Apache Flink", url:"https://www.risingwave.dev/docs/current/risingwave-flink-comparison/"},
 {text:"Release notes", url:"https://www.risingwave.dev/docs/current/release-notes/"}
 ]}
 />

</grid>

<grid item xs={12} sm={6} md={6}>

<card
 style={{height: "90%"}}
 title="Blog"
 content="Product insights, engineering deep-dives, community events, industry highlights, and company news posted regularly by our CEO, engineers, product experts, community runners, communication specialists, and community contributors."
 url="https://www.risingwave-labs.com/blog/"
 links={[
 {text:"Blog", url:"https://www.risingwave.com/resources/?filter=blogs"}
 ]}
 />
  
</grid>

</grid>