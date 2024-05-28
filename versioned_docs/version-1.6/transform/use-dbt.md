---
id: use-dbt
slug: /use-dbt
title: Use dbt for data transformations
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/use-dbt/" />
</head>

This guide provides instructions for using dbt to manage real-time data transformations in RisingWave.

## Install the plugin

To use dbt to manage data in RisingWave, you need to install the [dbt-risingwave](https://github.com/risingwavelabs/dbt-risingwave) plugin.

As a prerequisite, you need to have Python3 installed in your environment.

Run the following command to install the plugin:

```bash
python3 -m pip install dbt-risingwave
```

After the plugin is installed, run the following command to ensure `risingwave` shows up under plugins.

```sql
dbt --version
```

If you see something like below, the plugin is successfully installed:

```bash
Plugins:
...
  - risingwave: 1.6.0 - Up to date!
...
```

## Initiate a dbt project

Before you initial a dbt project, you need to ensure that RisingWave is installed and running. To learn about how to install and run RisingWave, see the topics under *Get started*.

You can initiate a [dbt project](https://docs.getdbt.com/docs/build/projects) by running the following command.

```sql
dbt init 
```

It will ask you to enter a project name, choose the database you like to use (`risingwave`), and specify other database configurations such as hostname, port, user name, etc.

The default database configurations are:

- host: localhost
- port: 4566
- user: root
- database: dev

If you use different RisingWave configurations, please ensure that the configurations here match those in RisingWave.

## Define dbt models

The dbt models for managing data transformations in RisingWave are similar to typical dbt SQL models. The main differences are the materializations. We customized the materializations to fit the data processing model of RisingWave.

RisingWave accepts these [materializations](https://docs.getdbt.com/docs/build/materializations).

|Materializations| Notes|
|----|----|
|`table` |This materialization creates a table. To use this materialization, add `{{ config(materialized='table') }}` to your model SQL files. |
|`view`|Create a view. To use this materialization, add `{{ config(materialized='view') }}` to your model SQL files. |
|`ephemeral`|This materialization uses [common table expressions](/sql/query-syntax/query-syntax-with-clause.md) in RisingWave under the hood. To use this materialization, add `{{ config(materialized='ephemeral') }}` to your model SQL files.|
|`materializedview`| To be deprecated. It is available only for backward compatibility purposes. Use `materialized_view` instead.|
|`materialized_view`| Creates a [materialized view](/sql/commands/sql-create-mv.md). This materialization corresponds the `incremental` one in dbt. To use this materialization, add `{{ config(materialized='materialized_view') }}` to your model SQL files.|
| `incremental`|Use `materialized_view` instead. Since RisingWave is designed to use materialized view to manage data transformation in an incremental way, you can just use the `materialized_view` materilization.|
|`source`| Defines a source. To use this materialization, add `{{ config(materialized='source') }}` to your model SQL files. You need to provide your create source statement as a whole in this model. See [Example model files](#example-model-files) for details.|
|`table_with_connector`| Defines a table with connector settings. A table with connector settings is similar to a source. The difference is that a table object with connector settings persists raw streaming data in the source, while a source object does not. To use this materialization, add `{{ config(materialized='table_with_connector') }}` to your model SQL files. You need to provide your create table with connector statement as a whole in this model (see [Example model files](#example-model-files) for details). Because dbt table has its own semantics, RisingWave use `table_with_connector` to distinguish itself from a dbt table.|
|`sink`| Defines a sink. To use this materialization, add `{{ config(materialized='sink') }}` to your SQL files. You need to provide your create sink statement as a whole in this model. See [Example model files](#example-model-files) for details.|

To learn about how to define SQL models in general, see [SQL models](https://docs.getdbt.com/docs/build/sql-models).

To learn about how dbt works with RisingWave in practice, check out our [demo project](https://github.com/risingwavelabs/dbt_rw_nexmark), which uses dbt to manage Nexmark queries in RisingWave.

## Run dbt models

This step assumes that you have defined your dbt models.

Navigate to your project directory.

```sql
cd <your project name>
```

First, you can run `dbt debug` to check your connection to RisingWave.

```sql
dbt debug
```

If the connection is valid, you will see an "OK connection ok" message. In this case, you can run your models. Otherwise, please check `~/.dbt/profiles.yml` to ensure your connection configurations are valid.

Run the following command to run your models.

```sql
dbt run
```

## Example model files

```sql title="Define a source in dbt"
{{ config(materialized='source') }}
CREATE SOURCE {{ this }} (v1 int, v2 varchar) WITH (
  connector = 'kafka',
  topic = 'kafka_1_partition_topic',
  properties.bootstrap.server = 'message_queue:29092',
  scan.startup.mode = 'earliest'
) FORMAT PLAIN ENCODE JSON
```

```sql title="Define a table with connector settings in dbt"
{{ config(materialized='table_with_connector') }}
CREATE TABLE {{ this }} (v1 int, v2 varchar) WITH (
  connector = 'kafka',
  topic = 'kafka_1_partition_topic',
  properties.bootstrap.server = 'message_queue:29092',
  scan.startup.mode = 'earliest'
) FORMAT PLAIN ENCODE JSON
```

```sql title="Define a sink in dbt"
{{ config(materialized='sink') }}
CREATE SINK {{ this }} AS
SELECT
   avg(distance) as avg_distance,
   avg(duration) as avg_duration
FROM taxi_trips
WITH (
   connector='kafka',
   properties.bootstrap.server='localhost:9092',
   topic='test'
)
FORMAT PLAIN ENCODE JSON;
```

```sql title="Define a materialized view in dbt"
{{ config(materialized='materialized_view') }}
SELECT
    auction,
    to_char(date_time, 'YYYY-MM-DD') AS day,
    count(*) AS total_bids,
    count(*) filter (where price < 10000) AS rank1_bids,
    count(*) filter (where price >= 10000 and price < 1000000) AS rank2_bids,
    count(*) filter (where price >= 1000000) AS rank3_bids,
    min(price) AS min_price,
    max(price) AS max_price,
    avg(price) AS avg_price,
    sum(price) AS sum_price
FROM {{ ref('bid') }}
GROUP BY auction, to_char(date_time, 'YYYY-MM-DD')
```

```sql title="Define a table with indexes in dbt"
{{ config(
    materialized = 'table',
    indexes=[
      {'columns': ['c1']},
      {'columns': ['c2', 'c1']},
    ]
)}}
select 1 as c1, 1 c2 union select 2 as c1, 2 as c2
```

## Additional resources

For details about building and deploying dbt models in general, please refer to the [dbt documentation](https://docs.getdbt.com/docs/introduction).
