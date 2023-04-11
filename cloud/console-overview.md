---
id: console-overview
title: Console
description: The console is the most intuitive and easy way to connect to and interact with RisingWave Database, offering graphical tools for managing data and visualizing results.
slug: /console-overview
---

The console is the most intuitive and easy way to interact with RisingWave Database, offering graphical tools for managing data and visualizing results.

<defaultButton text="Go to Console" url="https://risingwave.cloud/console/" block/>

<br/>

<img
src={require('./images/console.png').default}
alt="Console"
/>

## Sections

Click on a section below to see the details.

<img
src={require('./images/console-sections.png').default}
alt="Console sections"
width="600px"
usemap="#image-map"
/>

<map name="image-map">
    <area href="#schemas" coords="2,2,150,565" shape="rect" />
    <area href="#query-editor" coords="154,2,597,303" shape="rect" />
    <area href="#query-results--visualization" coords="154,305,597,480" shape="rect" />
    <area href="#query-log" coords="154,485,597,564" shape="rect" />
</map>

### Schemas

The Schemas section lists displays all the tables, sources, and materialized views currently available in the cluster.

To check their columns, click on each item, or click **Expand all** to see all.

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

Jobs allow you to organize your SQL statements into groups, making it easier to manage and execute multiple queries.

Click <img src={require('./images/icon-console-queryeditor-jobs-add.png').default} width="20px"/> to add a job.

<img
src={require('./images/console-queryeditor-jobs.png').default}
alt="Query jobs"
width="270px"
/>

#### Sample queries

The sample queries cover the most common steps in using RisingWave Database, such as establishing a connection with a data source, processing data by defining materialized views, and querying the results.

See [Explore RisingWave with examples](/cloud/quickstart.md/?step=4) for details.

#### Switch clusters or users

Click **Switch** to change to another cluster or to another user in your current cluster when using the console.

<img
src={require('./images/console-switchclusteruser.gif').default}
alt="Switch clusters or users"
width="800px"
/>

### Query results & visualization

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

Click <img src={require('./images/icon-rerun.png').default} width="15px"/> to rerun the last executed query manully, or set a timer to refresh the results automatically.

<img
src={require('./images/console-queryresults-refresh.png').default}
alt="Refresh query results"
width="300px"
/>

#### Download results

Click <img src={require('./images/icon-console-queryresults-download.png').default} width="40px"/> to download a CSV copy of the results.

### Query log

The query log tracks and records all queries executed during the current session, providing information such as the execution time, network time, and error messages. The log can help monitor activity, troubleshoot issues, and optimize queries.

<img
src={require('./images/console-querylog.png').default}
alt="Query log"
width="800px"
/>

## Start developing

<card
title="Develop with RisingWave Cloud"
content="RisingWave Cloud leverages the superpower of RisingWave Database, an open-source distributed SQL database specifically designed for stream processing. Start building your real-time applications with RisingWave Database using the console."
cloud="develop-overview"
/>