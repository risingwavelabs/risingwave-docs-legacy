---
sidebar_position: 3
id: architecture
title: Architecture
slug: /architecture

---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/architecture/" />
</head>

The architecture of RisingWave is illustrated in the diagram below. It comprises three main components: a meta node, compute nodes, and compactor nodes.

The meta node takes charge of managing the metadata of compute and compactor nodes and orchestrating operations across the system.
The compute nodes are responsible for ingesting data from upstream systems, parsing and running SQL queries, and delivering data to downstream systems.
The compactor nodes handle data storage and retrieval from object storage. They also perform data compaction to optimize storage efficiency.

<img
  src={require('./images/rw_architecture.png').default}
  alt="RisingWave Architecture"
/>
