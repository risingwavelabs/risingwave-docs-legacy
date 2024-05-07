---
id: psql-commands
slug: /psql-commands
title: Psql commands
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/psql-commands/" />
</head>

RisingWave supports the following psql commands:

|Command|Description|
|---|-------|
|\d|Lists all relations in the current database. Sources (including materialized sources) are not yet supported.|
|\di|Lists all indexes in the current database.|
|\dm|Lists all materialized views in the current database.|
|\dt|Lists all tables in the current database.|
|\q|Quits psql.|