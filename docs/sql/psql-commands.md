---
id: psql-commands
slug: /psql-commands
title: Psql commands
---

## Supported psql commands

RisingWave supports the following psql commands:

|Command|Description|
|---|-------|
|\d|Lists all relations in the current database together with indexes (originally not supported in psql). Sources (including materialized sources) are not yet supported.|
|\dm|List all materialized views in the current database.|
|\dt|List all tables in the current database.|
|\q|Quit psql.|