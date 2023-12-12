---
id: release-notes
title: Release notes
description: New features and important bug fixes in each release of RisingWave.
slug: /release-notes
---

# Release notes

This page summarizes changes in each version of RisingWave, including new features and important bug fixes.

## v1.5.0

This version was released on December 11, 2023.

### Main changes

#### SQL features

- SQL Commands:
  - Supports `SET SCHEMA` syntax for `ALTER {TABLE t | [MATERIALIZED] VIEW (m)v | SOURCE src | SINK sink | CONNECTION c | FUNCTION f( argument_type [, ...] )}`. [#13341](https://github.com/risingwavelabs/risingwave/pull/13341). See [SQL references](/docs/current/sql-references/).
  - Supports `OWNER TO` syntax for ALTER {`DATABASE | SCHEMA | TABLE | [MATERIALIZED] VIEW | SOURCE | SINK`}. [#13216](https://github.com/risingwavelabs/risingwave/pull/13216). See [SQL references](/docs/current/sql-references/).
  - Supports `RENAME TO` syntax for `ALTER { DATABASE db | SCHEMA s}`. [#13713](https://github.com/risingwavelabs/risingwave/pull/13713)
  - Supports `KILL` command. [#13434](https://github.com/risingwavelabs/risingwave/pull/13434)
  - Supports `SHOW PROCESSLIST` command. [#13287](https://github.com/risingwavelabs/risingwave/pull/13287). See [`SHOW PROCESSLIST` command](/docs/current/sql-show-processlist/).
  - Supports `SET TO DEFAULT` command. [#13693](https://github.com/risingwavelabs/risingwave/pull/13693). See [`SET` command](/docs/current/sql-set/).
  - Supports `SHOW COLUMNS` and `DESCRIBE` from sinks and views. [#13626](https://github.com/risingwavelabs/risingwave/pull/13626). See [`SHOW COLUMNS`](/docs/current/sql-show-columns/) and [`DESCRIBE`](/docs/current/sql-describe/) command. 
- SQL functions & operators
  - Supports list and struct types for `jsonb_agg` and `jsonb_object_agg`. [#13299](https://github.com/risingwavelabs/risingwave/pull/13299). See [JSON functions operators](/docs/current/sql-function-json).
  - Supports `jsonb_build_array` and `jsonb_build_object`. [#13198](https://github.com/risingwavelabs/risingwave/pull/13198). See [JSON functions operators](/docs/current/sql-function-json).
  - Supports `to_jsonb`. [#13161](https://github.com/risingwavelabs/risingwave/pull/13161). See [JSON functions and operators](/docs/current/sql-function-json).
  - Supports JSON path operators and functions. [#13568](https://github.com/risingwavelabs/risingwave/pull/13568). See [JSON functions and operators](/docs/current/sql-function-json).
  - Supports array operators `@>` and `<@`. [#13253](https://github.com/risingwavelabs/risingwave/pull/13253). See [Array functions and operators](/docs/current/sql-function-array).
- System catalog
  - Adds columns `rw_version`, `total_memory_bytes`, `total_cpu_cores`, and `started_at`, and all nodes in system table `rw_worker_nodes`. [#13487](https://github.com/risingwavelabs/risingwave/pull/13487).
  - Adds system table `rw_internal_tables`. [#13272](https://github.com/risingwavelabs/risingwave/pull/13272). See [RisingWave catalogs](/docs/current/rw_catalog/).
  - Supports sink columns in `rw_columns` and `information_schema.columns`. [#13626](https://github.com/risingwavelabs/risingwave/pull/13626). See [Information schema](/docs/current/information-schema/) and [RisingWave catalogs](/docs/current/rw_catalog/).

### Sources & sink

- The load generator can generate `timestamptz` columns. [#13451](https://github.com/risingwavelabs/risingwave/pull/13451). See [Generate test data](/docs/current/ingest-from-datagen/).
- Adds option `[properties.fetch.queue.backoff.ms](http://properties.fetch.queue.backoff.ms)` for Kafka source. [#13321](https://github.com/risingwavelabs/risingwave/pull/13321). See [Ingest data from Kafka](/docs/current/ingest-from-kafka/).
- Supports creating multiple CDC tables that share the same source, which allows for incremental and lock-free snapshot loading. [#12535](https://github.com/risingwavelabs/risingwave/pull/12535). See [Ingest data from MySQL CDC](/docs/current/ingest-from-mysql-cdc/).
- `CREATE SINK` statements no longer need to wait for backfill to complete. [#13665](https://github.com/risingwavelabs/risingwave/pull/13665)

### Deployment

- Adds a docker-compose file for standalone mode. [#13233](https://github.com/risingwavelabs/risingwave/pull/13233). See [Start RisingWave using Docker Compose](/docs/current/risingwave-docker-compose/).

### Cluster configuration changes

- Adds support for system parameter `pause_on_next_bootstrap`. [#11936](https://github.com/risingwavelabs/risingwave/pull/11936)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v1.5.0 playground`
- [Prebuilt all-in-one library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v1.5.0/risingwave-v1.5.0-x86_64-unknown-linux-all-in-one.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.5.0.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.5.0.tar.gz)
- [risectl-v1.5.0-x86_64-unknown-linux.tar.gz](https://github.com/risingwavelabs/risingwave/releases/download/v1.5.0/risectl-v1.5.0-x86_64-unknown-linux.tar.gz)

See the **Full Changelog** [here](https://github.com/risingwavelabs/risingwave/compare/v1.4-rc...v1.5.0-rc).

## v1.4.0

This version was released on November 10, 2023.

### Main changes

#### SQL features

- Query syntax:
  - Supports using subqueries in `UPDATE` and `DELETE` statements. [#12995](https://github.com/risingwavelabs/risingwave/pull/12995)
- SQL commands
  - Supports `COMMENT ON` clause for tables and columns. [#12849](https://github.com/risingwavelabs/risingwave/pull/12849). See [`COMMENT ON` command](/docs/1.4/sql-comment-on/).
  - Supports persistent background materialized views. [#12167](https://github.com/risingwavelabs/risingwave/pull/12167). See [SET BACKGROUND_DDL](/docs/1.4/sql-set-background-ddl).
  - Supports exposing hidden columns and distribution keys when using `SHOW COLUMNS FROM` command. [#12839](https://github.com/risingwavelabs/risingwave/pull/12839)
  - Supports exposing hidden columns when using `DESCRIBE` command. [#12839](https://github.com/risingwavelabs/risingwave/pull/12839)
- SQL functions & operators:
  - Supports `substring` and `substr` functions for `bytea` data type. [#13088](https://github.com/risingwavelabs/risingwave/pull/13088). See [String functions and operators](/docs/1.4/sql-function-string/#substrsubstring). See [Binary string functions and operators](/docs/1.4/sql-function-binarystring/#substr).
  - Supports functions `jsonb_pretty`,  `jsonb_object`, `jsonb_strip_nulls`, and `jsonb_extract_path`. [#13050](https://github.com/risingwavelabs/risingwave/pull/13050), [#13036](https://github.com/risingwavelabs/risingwave/pull/13036), [#13169](https://github.com/risingwavelabs/risingwave/pull/13169), [#13143](https://github.com/risingwavelabs/risingwave/pull/13143). See [JSON functions](/docs/1.4/sql-function-json/#json-functions).
  - Supports jsonb `@>`, `<@`, `?`, `?|, ?&`, `#>`,  `#>>`, `-` and `#-` operators.  [#13056](https://github.com/risingwavelabs/risingwave/pull/13056), [#13110](https://github.com/risingwavelabs/risingwave/pull/13110), [#13118](https://github.com/risingwavelabs/risingwave/pull/13118). See [JSON operators](/docs/1.4/sql-function-json/#json-operators).
  - Supports `greatest` and `least` functions. [#12838](https://github.com/risingwavelabs/risingwave/pull/12838). See [Conditional expressions](/docs/1.4/sql-function-conditional/#greatest).
  - Supports `regexp_split_to_array` function. [#12844](https://github.com/risingwavelabs/risingwave/pull/12844). See [String functions and operators](/docs/1.4/sql-function-string/#regexp_split_to_array).
  - Supports `bit_and` and `bit_or` aggregate functions in materialized views. [#12758](https://github.com/risingwavelabs/risingwave/pull/12758). See [Aggregate functions](/docs/1.4/sql-function-aggregate/#bit_and).
  - Supports `jsonb_agg` and `jsonb_object_agg` in streaming mode. [#12836](https://github.com/risingwavelabs/risingwave/pull/12836). See [Aggregate functions](/docs/1.4/sql-function-aggregate/#jsonb_agg).
  - Supports general `rank` and `dense_rank` window functions. [#13183](https://github.com/risingwavelabs/risingwave/pull/13183). See [Window functions](/docs/1.4/window-functions).
- System catalog:
  - Adds column `parallelism` in system table `rw_fragments`. [#12901](https://github.com/risingwavelabs/risingwave/pull/12901)
  - Adds columns `is_hidden`, `is_primary_key`, and `is_distribution_key` in `rw_columns` system table. [#12839](https://github.com/risingwavelabs/risingwave/pull/12839)

#### Sources & sinks

- Adds `google.protobuf.Any` support for Protobuf sources. [#12291](https://github.com/risingwavelabs/risingwave/pull/12291). See [Supported protobuf types](/docs/1.4/protobuf-types).
- Adds `schemas.enable` support for Kafka sinks with upsert JSON. [#12113](https://github.com/risingwavelabs/risingwave/pull/12113). See [Sink to Kafka](/docs/1.4/create-sink-kafka/#sink-parameters).
- Adds support for Kafka sinks with upsert Avro using schema registry. [#13007](https://github.com/risingwavelabs/risingwave/pull/13007). See [Sink to Kafka](/docs/1.4/create-sink-kafka/#avro-specific-parameters).
- `server.id` option is now optional for MySQL CDC source. [#13031](https://github.com/risingwavelabs/risingwave/pull/13031)
- Enables `timestamptz.handling.mode` option to control the timestamptz output format for certain sinks. [#13109](https://github.com/risingwavelabs/risingwave/pull/13109). See [Sink to Kafka](/docs/1.4/create-sink-kafka/#sink-parameters). See [Sink to AWS Kinesis.](/docs/1.4/sink-to-aws-kinesis/#sink-parameters) See [Sink to Pulsar](/docs/1.4/sink-to-pulsar/#sink-parameters).
- Adds the `stream` field and support for multiple inputs for the `subject` field for NATS source connector. [#12799](https://github.com/risingwavelabs/risingwave/pull/12799). See [Ingest data from NATS JetStream](/docs/1.4/ingest-from-nats).
- Adds new option `properties.allow.auto.create.topics` for Kafka sink. [#12766](https://github.com/risingwavelabs/risingwave/pull/12766). See [Sink to Kafka](/docs/1.4/create-sink-kafka/#additional-kafka-parameters).
- Adds support for `s3_v2` source connector, a more efficient version of the S3 source. [#12595](https://github.com/risingwavelabs/risingwave/pull/12595). See [Ingest data from S3 buckets](/docs/1.4/ingest-from-s3).
- Adds support for Google BigQuery sink.[#12873](https://github.com/risingwavelabs/risingwave/pull/12873). See [Sink to Google BigQuery](/docs/1.4/sink-to-bigquery).
- Adds support for Redis sink. [#11999](https://github.com/risingwavelabs/risingwave/pull/11999),[#13003](https://github.com/risingwavelabs/risingwave/pull/13003). See [Sink to Redis](/docs/1.4/sink-to-redis).

#### Deployment

- Release RisingWave all-in-one binary with connector libraries. [#13133](https://github.com/risingwavelabs/risingwave/pull/13133)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v1.4.0 playground`
- [Prebuilt all-in-one library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v1.4.0/risingwave-v1.4.0-x86_64-unknown-linux-all-in-one.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.4.0.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.4.0.tar.gz)
- [risectl-v1.4.0-x86_64-unknown-linux.tar.gz](https://github.com/risingwavelabs/risingwave/releases/download/v1.4.0/risectl-v1.4.0-x86_64-unknown-linux.tar.gz)

See the **Full Changelog** [here](https://github.com/risingwavelabs/risingwave/compare/v1.3-rc...v1.4-rc).

## v1.3.0

This version was released on October 18, 2023.

### Main changes

#### SQL features

- SQL commands
  - Beta: Variable `BACKGROUND_DDL` can be set to `true` when creating a materialized view. [#12355](https://github.com/risingwavelabs/risingwave/pull/12355)
  - `ALTER COLUMN` command can be used for tables with non-schema-registry source. [#12164](https://github.com/risingwavelabs/risingwave/pull/12164)
- SQL functions & operators
  - Supports `array_min`. [#12071](https://github.com/risingwavelabs/risingwave/pull/12071)
  - Supports `array_max`. [#12100](https://github.com/risingwavelabs/risingwave/pull/12100)
  - Supports `array_sort`. [#12189](https://github.com/risingwavelabs/risingwave/pull/12189)
  - Supports `array_sum`. [#12162](https://github.com/risingwavelabs/risingwave/pull/12162)
  - `format` function supports variable inputs. [#12178](https://github.com/risingwavelabs/risingwave/pull/12178)
  - Regular expression functions support back reference, positive, negative lookahead, and positive, negative lookbehind. [#12329](https://github.com/risingwavelabs/risingwave/pull/12329)
  - Supports `||` operator for concatenating JSONB data. [#12502](https://github.com/risingwavelabs/risingwave/pull/12502)
  - Supports `bool_and` and `bool_or` in materialized views. [#11956](https://github.com/risingwavelabs/risingwave/pull/11956)
- Query syntax:
  - Supports `WITH ORDINALITY` clause. [#12273](https://github.com/risingwavelabs/risingwave/pull/12273)
- System catalog
  - Adds new system function `pg_sleep`. [#12294](https://github.com/risingwavelabs/risingwave/pull/12294)
  - Adds new system function `_pg_expandarray`. [#12448](https://github.com/risingwavelabs/risingwave/pull/12448)
  - Adds new storage related system tables:
    - `rw_hummock_sstables` [#12532](https://github.com/risingwavelabs/risingwave/pull/12532)
    - `rw_hommock_pinned_versions`, `rw_hommock_pinned_snapshots`  [#12285](https://github.com/risingwavelabs/risingwave/pull/12285)
    - `rw_hummock_branched_objects` ,  `rw_hummock_current_version` , `rw_hummock_checkpoint_version` ,  `rw_hummock_version_deltas` [#12309](https://github.com/risingwavelabs/risingwave/pull/12309)
    - `rw_hummock_meta_configs`,  `rw_hummock_compaction_group_configs` [#12337](https://github.com/risingwavelabs/risingwave/pull/12337)

#### Sources & sinks

- Generated columns defined with non-deterministic functions cannot be part of the primary key. [#12181](https://github.com/risingwavelabs/risingwave/pull/12181)
- Adds new `properties.enable.auto.commit` parameter for the Kafka consumer, which sets the `enable.auto.commit` parameter for the Kafka client. [#12223](https://github.com/risingwavelabs/risingwave/pull/12223)
- Adds `privatelink.endpoint` parameter to the WITH clause, to support private link for Kafka connector on GCP and AWS. [#12266](https://github.com/risingwavelabs/risingwave/pull/12266)
- Adds parameters `message.timeout.ms` and `max.in.flight.requests.per.connection` for Kafka sources.  [#12574](https://github.com/risingwavelabs/risingwave/pull/12574)
- Allows Kinesis source to start ingesting data from a specific timestamp. `sequence_number` is no longer supported as a startup mode option. [#12241](https://github.com/risingwavelabs/risingwave/pull/12241)
- Allow optional `FORMAT DEBEZIUM ENCODE JSON` after the connector definition of CDC tables. Allow optional `FORMAT NATIVE ENCODE NATIVE` after the connector definition of Nexmark sources or tables. [#12306](https://github.com/risingwavelabs/risingwave/pull/12306)
- Allows multiple URLs when defining schema registries. [#11982](https://github.com/risingwavelabs/risingwave/pull/11982)
- Adds support for sinking data to versions 7 and 8 of Elasticsearch. [#10357](https://github.com/risingwavelabs/risingwave/pull/10357), [#10415](https://github.com/risingwavelabs/risingwave/pull/10415), [#1303](https://github.com/risingwavelabs/risingwave-docs/issues/1303)
- Adds support for sinking append-only data to the NATS messaging system.  [#11924](https://github.com/risingwavelabs/risingwave/pull/11924)
- Adds support for sinking data to Doris. [#12336](https://github.com/risingwavelabs/risingwave/pull/12336)
- Adds support for sinking data to Apache Pulsar. [#12286](https://github.com/risingwavelabs/risingwave/pull/12286)
- Adds support for sinking data to Cassandra and ScyllaDB. [#11878](https://github.com/risingwavelabs/risingwave/pull/11878)
- Adds support for creating upsert Iceberg sinks. [#12576](https://github.com/risingwavelabs/risingwave/pull/12576)
- Supports specifying the `sink_decouple` session variable as `default`, `true` and `enable`, or `false` and `disable`. [#12544](https://github.com/risingwavelabs/risingwave/pull/12544)
- A `varchar` column in RisingWave can sink into a `uuid` column in Postgres. [#12704](https://github.com/risingwavelabs/risingwave/pull/12704)
- New syntaxes for specifying data format and data encode when creating a Kafka, Kinesis, and Pulsar sink. [#12556](https://github.com/risingwavelabs/risingwave/pull/12556)

#### Administration & observability

- Supports querying from `information_schema.views` , which contains formations about views defined in the database. [#12045](https://github.com/risingwavelabs/risingwave/pull/12045)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v1.3.0 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v1.3.0/risingwave-v1.3.0-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.3.0.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.3.0.tar.gz)
- [risectl-v1.3.0-x86_64-unknown-linux.tar.gz](https://github.com/risingwavelabs/risingwave/releases/download/v1.3.0/risectl-v1.3.0-x86_64-unknown-linux.tar.gz)
- [risingwave-connector-v1.3.0.tar.gz](https://github.com/risingwavelabs/risingwave/releases/download/v1.3.0/risingwave-connector-v1.3.0.tar.gz)

See the **Full Changelog** [here](https://github.com/risingwavelabs/risingwave/compare/v1.2-rc...v1.3-rc).

## v1.2.0

This version was released on September 11, 2023.

### Main changes

#### SQL features

- SQL commands:
  - Breaking change: Syntax of emit-on-window-close has changed. If your application contains integration code, please update your code accordingly. [#11363](https://github.com/risingwavelabs/risingwave/pull/11363)

       In v1.1:

       ```sql
       CREATE MATERIALIZED VIEW mv
       EMIT ON WINDOW CLOSE
       AS SELECT
       ...;
       ```

       In v1.2 and onwards:

       ```sql
       CREATE MATERIALIZED VIEW mv
       AS SELECT
       ...
       EMIT ON WINDOW CLOSE;
       ```

  - Privileges for tables can now be granted or revoked. [#11725](https://github.com/risingwavelabs/risingwave/pull/11725)
  - The default `DISTRIBUTED BY` columns have been changed from the whole index columns into the first index column. [#11865](https://github.com/risingwavelabs/risingwave/pull/11865)
  - Supports `ALTER SOURCE ADD COLUMN`. [#11350](https://github.com/risingwavelabs/risingwave/pull/11350)
  - Supports `SHOW JOBS` and `CANCEL JOBS` , with which you can show the in-progress streaming jobs and cancel jobs by their IDs. [#11854](https://github.com/risingwavelabs/risingwave/pull/11854)
  - Supports `[I]LIKE` in `SHOW` commands. [#11791](https://github.com/risingwavelabs/risingwave/pull/11791)
- SQL functions & operators
  - Supports lambda functions via `array_transform`. [#11888](https://github.com/risingwavelabs/risingwave/pull/11888), [#11937](https://github.com/risingwavelabs/risingwave/pull/11937)
  - Supports `to_date()`. [#11241](https://github.com/risingwavelabs/risingwave/pull/11241)
  - The `to_char()` function now supports `timestamptz` input. [#11778](https://github.com/risingwavelabs/risingwave/pull/11778)
  - Supports `scale`, `min_scale`, and `trim_scale`.  [#11663](https://github.com/risingwavelabs/risingwave/pull/11663)
  - Supports `regexp_replace`. [#11819](https://github.com/risingwavelabs/risingwave/pull/11819)
  - Supports `regexp_count`. [#11975](https://github.com/risingwavelabs/risingwave/pull/11975)
  - Supports `[NOT] ILIKE` expressions.  [#11743](https://github.com/risingwavelabs/risingwave/pull/11743)
  - Supports `[!]~~[*]` operators, which are equivalent to `[NOT] [I]LIKE`. [#11748](https://github.com/risingwavelabs/risingwave/pull/11748)
  - Supports `IS JSON` predicate. [#11831](https://github.com/risingwavelabs/risingwave/pull/11831)

- Query syntax:
  - Adds support for `LIMIT` clauses in streaming queries. [#11566](https://github.com/risingwavelabs/risingwave/pull/11566)
  - Supports `LATERAL` subqueries. [#11780](https://github.com/risingwavelabs/risingwave/pull/11780)

- System catalog
  - A new group of system catalogs (`rw_relations`, `rw_system_tables`, `rw_types`, `rw_user_secrets`, and `rw_columns`) are available for you to retrieve system data and metadata. [#11334](https://github.com/risingwavelabs/risingwave/pull/11334)
  - Adds new system function `pg_relation_size()` . [#11687](https://github.com/risingwavelabs/risingwave/pull/11687)
- Adds support for transactions for single-table CDC data. [#11453](https://github.com/risingwavelabs/risingwave/pull/11453)

#### Sources & sinks

- Adds a new parameter `schema.registry.name.strategy` to the Kafka connector, with which you can specify naming strategies for schema registries. [#11384](https://github.com/risingwavelabs/risingwave/pull/11384)
- Breaking Change: Implements a Rust-native Iceberg sink connector to improve stability and performance. The connector introduces new parameters. Applications that rely on the previous version of the feature (specifically, the version included in RisingWave v1.0 and v1.1) may no longer function correctly. To restore functionality to your applications, please carefully review the syntax and parameters outlined on this page and make any necessary revisions to your code. Please refer to [Sink data to Iceberg](https://docs.risingwave.com/docs/current/sink-to-iceberg/) for details.   [#11326](https://github.com/risingwavelabs/risingwave/pull/11326)
- Adds support for sinking data to ClickHouse. For a detailed guide about how to sink data from RisingWave to ClickHouse, see [Sink data to ClickHouse](https://docs.risingwave.com/docs/current/sink-to-clickhouse/). [#11240](https://github.com/risingwavelabs/risingwave/pull/11240)
- Beta: An enhancement has been made to the mysql-cdc connector to improve data ingestion performance. It achieves so by optimizing the data backfilling logic for CDC tables. This feature is not enabled by default. To enable it, run this command: `SET cdc_backfill="true";` [#11707](https://github.com/risingwavelabs/risingwave/pull/11707)
- Adds a parameter `client.id` for Kafka sources. [#11911](https://github.com/risingwavelabs/risingwave/pull/11911)

#### Deployment

- Supports HDFS as the storage backend for deployments via Docker Compose. [#11632](https://github.com/risingwavelabs/risingwave/pull/11632)

#### Administration & observability

- Adds a new system parameter `max_concurrent_creating_streaming_jobs`, with which users can specify the maximum number of streaming jobs that can be created concurrently.  [#11601](https://github.com/risingwavelabs/risingwave/pull/11601)
- Improves the calculation logic of the *Mem Table Size (Max)* metric in RisingWave Dashboard. [#11442](https://github.com/risingwavelabs/risingwave/pull/11442)
- Adds new metrics to RisingWave Dashboard:
  - *Materialized View Memory Usage* [#10958](https://github.com/risingwavelabs/risingwave/pull/10958)
  - *Materialized View Read Size*, *Materialized View Write Size* [#11054](https://github.com/risingwavelabs/risingwave/pull/11054)
  - *Active Sessions* [#11688](https://github.com/risingwavelabs/risingwave/pull/11688)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v1.2.0 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v1.2.0/risingwave-v1.2.0-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.2.0.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.2.0.tar.gz)
- [risectl-v1.2.0-x86_64-unknown-linux.tar.gz](https://github.com/risingwavelabs/risingwave/releases/download/v1.2.0/risectl-v1.2.0-x86_64-unknown-linux.tar.gz)
- [risingwave-connector-v1.2.0.tar.gz](https://github.com/risingwavelabs/risingwave/releases/download/v1.2.0/risingwave-connector-v1.2.0.tar.gz)

See the **Full Changelog** [here](https://github.com/risingwavelabs/risingwave/compare/v1.1.0...v1.2.0).

## v1.1.0

This version was released on August 8, 2023.

### Main changes

#### SQL features

- SQL commands:

  - `DROP` commands now support the `CASCADE` option, which drops the specified item and all its dependencies. [#11250](https://github.com/risingwavelabs/risingwave/pull/11250)

  - `CREATE TABLE` now supports the `APPEND ONLY` clause, allowing the definition of watermark columns on the table. [#11233](https://github.com/risingwavelabs/risingwave/pull/11233)

  - Supports new commands `START TRANSACTION`, `BEGIN`, and `COMMIT` for read-only transactions. [#10735](https://github.com/risingwavelabs/risingwave/pull/10735)

  - Supports `SHOW CLUSTER` to show the details of your RisingWave cluster, including the address of the cluster, its state, the parallel units it is using, and whether it's streaming data, serving data or unschedulable. [#10656](https://github.com/risingwavelabs/risingwave/pull/10656), [#10932](https://github.com/risingwavelabs/risingwave/pull/10932)

- SQL functions:

  - Supports new window functions: `lead()` and `lag()`. [#10915](https://github.com/risingwavelabs/risingwave/pull/10915)

  - Supports new aggregate functions: `first_value()` and `last_value()`, which retrieve the first and last values within a specific ordering from a set of rows. [#10740](https://github.com/risingwavelabs/risingwave/pull/10740)

  - Supports the `grouping()` function to determine if a column or expression in the `GROUP BY` clause is part of the current grouping set or not. [#11006](https://github.com/risingwavelabs/risingwave/pull/11006)

  - Supports the `set_config()` system administration function. [#11147](https://github.com/risingwavelabs/risingwave/pull/11147)

  - Supports the `sign()` mathematical function. [#10819](https://github.com/risingwavelabs/risingwave/pull/10819)

  - Supports `string_agg()` with `DISTINCT` and `ORDER BY`, enabling advanced string concatenation with distinct values and custom sorting. [#10864](https://github.com/risingwavelabs/risingwave/pull/10864)

  - Supports the co-existence of `string_agg()` and other aggregations with `DISTINCT`. [#10864](https://github.com/risingwavelabs/risingwave/pull/10864)

  - Supports the `zone_string` parameter in the `date_trunc()`, `extract()`, and `date_part()` functions, ensuring compatibility with PostgreSQL. [#10480](https://github.com/risingwavelabs/risingwave/pull/10480)

    - **Breaking change**: Previously, when the input for `date_trunc` was actually a date, the function would cast it to a timestamp and record the choice in the query plan. However, after this release, new query plans will cast the input to `timestamptz` instead. As a result, some old SQL queries, especially those saved as views, may fail to bind correctly and require type adjustments. It's important to note that old query plans will still continue working because the casting choice is recorded with a cast to timestamp.

        Before this release:

          ```sql
          SELECT date_trunc('month', date '2023-03-04');
          
                  date_trunc
          ---------------------------
            2023-03-01 00:00:00
          (1 row)
          ```

        After this release:

          ```sql
          SELECT date_trunc('month', date '2023-03-04');
          
                  date_trunc
          ---------------------------
            2023-03-01 00:00:00+00:00
          (1 row)
          ```

        Now, the result of `date_trunc` includes the timezone offset (`+00:00`) in the output, making it consistent with the behavior in PostgreSQL.

  - `round()` now accepts a negative value and rounds it to the left of the decimal point. [#10961](https://github.com/risingwavelabs/risingwave/pull/10961)

  - `to_timestamp()` now returns `timestamptz`. [#11018](https://github.com/risingwavelabs/risingwave/pull/11018)

- Query clauses

  - `SELECT` now supports the `EXCEPT` clause which excludes specific columns from the result set. [#10438](https://github.com/risingwavelabs/risingwave/pull/10438), [#10723](https://github.com/risingwavelabs/risingwave/pull/10723)

  - `SELECT` now supports the `GROUPING SETS` clause which allows users to perform aggregations on multiple levels of grouping within a single query. [#10807](https://github.com/risingwavelabs/risingwave/pull/10807)

  - Supports index selection for temporal joins. [#11019](https://github.com/risingwavelabs/risingwave/pull/11019)

  - Supports `CUBE` in group-by clauses to generate multiple grouping sets. [#11262](https://github.com/risingwavelabs/risingwave/pull/11262)

- Patterns
  - Supports multiple rank function calls in TopN by group. [#11149](https://github.com/risingwavelabs/risingwave/pull/11149)
  
- System catalog

  - Supports querying `created_at` and `initialized_at` from RisingWave relations such as sources, sinks, and tables in RisingWave catalogs. [#11199](https://github.com/risingwavelabs/risingwave/pull/11199)

#### Connectors

- Supports specifying more Kafka parameters when creating a source or sink. [#11203](https://github.com/risingwavelabs/risingwave/pull/11203)

- JDBC sinks used for upserts must specify the downstream primary key via the `primary_key` option. [#11042](https://github.com/risingwavelabs/risingwave/pull/11042)
  
- `access_key` and its corresponding `secret_key` are now mandatory for all AWS authentication components. [#11120](https://github.com/risingwavelabs/risingwave/pull/11120)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v1.1.0 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v1.1.0/risingwave-v1.1.0-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.1.0.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.1.0.tar.gz)

## v1.0.0

This version was released on July 12, 2023.

### Main changes

#### SQL features

- SQL command:

  - Supports the `GROUPING SETS` clause. [#10807](https://github.com/risingwavelabs/risingwave/pull/10807)

- SQL function:

  - Adds the `current_setting()` function to get the current value of a configuration parameter. [#10051](https://github.com/risingwavelabs/risingwave/issues/10051)

  - Adds new array functions: `array_position()`, `array_replace()`, `array_ndims()`, `array_lower()`, `array_upper()`, `array_length()`, and `array_dims()`. [#10166](https://github.com/risingwavelabs/risingwave/pull/10166), [#10197](https://github.com/risingwavelabs/risingwave/pull/10197)

  - Adds new aggregate functions: `percentile_cont()`, `percentile_disc()`, and `mode()`. [#10252](https://github.com/risingwavelabs/risingwave/pull/10252)

  - Adds new system functions: `user()`, `current_user()`, and `current_role()`. [#10366](https://github.com/risingwavelabs/risingwave/pull/10366)

  - Adds new string functions: `left()` and `right()`. [#10765](https://github.com/risingwavelabs/risingwave/pull/10765)

  - Adds new bytea functions: `octet_length()` and `bit_length()`. [#10462](https://github.com/risingwavelabs/risingwave/pull/10462)

  - `array_length()` and `cardinality()` return integer instead of bigint. [#10267](https://github.com/risingwavelabs/risingwave/pull/10267)

  - Supports the `row_number` window function that doesn't match the TopN pattern. [#10869](https://github.com/risingwavelabs/risingwave/pull/10869)

- User-defined function:

  - Adds support for defining UDFs in Java. [#10095](https://github.com/risingwavelabs/risingwave/pull/10095)

  - Adds support for more Java UDF and Python UDF data types. [#10399](https://github.com/risingwavelabs/risingwave/pull/10399)

  - The language parameter is no longer required in `CREATE FUNCTION`. [#10608](https://github.com/risingwavelabs/risingwave/pull/10608)

- System catalog:

  - Adds more columns to `information_schema.columns`: `column_default`, `character_maximum_length`, and `udt_name`. [#10269](https://github.com/risingwavelabs/risingwave/pull/10269)

  - Adds a new system catalog `pg_proc`. [#10216](https://github.com/risingwavelabs/risingwave/pull/10216)

  - Adds new RisingWave catalogs:
  
    - `rw_table_fragments`, `rw_fragments`, `rw_actors` [#10712](https://github.com/risingwavelabs/risingwave/pull/10712)
    - `rw_worker_nodes`, `rw_parallel_units` [#10656](https://github.com/risingwavelabs/risingwave/pull/10656)
    - `rw_connections`, `rw_databases`, `rw_functions`, `rw_indexes`, `rw_materialized_views`, `rw_schemas`, `rw_sinks`, `rw_sources`, `rw_tables`, `rw_users`, `rw_views` [#10593](https://github.com/risingwavelabs/risingwave/pull/10593)

- Supports `GROUP BY` output alias or index. [#10305](https://github.com/risingwavelabs/risingwave/pull/10305)

- Supports using scalar functions in the `FROM` clause. [#10317](https://github.com/risingwavelabs/risingwave/pull/10317)

- Supports tagging the created VPC endpoints when creating a PrivateLink connection. [#10582](https://github.com/risingwavelabs/risingwave/pull/10582)

#### Connectors

- ***Breaking change***: When creating a source or table with a connector whose schema is auto-resolved from an external format file, the syntax for defining primary keys within column definitions is replaced with the table constraint syntax. [#10195](https://github.com/risingwavelabs/risingwave/pull/10195)

    ```sql title="Old"
    CREATE TABLE debezium_non_compact (order_id int PRIMARY KEY) WITH (
    connector = 'kafka',
    kafka.topic = 'debezium_non_compact_avro_json',
    kafka.brokers = 'message_queue:29092',
    kafka.scan.startup.mode = 'earliest'
    ) ROW FORMAT DEBEZIUM_AVRO ROW SCHEMA LOCATION CONFLUENT SCHEMA REGISTRY 'http://message_queue:8081';
    ```

    ```sql title="New"
    CREATE TABLE debezium_non_compact (PRIMARY KEY(order_id)) WITH ( ...
    ```

- ***Breaking change***: Modifies the syntax for specifying data and encoding formats for a source in `CREATE SOURCE` and `CREATE TABLE` commands. For v1.0.0, the old syntax is still accepted but will be deprecated in the next release. [#10768](https://github.com/risingwavelabs/risingwave/pull/10768)

    Old syntax - part 1:

    ```sql
    ROW FORMAT data_format 
    [ MESSAGE 'message' ]
    [ ROW SCHEMA LOCATION ['location' | CONFLUENT SCHEMA REGISTRY 'schema_registry_url' ] ];
    ```

    New syntax - part 1:

    ```sql
    FORMAT data_format ENCODE data_encode (
        message = 'message',
        schema.location = 'location' | schema.registry = 'schema_registry_url'
    );
    ```

    Old syntax - part 2:

    ```sql
    ROW FORMAT csv WITHOUT HEADER DELIMITED BY ',';
    ```

    New syntax - part 2:

    ```sql
    FORMAT PLAIN ENCODE CSV (
        without_header = 'true',
        delimiter = ','
    );
    ```

- Supports sinking data to Delta Lake. [#10374](https://github.com/risingwavelabs/risingwave/pull/10374), [#10580](https://github.com/risingwavelabs/risingwave/pull/10580)

- Supports sinking data to AWS Kinesis. [#10437](https://github.com/risingwavelabs/risingwave/pull/10437)

- Supports `BYTES` as a row format. [#10592](https://github.com/risingwavelabs/risingwave/pull/10592)

- Supports specifying schema for the PostgreSQL sink. [#10576](https://github.com/risingwavelabs/risingwave/pull/10576)

- Supports using the user-provided publication to create a PostgreSQL CDC table. [#10804](https://github.com/risingwavelabs/risingwave/pull/10804)

### Assets

- Run this version from Docker:<br/>
    `docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v1.0.0 playground`
- [Prebuilt library for Linux](https://github.com/risingwavelabs/risingwave/releases/download/v1.0.0/risingwave-v1.0.0-x86_64-unknown-linux.tar.gz)
- [Source code (zip)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.0.0.zip)
- [Source code (tar.gz)](https://github.com/risingwavelabs/risingwave/archive/refs/tags/v1.0.0.tar.gz)

## v0.19.0

This version was released on June 1, 2023.

### Main changes

#### Installation

- Now, you can easily install RisingWave on your local machine with Homebrew by running  `brew install risingwave`. See [Run RisingWave](/get-started.md#run-risingwave).

#### Administration

- Adds the `pg_indexes` and `dattablespace` system catalogs. [#9844](https://github.com/risingwavelabs/risingwave/pull/9844), [#9822](https://github.com/risingwavelabs/risingwave/pull/9822)
- Now, the `SHOW PARAMETERS` command will display the mutability of each system parameter. [#9526](https://github.com/risingwavelabs/risingwave/pull/9526)

#### SQL features

- Experimental features: Adds support for 256-bit integer. [#9146](https://github.com/risingwavelabs/risingwave/pull/9146), [#9184](https://github.com/risingwavelabs/risingwave/pull/9184), [#9186](https://github.com/risingwavelabs/risingwave/pull/9186), [#9191](https://github.com/risingwavelabs/risingwave/pull/9191), [#9217](https://github.com/risingwavelabs/risingwave/pull/9217)
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

**Full Changelog**: <https://github.com/risingwavelabs/risingwave/compare/v0.1.17...v0.18.0>

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
