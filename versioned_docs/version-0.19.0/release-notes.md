---
id: release-notes
title: Release notes
description: New features and important bug fixes in each release of RisingWave.
slug: /release-notes
---

This page summarizes changes in each version of RisingWave, including new features and important bug fixes.

## v0.19.1

This version was released on June 8, 2023.

### Main changes

Bug fixes and improvements. See [all changes](https://github.com/risingwavelabs/risingwave/compare/v0.19.0...v0.19.1).

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v0.19.1 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v0.19.1/risingwave-v0.19.1-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.19.1.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.19.1.tar.gz)

## v0.19.0

This version was released on June 1, 2023.

### Main changes

#### Installation

- Now, you can easily install RisingWave on your local machine with Homebrew by running  `brew install risingwave`. See [Run RisingWave](/get-started.md).

#### Administration

- Adds the `pg_indexes` and `dattablespace` system catalogs. [#9844](https://github.com/risingwavelabs/risingwave/pull/9844), [#9822](https://github.com/risingwavelabs/risingwave/pull/9822)
- Now, the `SHOW PARAMETERS` command will display the mutability of each system parameter. [#9526](https://github.com/risingwavelabs/risingwave/pull/9526)

#### SQL features

- Beta features: Adds support for 256-bit integer. [#9146](https://github.com/risingwavelabs/risingwave/pull/9146), [#9184](https://github.com/risingwavelabs/risingwave/pull/9184), [#9186](https://github.com/risingwavelabs/risingwave/pull/9186), [#9191](https://github.com/risingwavelabs/risingwave/pull/9191), [#9217](https://github.com/risingwavelabs/risingwave/pull/9217)
- Indexes can be created on expressions. [#9142](https://github.com/risingwavelabs/risingwave/pull/9142)
- Adds support for expressions in aggregate function arguments. [#9955](https://github.com/risingwavelabs/risingwave/pull/9955)
- Adds support for `VALUES` clause. [#8751](https://github.com/risingwavelabs/risingwave/pull/8751)
- Adds support for generated columns, which are special columns computed from other columns in a table or source. [#8700](https://github.com/risingwavelabs/risingwave/pull/8700), [#9580](https://github.com/risingwavelabs/risingwave/pull/9580)
- Adds support for using expressions in the `ORDER BY` and `PARTITION BY` clauses. [#9827](https://github.com/risingwavelabs/risingwave/pull/9827)
- New SQL commands
  - `CREATE CONNECTION` and `SHOW CONNECTIONS`: Creates an AWS PrivateLink connection and show all available connections. [#8907](https://github.com/risingwavelabs/risingwave/pull/8907)
  - `DROP CONNECTION`: Drops a connection. [#9128](https://github.com/risingwavelabs/risingwave/pull/9128)
  - `SHOW FUNCTIONS`: Shows existing user-defined functions. [#9398](https://github.com/risingwavelabs/risingwave/pull/9398)
  - `DROP FUNCTIONS`: Drops a user-defined function. [#9561](https://github.com/risingwavelabs/risingwave/pull/9561)
  - `SHOW CREATE SOURCE` and `SHOW CREATE SINK`: Shows the SQL statement used to create a source or sink. [#9083](https://github.com/risingwavelabs/risingwave/pull/9083)
  - `SHOW INDEXES`: Shows all indexes on a particular table. [#9835](https://github.com/risingwavelabs/risingwave/pull/9835)
- SQL functions
  - Adds support for trigonometric functions. [#8838](https://github.com/risingwavelabs/risingwave/pull/8838), [#8918](https://github.com/risingwavelabs/risingwave/pull/8918), [#9064](https://github.com/risingwavelabs/risingwave/pull/9064), [#9203](https://github.com/risingwavelabs/risingwave/pull/9203), [#9259](https://github.com/risingwavelabs/risingwave/pull/9259)
  - Adds support for degrees and radians functions. [#9108](https://github.com/risingwavelabs/risingwave/pull/9108)
  - Adds support for the `lag()` and `lead()` window functions and the `OVER()` and  `EMIT ON WINDOW CLOSE` clause. [#9597](https://github.com/risingwavelabs/risingwave/pull/9597), [#9622](https://github.com/risingwavelabs/risingwave/pull/9622), [#9701](https://github.com/risingwavelabs/risingwave/pull/9701)
  - Adds support for new aggregate functions, including `bool_and`, `bool_or`, `jsonb_agg`, and `jsonb_object_agg`. [#9452](https://github.com/risingwavelabs/risingwave/pull/9452)
  - Adds support for `max()`, `min()`, and `count()` for timestamptz data. [#9165](https://github.com/risingwavelabs/risingwave/pull/9165)
  - Adds support for microseconds and milliseconds for `to_char()` and `to_timestamp()`. [#9257](https://github.com/risingwavelabs/risingwave/pull/9257)
  - Adds support for multibyte Unicode in `overlay()` and `ascii()` functions. [#9321](https://github.com/risingwavelabs/risingwave/pull/9321)
  - Adds support for the `string_to_array()`  function. [#9289](https://github.com/risingwavelabs/risingwave/pull/9289)
  - Adds support for `array_positions()`. [#9152](https://github.com/risingwavelabs/risingwave/pull/9152)
  - Adds support for `cardinality()`. [#8867](https://github.com/risingwavelabs/risingwave/pull/8867)
  - Adds support for `array_remove()`. [#9116](https://github.com/risingwavelabs/risingwave/pull/9116)
  - Adds support for `trim_array()`. [#9265](https://github.com/risingwavelabs/risingwave/pull/9265)
  - Adds support for array range access. [#9362](https://github.com/risingwavelabs/risingwave/pull/9362)
  - Adds support for JSONB in UDF. [#9103](https://github.com/risingwavelabs/risingwave/pull/9103)
  - Adds support for `btrim()` and updates `trim()` to PostgreSQL standard syntax. [#8985](https://github.com/risingwavelabs/risingwave/pull/8985)
  - Adds support for `date_part()`. [#8830](https://github.com/risingwavelabs/risingwave/pull/8830)
  - Expands `extract()` with more fields. [#8830](https://github.com/risingwavelabs/risingwave/pull/8830)
  - Adds support for `proctime()`, which returns the system time with time zone when a record is processed. [#9088](https://github.com/risingwavelabs/risingwave/pull/9088)
  - Adds support for  `translate()`, `@()`, and `ceiling()`. [#8998](https://github.com/risingwavelabs/risingwave/pull/8998)
  - Adds support for `encode()` and `decode()`. [#9351](https://github.com/risingwavelabs/risingwave/pull/9351)
  - Adds support for the `intersect` operator. [#9573](https://github.com/risingwavelabs/risingwave/pull/9573)
  - Adds support for the default escape `\` in a `like` expression. [#9624](https://github.com/risingwavelabs/risingwave/pull/9624)
  - Adds support for the `IS [NOT] UNKNOWN` comparison predicate. [#9965](https://github.com/risingwavelabs/risingwave/pull/9965)
  - Adds support for the `starts_with()` string function and `^@`. [#9967](https://github.com/risingwavelabs/risingwave/pull/9967)
  - Adds support for unary `trunc`, `ln`, `log10` (`log`), `exp`, `cbrt` (`||/`) mathematical functions. [#9991](https://github.com/risingwavelabs/risingwave/pull/9991)

#### Connectors

- Adds support for ingesting CDC data from TiDB and sinking data to TiDB with the JDBC connector. [#8708](https://github.com/risingwavelabs/risingwave/pull/8708)
- Adds support for ingesting CDC data from Citus. [#8988](https://github.com/risingwavelabs/risingwave/pull/8988)
- Adds support for loading Pulsar secret key file from AWS S3. [#8428](https://github.com/risingwavelabs/risingwave/pull/8428), [#8222](https://github.com/risingwavelabs/risingwave/pull/8222)
- Adds support for using an established AWS PrivateLink connection in a `CREATE SOURCE`,  `CREATE TABLE`, or `CREATE SINK` statement for a Kafka source/sink. [#9119](https://github.com/risingwavelabs/risingwave/pull/9119), [#9128](https://github.com/risingwavelabs/risingwave/pull/9128), [#9728](https://github.com/risingwavelabs/risingwave/pull/9728), [#9263](https://github.com/risingwavelabs/risingwave/pull/9263)
- Deprecates the `use_transaction` field in the Kafka sink connector. [#9207](https://github.com/risingwavelabs/risingwave/pull/9207)
- Adds support for zstd compression type for Kafka connector. [#9297](https://github.com/risingwavelabs/risingwave/pull/9297)
- Deprecates the `upsert` property in the Kafka connector as it can be inferred from the row format. [#9457](https://github.com/risingwavelabs/risingwave/pull/9457)
- Adds a new field `properties.sync.call.timeout` in the WITH clause of the Kafka source connector to control the timeout. [#9005](https://github.com/risingwavelabs/risingwave/pull/9005)
- Adds support for a new row format `DEBEZIUM_MONGO_JSON` in the Kafka source connector. [#9250](https://github.com/risingwavelabs/risingwave/pull/9250)
- Adds CSV format support for the Kafka source connector. [#9875](https://github.com/risingwavelabs/risingwave/pull/9875)

#### Cluster configuration changes

- `--data_directory`and `--state_store`must be specified on CLI of the meta node, or the cluster will fail to start. [#9170](https://github.com/risingwavelabs/risingwave/pull/9170)
- Clusters will refuse to start if the specified object store URL identified by `state_store` and `data_directory` is occupied by another instance. Do not share the object store URL between multiple clusters. [#9642](https://github.com/risingwavelabs/risingwave/pull/9642)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v0.19.0 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v0.19.0/risingwave-v0.19.0-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.19.0.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.19.0.tar.gz)

## v0.18.0

This version was released on March 31, 2023.

Starting from this version, we’ll respect semantic versioning conventions by using the middle number (`y` , instead of `z,` in `x.y.z`) to indicate minor versions. That is why this is `v0.18.0`, not `v0.1.18`.

### Main changes

#### Administration and troubleshooting

- Improves error messages by including the location of the statement in question. [#8646](https://github.com/risingwavelabs/risingwave/pull/8646)
- Initial values of immutable system parameters can be specified via the meta-node command line. The initial values provided in the configuration file will be ignored. [#8366](https://github.com/risingwavelabs/risingwave/pull/8366)

#### SQL features

- Adds initial support for user-defined functions. [#8597](https://github.com/risingwavelabs/risingwave/pull/8597) [#8644](https://github.com/risingwavelabs/risingwave/pull/8644) [#8255](https://github.com/risingwavelabs/risingwave/pull/8255) [#7943](https://github.com/risingwavelabs/risingwave/pull/7943)
- Adds support for JSONB data type. [#8256](https://github.com/risingwavelabs/risingwave/pull/8256) [#8181](https://github.com/risingwavelabs/risingwave/pull/8181)
- Adds support for `NULLS { FIRST | LAST }` in `ORDER BY` clauses. [#8485](https://github.com/risingwavelabs/risingwave/pull/8485)
- New commands:
  - `ALTER SOURCE RENAME TO` [#8778](https://github.com/risingwavelabs/risingwave/pull/8778)
  - `SET TIME ZONE` [#8572](https://github.com/risingwavelabs/risingwave/pull/8572)
  - `ALTER RELATION RENAME` [#7745](https://github.com/risingwavelabs/risingwave/pull/7745)
  - `ALTER TABLE ADD/DROP COLUMN` for regular tables (without connector settings). [#8394](https://github.com/risingwavelabs/risingwave/pull/8394)
- New functions:
  - `array_length` : Returns the length of an array. [#8636](https://github.com/risingwavelabs/risingwave/pull/8636)
  - String functions implemented with the help of ChatGPT.  [#8767](https://github.com/risingwavelabs/risingwave/pull/8767) [#8839](https://github.com/risingwavelabs/risingwave/pull/8839)
    - `chr(integer)` -> `varchar`
    - `starts_with(varchar, varchar)` -> `boolean`
    - `initcap(varchar)` -> `varchar`
    - `lpad(varchar, integer)` -> `varchar`
    - `lpad(varchar, integer, varchar)` -> `varchar`
    - `rpad(varchar, integer)` -> varchar
    - `rpad(varchar, integer, varchar)` -> `varchar`
    - `reverse(varchar)` -> `varchar`
    - `strpos(varchar, varchar)` -> `integer`
    - `to_ascii(varchar)` -> `varchar`
    - `to_hex(integer)` -> `varchar`
    - `to_hex(bigint)` -> `varchar`)
  - Improves the data type values of columns returned by `DESCRIBE` . [#8819](https://github.com/risingwavelabs/risingwave/pull/8819)
  - `UPDATE` commands cannot update primary key columns. [#8569](https://github.com/risingwavelabs/risingwave/pull/8569)
  - Adds support for microsecond precision for intervals. [#8501](https://github.com/risingwavelabs/risingwave/pull/8501)
  - Adds an optional parameter `offset` to `tumble()` and `hop()` functions. [#8490](https://github.com/risingwavelabs/risingwave/pull/8490)
  - Data records that has null time values will be ignored by time window functions. [#8146](https://github.com/risingwavelabs/risingwave/pull/8146)
  - Improves the behaviors of the  `exp` operator when the operand is too large or small. [#8309](https://github.com/risingwavelabs/risingwave/pull/8309)
  - Supports process time temporal join, which enables the joining of an append-only stream (such as Kafka) with a temporal table (e.g. a materialized view backed by MySQL CDC). This feature ensures that any updates made to the temporal table will not affect previous results obtained from the temporal join. Supports `FOR SYSTEM_TIME AS OF NOW()` syntax to express process time temporal join. [#8480](https://github.com/risingwavelabs/risingwave/pull/8480)

#### Connectors

- Adds a new field `basetime` to the load generator connector for generating timestamp data. The load generator will take this field as `now` and generates data accordingly. [#8619](https://github.com/risingwavelabs/risingwave/pull/8619)
- Empty cells in CSV are now parsed as null. [#8709](https://github.com/risingwavelabs/risingwave/pull/8709)
- Adds the Iceberg connector. [#8508](https://github.com/risingwavelabs/risingwave/pull/8508)
- Adds support for the upsert type to the Kafka sink connector. [#8168](https://github.com/risingwavelabs/risingwave/pull/8168)
- Removes the message name parameter for Avro data. [#8124](https://github.com/risingwavelabs/risingwave/pull/8124)
- Adds support for AWS PrivateLink for Kafka source connector. [#8247](https://github.com/risingwavelabs/risingwave/pull/8247)

**Full Changelog**: https://github.com/risingwavelabs/risingwave/compare/v0.1.17...v0.18.0

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v0.18.0 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v0.18.0/risingwave-v0.18.0-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.18.0.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.18.0.tar.gz)

## v0.1.17

This version was released on February 28, 2023

### Main changes

#### Administration

- Adds a system catalog view `rw_catalog.rw_ddl_progress`, with which users can view the progress of a `CREATE INDEX`, `CREATE SINK`, or `CREATE MATERIALIZED VIEW` statement. [#7914](https://github.com/risingwavelabs/risingwave/pull/7914)
- Adds the `pg_conversion` and `pg_enum` system catalogs. [#7964](https://github.com/risingwavelabs/risingwave/pull/7964), [#7706](https://github.com/risingwavelabs/risingwave/pull/7706)

#### SQL features

- Adds the `exp()` function. [#7971](https://github.com/risingwavelabs/risingwave/pull/7971)
- Adds the `pow()` function. [#7789](https://github.com/risingwavelabs/risingwave/pull/7789)
- Adds support for displaying primary keys in `EXPLAIN` statements. [#7590](https://github.com/risingwavelabs/risingwave/pull/7590)
- Adds support for descending order in `CREATE INDEX` statements. [#7822](https://github.com/risingwavelabs/risingwave/pull/7822)
- Adds `SHOW PARAMETERS` and `ALTER SYSTEM` commands to display and update system parameters. [#7882](https://github.com/risingwavelabs/risingwave/pull/7882), [#7913](https://github.com/risingwavelabs/risingwave/pull/7913)

#### Connectors

- Adds a new parameter `match_pattern` to the S3 connector. With the new parameter, users can specify the pattern to filter files that they want to ingest from S3 buckets. For documentation updates, see [Ingest data from S3 buckets](/create-source/create-source-s3.md). [#7565](https://github.com/risingwavelabs/risingwave/pull/7565)
- Adds the PostgreSQL CDC connector. Users can use this connector to ingest data and CDC events from PostgreSQL directly. For documentation updates, see [Ingest data from PostgreSQL CDC](/guides/ingest-from-postgres-cdc.md). [#6869](https://github.com/risingwavelabs/risingwave/pull/6869), [#7133](https://github.com/risingwavelabs/risingwave/pull/7133)
- Adds the MySQL CDC connector. Users can use this connector to ingest data and CDC events from MySQL directly. For documentation updates, see [Ingest data from MySQL CDC](/guides/ingest-from-mysql-cdc.md). [#6689](https://github.com/risingwavelabs/risingwave/pull/6689), [#6345](https://github.com/risingwavelabs/risingwave/pull/6345), [#6481](https://github.com/risingwavelabs/risingwave/pull/6481), [#7133](https://github.com/risingwavelabs/risingwave/pull/7133)
- Adds the JDBC sink connector, with which users can sink data to MySQL, PostgreSQL, or other databases that are compliant with JDBC. [#6493](https://github.com/risingwavelabs/risingwave/pull/6493)
- Add new parameters to the Kafka sink connector.
  - `force_append_only` : Specifies whether to force a sink to be append-only. [#7922](https://github.com/risingwavelabs/risingwave/pull/7922)
  - `use_transaction` : Specifies whether to enable Kafka transactions or not. [#7500](https://github.com/risingwavelabs/risingwave/pull/7500)
  - SSL/SASL parameters: Specifies SSL encryption and SASL authentication settings. [#7540](https://github.com/risingwavelabs/risingwave/pull/7540)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v0.1.17 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v0.1.17/risingwave-v0.1.17-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.17.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.17.tar.gz)

## v0.1.16

This version was released on February 1, 2023.

### Main changes

#### Administration

- Adds support for aborting a query in local mode with `Ctrl + C`. [#7444](https://github.com/risingwavelabs/risingwave/pull/7444)

#### SQL features

- Adds support for the `to_timestamp` function. [#7060](https://github.com/risingwavelabs/risingwave/pull/7060)
- Adds support for the `RETURNING` clause in DML statements. [#7094](https://github.com/risingwavelabs/risingwave/pull/7094)
- Breaking change: Deprecates `CREATE MATERIALIZED SOURCE` . To create a materialized source, create a table and include the newly added connector settings. [#7281](https://github.com/risingwavelabs/risingwave/pull/7281), [#7110](https://github.com/risingwavelabs/risingwave/pull/7110)
- Adds support for the `c` and `i` flags in `regex_match()` and `regex_matches()` functions. [#7135](https://github.com/risingwavelabs/risingwave/pull/7135)
- Adds support for `SHOW CREATE TABLE` . You can use this statement to show the definition of a table. [#7152](https://github.com/risingwavelabs/risingwave/pull/7152)
- Adds support for the `pg_stat_activity` system catalog and several system functions. [#7274](https://github.com/risingwavelabs/risingwave/pull/7274)
- Adds the `_rw_kafka_timestamp` parameter to show the timestamps of Kafka messages. Users can now specify the scope of Kafka messages by timestamps. [#7275](https://github.com/risingwavelabs/risingwave/pull/7275), [#7150](https://github.com/risingwavelabs/risingwave/pull/7150)
- Adds support for displaying PostgreSQL and RisingWave versions in `version()`. [#7314](https://github.com/risingwavelabs/risingwave/pull/7314)
- Adds support for displaying internal tables using the `SHOW INTERNAL TABLES` statement. [#7348](https://github.com/risingwavelabs/risingwave/pull/7348)
- Adds support for `SET VISIBILITY_MODE` You can use this session variable to configure whether only checkpoint data is readable for batch query. [#5850](https://github.com/risingwavelabs/risingwave/pull/5850)
- Adds support for `SET STREAMING_PARALLELISM` . You can use this session variable to configure parallelism for streaming queries. [#7370](https://github.com/risingwavelabs/risingwave/pull/7370)

#### Connectors

- Adds support for generating array and struct data using the datagen connector. [#7099](https://github.com/risingwavelabs/risingwave/pull/7099)
- Adds the S3 source connector, with which users can ingest data in CSV format from S3 locations. For data ingestion from files, CSV is the only supported format and the files must be placed on S3. [#6846](https://github.com/risingwavelabs/risingwave/pull/6846)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v0.1.16 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v0.1.16/risingwave-v0.1.16-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.16.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.16.tar.gz)

## v0.1.15

This version was released on January 4, 2023.

### Main changes

#### Installation and deployment

- Parallelism and available memory of compute nodes are now command-line arguments and removed from the configuration file.  [#6767](https://github.com/risingwavelabs/risingwave/pull/6767)
- The default barrier interval is set to 1 second. [#6553](https://github.com/risingwavelabs/risingwave/pull/6553)
- Adds support for meta store backup and recovery. [#6737](https://github.com/risingwavelabs/risingwave/pull/6737)

#### SQL features

- Adds support for `SHOW CREATE MATERIALIZED VIEW` and `SHOW CREATE VIEW` to show how materialized and non-materialized views are defined. [#6921](https://github.com/risingwavelabs/risingwave/pull/6921)
- Adds support for `CREATE TABLE IF NOT EXISTS`. [#6643](https://github.com/risingwavelabs/risingwave/pull/6643)
- A sink can be created from a SELECT query. [#6648](https://github.com/risingwavelabs/risingwave/pull/6648)
- Adds support for struct casting and comparison. [#6552](https://github.com/risingwavelabs/risingwave/pull/6552)
- Adds pg_catalog views and system functions. [#6982](https://github.com/risingwavelabs/risingwave/pull/6982)
- Adds support for `CREATE TABLE AS`. [#6798](https://github.com/risingwavelabs/risingwave/pull/6798)
- Ads the initial support for batch query on Kafka source. [#6474](https://github.com/risingwavelabs/risingwave/pull/6474)
- Adds support for `SET QUERY_EPOCH` to query historical data based on meta backup. [#6840](https://github.com/risingwavelabs/risingwave/pull/6840)

#### Connectors

- Improves the handling of schema errors for Avro and Protobuf data. [#6821](https://github.com/risingwavelabs/risingwave/pull/6821)
- Adds two options to the datagen connector to make it possible to generate increasing timestamp values. [#6591](https://github.com/risingwavelabs/risingwave/pull/6591)

#### Observability

- Adds metrics for the backup manager in Grafana. [#6898](https://github.com/risingwavelabs/risingwave/pull/6898)
- RisingWave Dashboard can now fetch data from Prometheus and visualize it in charts. [#6602](https://github.com/risingwavelabs/risingwave/pull/6602)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v0.1.15 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v0.1.15/risingwave-v0.1.15-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.15.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.15.tar.gz)

## v0.1.14

This version was released on December 1, 2022.

### Main changes

#### SQL features

- `PRIMARY KEY` constraint checks can be performed on materialized sources and tables but not on non-materialized sources. For tables or materialized sources that enabled `PRIMARY KEY` constraints, if you insert data to an existing key, the new data will overwrite the old data. [#6320](https://github.com/risingwavelabs/risingwave/pull/6320) [#6435](https://github.com/risingwavelabs/risingwave/pull/6435)
- Adds support for timestamp with time zone data type. You can use this data type in time window functions, and convert between it and timestamp (without time zone). [#5855](https://github.com/risingwavelabs/risingwave/pull/5855) [#5910](https://github.com/risingwavelabs/risingwave/pull/5910) [#5968](https://github.com/risingwavelabs/risingwave/pull/5968)
- Adds support for `UNION` and `UNION ALL` operators. [#6363](https://github.com/risingwavelabs/risingwave/pull/6363) [#6397](https://github.com/risingwavelabs/risingwave/pull/6397)
- Implements the `rank()` function to support a different mode of Top-N queries. [#6383](https://github.com/risingwavelabs/risingwave/pull/6383)
- Adds support for logical views (`CREATE VIEW`). [#6023](https://github.com/risingwavelabs/risingwave/pull/6023)
- Adds the `data_trunc()` function. [#6365](https://github.com/risingwavelabs/risingwave/pull/6365)
- Adds the system catalog schema. [#6227](https://github.com/risingwavelabs/risingwave/pull/6227)
- Displays error messages when users enter conflicting or redundant command options. [#5933](https://github.com/risingwavelabs/risingwave/pull/5933/)

#### Connectors

- Adds support for the Maxwell Change Data Capture (CDC) format. [#6057](https://github.com/risingwavelabs/risingwave/pull/6057)
- Protobuf schema files can be loaded from Web locations in `s3://`, `http://`, or `https://` formats. [#6114](https://github.com/risingwavelabs/risingwave/pull/6114) [#5964](https://github.com/risingwavelabs/risingwave/pull/5964)
- Adds support for Confluent Schema Registry for Kafka data in Avro and Protobuf formats. [#6289](https://github.com/risingwavelabs/risingwave/pull/6289)
- Adds two options to the Kinesis connector. Users can specify the startup mode and optionally the sequence number to start with. [#6317](https://github.com/risingwavelabs/risingwave/pull/6317)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v0.1.14 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v0.1.14/risingwave-v0.1.14-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.14.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.14.tar.gz)

## v0.1.13

This version was released on October 17, 2022.

### Main changes

#### SQL features

- SQL commands:
  - Improves the formatting of response messages of `EXPLAIN` statements. [#5541](https://github.com/risingwavelabs/risingwave/pull/5541)

- SQL functions:
  - `to_char()` now supports specifying output format in lowercase. [#5032](https://github.com/risingwavelabs/risingwave/pull/5032)<br/>

        `to_char(timestamp '2006-01-02 15:04:05', 'yyyy-mm-dd hh24:mi:ss')` → `2006-01-02 15:04:05`

  - `generate_series` now supports negative steps. [#5231](https://github.com/risingwavelabs/risingwave/pull/5231)<br/>

        ```sql
        SELECT * FROM generate_series(5,1,-2);
        generate_series 
        -----------------
                       5
                       3
                       1
        (3 rows)
        ```

  - Adds support for sum/min/max functions over interval-type data. [#5105](https://github.com/risingwavelabs/risingwave/pull/5105), [#5549](https://github.com/risingwavelabs/risingwave/pull/5549)
  - Adds support for array concatenation. [#5060](https://github.com/risingwavelabs/risingwave/pull/5060), [#5345](https://github.com/risingwavelabs/risingwave/pull/5345)
  - Adds support for specifying empty arrays. [#5402](https://github.com/risingwavelabs/risingwave/pull/5402)
  - Casting from array to varchar is now supported. [#5081](https://github.com/risingwavelabs/risingwave/pull/5081)<br/>

        `array[1,2]::varchar` → `{1,2}`

  - Casting from varchar to integer allows leading and trailing spaces. [#5452](https://github.com/risingwavelabs/risingwave/pull/5452)<br/>

        `' 1 '::int` → `1`

- Adds new system catalog and psql meta-commands. [#5127](https://github.com/risingwavelabs/risingwave/pull/5127), [#5742](https://github.com/risingwavelabs/risingwave/pull/5742)
  - `\d`: Lists all relations in the current database. (Materialized) sources are not supported yet.
  - `\dt`: Lists all tables in the current database.
  - `\dm`: Lists all materialized views in the current database.
  - `\di`: Lists all indexes in the current database.
  - `pg_catalog.pg_index`: Contains information about indexes.

#### Connectors

- Nested columns are now supported for the datagen connector. [#5550](https://github.com/risingwavelabs/risingwave/pull/5550)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v0.1.13 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v0.1.13/risingwave-v0.1.13-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.13.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.13.tar.gz)

## v0.1.12

This version was released on September 7, 2022.

### Main changes

#### SQL features

- SQL commands:
  - `EXPLAIN` now supports specifying options. Supported options: `trace`, `verbose`, and `type`. Unlike PostgreSQL, each option should be separated by a comma and wrapped by parentheses as a whole. [#4730](https://github.com/risingwavelabs/risingwave/pull/4730)
  - Adds support for `ALTER USER`. [#4261](https://github.com/risingwavelabs/risingwave/pull/4261)
  - `CREATE/ALTER USER` now has new options `CREATEUSER` and `NOCREATEUSER`, which specify whether or not the user has the privilege to create, alter, or drop other users. [#4447](https://github.com/risingwavelabs/risingwave/pull/4447)
  - Adds support for EXPLAIN CREATE SINK. [#4430](https://github.com/risingwavelabs/risingwave/pull/4430)
- SQL functions:
  - Adds support for new system information functions: `current_schema`, `current_schema()`, and `session_user`. [#4358](https://github.com/risingwavelabs/risingwave/pull/4358)
- The `pg_namespace` catalog now has a new namespace column `nspacl` for storing access privileges. [#4326](https://github.com/risingwavelabs/risingwave/pull/4326)

#### Connectors

- Some connector parameters were renamed. The old parameter names are still functional but may be deprecated in the future. [#4503](https://github.com/risingwavelabs/risingwave/pull/4503)

  - Kafka & Redpanda
    - `kafka.brokers` -> `properties.bootstrap.server`
    - `kafka.topic` -> `topic`
    - `kafka.scan.startup.mode` -> `scan.starup.mode`
    - `kafka.time.offset` -> `scan.startup.timestamp_millis`
    - `kafka.consumer.group` -> `consumer.group.id`

  - Kinesis
    - `kinesis.stream.name` -> `stream`
    - `kinesis.stream.region` -> `aws.region`
    - `kinesis.endpoint` -> `endpoint`
    - `kinesis.credentials.access` -> `aws.credentials.access_key_id`
    - `kinesis.credentials.secret` -> `aws.credentials.secret_access_key`
    - `kinesis.credentials.session_token` -> `aws.credentials.session_token`
    - `kinesis.assumerole.arn` -> `aws.credentials.role.arn`
    - `kinesis.assumerole.external_id` -> `aws.credentials.role.external_id`
  - Pulsar
    - `pulsar.topic` -> `topic`
    - `pulsar.admin.url` -> `admin.url`
    - `pulsar.service.url` -> `service.url`
    - `pulsar.scan.startup.mode` -> `scan.startup.mode`
    - `pulsar.time.offset` -> `scan.startup.timestamp_millis`
- The row format name, `debezium json`, for CDC stream sources, has been renamed to `debezium_json`. [#4494](https://github.com/risingwavelabs/risingwave/pull/4494)

#### Configuration changes

- The default batch query execution mode was changed from distributed to local. [#4789](https://github.com/risingwavelabs/risingwave/pull/4789)

### Assets

- Run this version from Docker:
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 ghcr.io/risingwavelabs/risingwave:v0.1.12 playground`
- Prebuilt library for Linux is not available in this release.
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.12.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.12.tar.gz)

## v0.1.11

This version was released on July 29, 2022.

### Main changes

#### SQL features

- New SQL functions:
  - `overlay()`: Replaces a substring. [#3671](https://github.com/risingwavelabs/risingwave/pull/3671)
  - `generate_series()`: Generates a series of values from the starting point to the ending point. [#4030](https://github.com/risingwavelabs/risingwave/pull/4030)
  - `regexp_match()`, `regexp_matches()`: Compares a string against a regular expression pattern and returns matched substrings. [#3702](https://github.com/risingwavelabs/risingwave/pull/3702) [#4062](https://github.com/risingwavelabs/risingwave/pull/4062)
  - `string_agg ()`: Concatenates the values into a string. [#3952](https://github.com/risingwavelabs/risingwave/pull/3952) [#4183](https://github.com/risingwavelabs/risingwave/pull/4183)
  - `current_database()`: Returns the current database.  [#3650](https://github.com/risingwavelabs/risingwave/pull/3650)
- New SQL commands:
  - `SHOW ALL`: Lists all configuration parameters. Use `SHOW parameter` to show the value of a configuration parameter. [#3694](https://github.com/risingwavelabs/risingwave/pull/3694) [#3664](https://github.com/risingwavelabs/risingwave/pull/3664)
  - `CREATE SINK`: Sinks data to Kafka. [#3923](https://github.com/risingwavelabs/risingwave/pull/3923) [#3682](https://github.com/risingwavelabs/risingwave/pull/3682) [#3674](https://github.com/risingwavelabs/risingwave/pull/3674)
  - `EXPLAIN TRACE`: Traces each optimization stage of the optimizer. [#3945](https://github.com/risingwavelabs/risingwave/pull/3945)
- Support for lookup joins. Currently, lookup joins can only be performed in local query mode. To use lookup joins, users need to set the configuration parameter `rw_batch_enable_lookup_join`  to true.  [#3859](https://github.com/risingwavelabs/risingwave/pull/3859) [#3763](https://github.com/risingwavelabs/risingwave/pull/3763)
- An `ORDER BY` clause in the `CREATE MATERIALIZED VIEW` statement is allowed but not considered as part of the definition of the materialized view. It is only used in the initial creation of the materialized view. It is not used during refreshes. This is a behavior change due to the introduction of parallel table scans. [#3670](https://github.com/risingwavelabs/risingwave/pull/3670)
- Support for filter clauses on aggregate functions. [#4114](https://github.com/risingwavelabs/risingwave/pull/4114)

#### Connectors

- RisingWave can now sink data to Kafka topics in append-only mode and Debezium mode. [#3923](https://github.com/risingwavelabs/risingwave/pull/3923) [#3682](https://github.com/risingwavelabs/risingwave/pull/3682) [#3674](https://github.com/risingwavelabs/risingwave/pull/3674)
- Syntax change for `CREATE SOURCE`: A parameter name is no longer wrapped by single quotation marks. [#3997](https://github.com/risingwavelabs/risingwave/pull/3997). See the example:
  - Old: `CREATE SOURCE s1 WITH ( 'connector' = 'kafka', 'kafka.topic' = 'kafka_1_partition_topic', 'kafka.brokers' = '127.0.0.1:29092' ) ROW FORMAT json;`  
  - New: `CREATE SOURCE s WITH ( connector = 'kafka', kafka.topic = 'kafka_1_partition_topic', kafka.brokers = '127.0.0.1:29092' ) ROW FORMAT json;`

### Assets

- Run this version from Docker: <br/>`run -it --pull=always -p 4566:4566 -p 5691:5691 ghcr.io/risingwavelabs/risingwave:v0.1.11 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v0.1.11/risingwave-v0.1.11-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.11.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.11.tar.gz)

## v0.1.10

This version was released on July 5, 2022.

### Main changes

#### SQL features

##### SQL operators and functions

- Support string concatenation operator `||`. [#3147](https://github.com/risingwavelabs/risingwave/pull/3147)
- Support interval comparison. [#3222](https://github.com/risingwavelabs/risingwave/pull/3222)
- Support dividing intervals by integers, floats, or decimals. [#3441](https://github.com/risingwavelabs/risingwave/pull/3441)
- Intervals multiplying intervals by floats. [#3641](https://github.com/risingwavelabs/risingwave/pull/3641)
- Support more temporal operations. [#3472](https://github.com/risingwavelabs/risingwave/pull/3472)
- Support Common Table Expressions (CTEs) as input of time window functions. [#3188](https://github.com/risingwavelabs/risingwave/pull/3188)
- Add these new functions:
  - `concat()` for concatenating strings [#3091](https://github.com/risingwavelabs/risingwave/pull/3091)
  - `repeat()` for repeating string [#3148](https://github.com/risingwavelabs/risingwave/pull/3148)
  - `octet_length()` and bit_length() for getting string length [#3526](https://github.com/risingwavelabs/risingwave/pull/3526)
  - `Row()` for constructing rows [#2914](https://github.com/risingwavelabs/risingwave/pull/2914) [#3152](https://github.com/risingwavelabs/risingwave/pull/3152)
  - `pg_typeof()` for getting data types of values [#3494](https://github.com/risingwavelabs/risingwave/pull/3494)
  - `current_database()` for getting the name of the current database in the session [#3650](https://github.com/risingwavelabs/risingwave/pull/3650)
  - `approx_count_distinct()` for distinct counting [#3121](https://github.com/risingwavelabs/risingwave/pull/3121)
  - `unnest()` for expanding nested tables to rows [#3017](https://github.com/risingwavelabs/risingwave/pull/3017)
- Support `count()`, `min()`, and `max()` functions on these data types: *interval*, *timestamp*, *varchar*, and *date*. [#3069](https://github.com/risingwavelabs/risingwave/pull/3069)

##### SQL commands

- Support `EXPLAIN CREATE INDEX`. [#3229](https://github.com/risingwavelabs/risingwave/pull/3229)
- Add cascade and restrict options in `REVOKE` commands. [#3363](https://github.com/risingwavelabs/risingwave/pull/3363)
- Expand the `CREATE TABLE` syntax to support creating append-only tables. [#3058](https://github.com/risingwavelabs/risingwave/pull/3058)
- Support the `CREATE USER` command and user authentication. [#3074](https://github.com/risingwavelabs/risingwave/pull/3074)

##### Data types

- Support implicit casts from single-quoted literals. [#3487](https://github.com/risingwavelabs/risingwave/pull/3487)
- Add string as an alias for data type varchar.  [#3094](https://github.com/risingwavelabs/risingwave/pull/3094)
- Support string intervals.  [#3037](https://github.com/risingwavelabs/risingwave/pull/3037)

##### Database management

- Add the default super user “postgres”.  [#3127](https://github.com/risingwavelabs/risingwave/pull/3127)
- The default schema name is changed to “public” from “dev”.  [#3166](https://github.com/risingwavelabs/risingwave/pull/3166)

#### Connectors

- Add random seed for the Datagen Source Connector. [#3124](https://github.com/risingwavelabs/risingwave/pull/3124)

### Assets

- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v0.1.10/risingwave-v0.1.10-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.10.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v0.1.10.tar.gz)
