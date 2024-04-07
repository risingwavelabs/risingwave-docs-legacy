---
id: ad-hoc-queries
slug: /ad-hoc-queries
title: Ad-hoc queries
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ad-hoc-queries/" />
</head>

An ad-hoc query refers to a query that is created on-the-fly to fulfill immediate and specific information needs. Unlike predefined queries, ad-hoc queries are generated in real-time based on your current requirements. They are commonly used in data analysis, decision-making, and exploratory data tasks, where flexibility and quick access to information are crucial.

Similar to traditional databases, RisingWave stores data and allows users to perform ad-hoc queries on it. However, it is important to note that RisingWave does not persist data in a `source` object, and direct querying of a source is not supported.

| Features | Tables | Sources | Materialized Views |
| :: | :: | :: | :: |
| Support ad-hoc queries<br />(`select` statement)    | yes       | **no** | yes|
| Support streaming queries<br />(`create materialized view` statement)   | yes        | yes | yes|