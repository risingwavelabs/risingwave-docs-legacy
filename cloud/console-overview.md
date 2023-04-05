---
id: console-overview
title: Console
description: The console is the most intuitive and easy way to connect to and interact with RisingWave Database, offering graphical tools for managing data and visualizing results.
slug: /console-overview
---

The console is the most intuitive and easy way to interact with RisingWave Database, offering graphical tools for managing data and visualizing results.

<defaultButton text="Go to Console" url="https://risingwave-cloud.com/console/" block/>

<br/>

<img
src={require('./images/console.png').default}
alt="Console"
/>

## Sections

<img
src={require('./images/console-sections.png').default}
alt="Console sections"
/>

### Schemas

The Schemas section lists displays all the tables, sources, and materialized views currently available in the cluster.

To check their subordinate columns，click on each item, or click **Expand all** to see all.

<img
src={require('./images/console-schemas.png').default}
alt="Schemas sections"
width="200px"
/>

### Query editor

The query editor serve as a terminal window where you can write and execute SQL queries.

<img
src={require('./images/console-queryeditor.png').default}
alt="Schemas sections"
width="600px"
/>

#### Jobs

You can organize your queries into several jobs. Jobs allow you to organize your SQL statements into groups, making it easier to manage and execute multiple queries.

Click <img src={require('./images/icon-console-queryeditor-jobs-add.png').default} width="15px"/> to add a job.

<img
src={require('./images/console-queryeditor-jobs.png').default}
alt="Query jobs"
width="270px"
/>

#### Sample queries

The sample queries cover the most common steps in using RisingWave Database, such as establishing a connection with a data source, processing data by defining materialized views, and querying the results.

See [Explore RisingWave with examples](/cloud/quickstart.md/?step=4) for details.

#### Switch clusters or users

You can switch to another cluster or to another user in your current cluster when using the console.

<img
src={require('./images/console-switchclusteruser.gif').default}
alt="Switch clusters or users"
width="800px"
/>

### Query results & visualization

#### Visualize results

#### Refresh results

You can click <img src={require('./images/icon-rerun.png').default} width="15px"/> to rerun the last executed query manully, or set a timer to refresh the results automatically.

<img
src={require('./images/console-queryeditor-refresh.png').default}
alt="Refresh query results"
width="300px"
/>

#### Download results

### Query log

## Start developing

<card
title="Develop with RisingWave Cloud"
content="RisingWave Cloud leverages the superpower of RisingWave Database, an open-source distributed SQL database specifically designed for stream processing. Start building your real-time applications with RisingWave Database using the console."
cloud="develop-overview"
/>