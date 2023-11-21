---
id: source-manage-sources
title: Manage sources
description: Manage data sources your database connected to.
slug: /manage-sources
---

To ingest data into RisingWave, you must first create a source. A source refers to an external data feed that RisingWave can read from. You can connect RisingWave to a variety of external sources like databases and message brokers.

You can manage your data sources in [**Source**](https://cloud.risingwave.com/source/).

<img
src={require('./images/sources.png').default}
alt="Sources page"
/>

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={6}>

<card
title="Create a source"
content="Create a source in the database to read external data."
cloud="create-a-source"
style={{height: "80%"}}
/>

</grid>

<grid item xs={12} sm={6} md={6}>

<card
title="Drop a source"
content="If you no longer require data from a source, drop the source connection to stop data consumption."
cloud="drop-a-source"
style={{height: "80%"}}
/>

</grid>

</grid>

## Check source details

Click on a source to view its details, inclduing the connector settings, schema, and running status.

<img
src={require('./images/source-details-page.png').default}
alt="Source details page"
/>
