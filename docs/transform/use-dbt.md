---
id: use-dbt
slug: /use-dbt
title: Use dbt for data transformations
---

This document guides you to use dbt to manage your data transformations in RisingWave in real-time.

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
  - risingwave: 1.5.0 - Up to date!
...
```

## Initiate a dbt project

Before you initial a dbt project, you need to ensure that RisingWave is installed and running. To learn about how to install and run RisingWave, see the topics under *Run RisingWave*.

You can initiate a [dbt project](https://docs.getdbt.com/docs/build/projects) by running the following command.

```sql
dbt init 
```

It will ask you to enter a project name, choose the database you like to use (`risingwave`), and specify other database configurations such as host name, port, user name, etc.

The default database configurations are:

- host: localhost
- port: 4566
- user: root
- database: dev

If you use different RisingWave configurations, please ensure that the configurations here match those in RisingWave.

:::info

If you are familiar with dbt, you can directly clone [this repository](https://github.com/risingwavelabs/dbt_rw_nexmark) to get started. This repository provide a dbt project to manage nexmark queries in a materialized view way.

:::

## Define dbt models

The dbt models for managing data transformations in RisingWave is similar to typical dbt sql models. The main differences are the materializations. We customized the materializations to fit the data processing model of RisingWave.

RisingWave accepts these four [materializations](https://docs.getdbt.com/docs/build/materializations):

- `table`. Create a table. To use this materialization, add `{{ config(materialized='table') }}` to your model SQL files.
- `view`. Create a view. To use this materialization, add `{{ config(materialized='view') }}` to your model SQL files.
- `ephemeral`. Use Common Table Expression instead. To use this materialization, add `{{ config(materialized='ephemeral') }}` to your model SQL files.
- `materializedview`. Create a materialized view. This materialization is corresponding to the `incremental` one in dbt. Since RisingWave is designed to use materialized view to manage data transformation in an incremental way, you don’t need to use `incremental` models and can just use `materializedview`. To use this materialization, add `{{ config(materialized='materializedview') }}` to your model SQL files.

To learn about how to define SQL models in general, see [SQL models](https://docs.getdbt.com/docs/build/sql-models).

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

If the connection is valid, you will see a "OK connection ok" mesage. In this case, you can run your models. Otherwise, please check `~/.dbt/profiles.yml` to ensure your connection configurations are valid.

Run the following command to run your models.

```sql
dbt run
```

The `dbt run` command is one of the core commands in the dbt framework. It is used to execute a set of SQL queries that are defined in the `.sql` files in the project directory. These queries transform raw data from one or more sources into more useful and structured data tables that can be used for analysis. You can find your models in the `models` directory of your project. This command will create tables, views, or materialized views based on the models in your project!

## Example model file

Here is what is included in an example model file, `my_first_dbt_model.sql`:

```sql
{{ config(materialized='materializedview') }}

with source_data as (

    select 1 as id
    union all
    select null as id

)

select *
from source_data
```

## Additional reference

For details about building and deploying dbt models in general, plase refer to the [dbt documentation](https://docs.getdbt.com/docs/introduction).
