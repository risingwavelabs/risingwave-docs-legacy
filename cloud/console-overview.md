---
id: console-overview
title: Workspace
description: The most intuitive and easy way to connect to and interact with RisingWave.
slug: /console-overview
---

<!-- MDX imports -->
import DefaultButton from "@site/src/components/DefaultButton";
import OutlinedCard from "@site/src/components/OutlinedCard";

It is the most intuitive and easy way to interact with RisingWave via workspace. It offers graphical tools for managing data and visualizing results.

![Console](./images/console.png)

<DefaultButton text="Go to query console" url="https://cloud.risingwave.com/console/" block/>

## Sections

Click on a section below to see the details.

<img
src={require('./images/console-sections.png').default}
alt="Console sections"
usemap="#image-map"
/>

<map name="image-map">
    <area href="#schema" coords="2,2,179,573" shape="rect" />
    <area href="#query-editor" coords="183,2,710,360" shape="rect" />
    <area href="#query-results" coords="183,364,710,573" shape="rect" />
</map>

### Schema

The schema section displays all the tables, sources, materialized views, and sinks defined in the cluster.

To check their columns, click on each item, or click **Expand all** to see all.

<img
src={require('./images/console-schemas.png').default}
alt="Schemas sections"
width="200px"
/>

### Query editor

The query editor serves as a terminal window where you can write and execute SQL queries.

<img
src={require('./images/console-queryeditor.png').default}
alt="Schemas sections"
width="600px"
/>

#### Jobs

Jobs allow you to organize your SQL statements into groups, making managing and executing multiple queries easier.

Click <img class="disabled-zoom" src={require('./images/icon-console-queryeditor-jobs-add.png').default} width="20px"/> to add a job.

<img
src={require('./images/console-queryeditor-jobs.png').default}
alt="Query jobs"
width="270px"
/>

#### Sample queries

The sample queries cover the most common steps in RisingWave, such as establishing a connection with a data source, processing data by defining materialized views and querying the results.

See [Explore RisingWave with examples](./quickstart.md#step-4-explore-risingwave-with-examples) for details.

#### Switch users

Click **Switch** in the top right corner to change to another user in your current project when using the console.

### Query results

Here you can view the results of your last query.

<img
src={require('./images/console-queryresults.png').default}
alt="Query results"
width="600px"
/>

#### Visualize results

Selete the **Chart** tab to visualize the results.

<img
src={require('./images/console-queryresults-visualize.png').default}
alt="Visualize query results"
width="600px"
/>

#### Refresh results

Click <img class="icon" src={require('./images/icon-rerun.png').default} width="15px"/> to rerun the last executed query manually or set a timer to refresh the results automatically.

<img
src={require('./images/console-queryresults-refresh.png').default}
alt="Refresh query results"
width="300px"
/>

#### Download results

Click <img class="icon" src={require('./images/icon-console-queryresults-download.png').default} width="40px"/> to download a CSV copy of the results.

#### Query log

Selete the **Log** tab to check the query log.

The query log tracks and records all queries executed during the current session, providing information such as the execution time, network time, and error messages. The log can help monitor activity, troubleshoot issues, and optimize queries.

<img
src={require('./images/console-querylog.png').default}
alt="Query log"
width="800px"
/>

## Start developing

<OutlinedCard
title="Develop with RisingWave Cloud"
content="RisingWave Cloud leverages the superpower of RisingWave, an open-source distributed SQL database specifically designed for stream processing. Start building your real-time applications with RisingWave using the console."
cloud="develop-overview"
/>
