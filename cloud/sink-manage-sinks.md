---
id: sink-manage-sinks
title: Manage sinks
description: Manage data sinks your database connected to.
slug: /manage-sinks
---

To stream data out of RisingWave, you must create a sink. A sink refers to an external target that you can send data to. You can deliver data to downstream systems via our sink connectors.

You can manage your data sinks in [**Sink**](https://cloud.risingwave.com/sink/).

<img
  src={require('./images/sinks.png').default}
  alt="Sinks page"
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
title="Create a sink"
content="Create a sink in the database to export data."
cloud="create-a-sink"
style={{height: "80%"}}
/>

</grid>

<grid item xs={12} sm={6} md={6}>

<card
title="Drop a sink"
content="If you no longer need to deliver data to a sink, you can drop the sink."
cloud="drop-a-sink"
style={{height: "80%"}}
/>
  
</grid>

</grid>
