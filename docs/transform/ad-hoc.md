---
id: ad-hoc-queries
slug: /ad-hoc-queries
title: Ad-hoc queries
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ad-hoc-queries/" />
</head>

An ad-hoc query is a query that is created on-the-fly to meet immediate and specific information needs. Unlike predefined queries, ad-hoc queries are generated in real-time based on the your current requirements. Ad-hoc queries are commonly used in data analysis, decision-making, and exploratory data tasks where flexibility and quick access to information are essential.

Like traditional databases, RisingWave can store data and allow users to perform ad-hoc queries on it. However, it's important to note that the _source_ in RisingWave does not persist data, and RisingWave does not support directly quering the _source_, unless it's from Kafka. The main reason relates to data ownership, data consistency, and performance issues.

| Functions | Tables | Sources | Materialized Views |
| :: | :: | :: | :: |
| Support ad-hoc queries<br />(`select` statement)    | yes       | **no** | yes|
| Support streaming queries<br />(`create materialized view` statement)   | yes        | yes | yes|