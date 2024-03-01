---
id: transform-overview
slug: /transform-overview
title: Overview
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/transform-overview/" />
</head>

Data transformation is a critical process in converting raw data into valuable insights. It involves applying various operations such as filtering, aggregating, and joining data to derive meaningful information. The "Transform & query data" part will dive into the techniques used in the process of transforming and querying data. Before that, here is a simple introduction to data transformation for you.

# How transformation is performed

 Data transformation is performed normally via a materialized view, but can also be done via a sink. Let's understand how transformation logic is expressed with simple examples. 
