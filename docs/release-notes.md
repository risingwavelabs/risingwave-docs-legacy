---
id: release-notes
title: Release notes
description: New features and important bug fixes in each release of RisingWave.
slug: /release-notes
---

This page summarizes changes in each version of RisingWave, including new features and important bug fixes. 

## v0.1.11

This version was released on July 29, 2022.

### Main changes

#### SQL features

* New SQL functions:
    * `overlay()`: Replaces a substring. [#3671](https://github.com/singularity-data/risingwave/pull/3671)
    * `generate_series()`: Generates a series of values from the starting point to the ending point. [#4030](https://github.com/singularity-data/risingwave/pull/4030)
    * `regexp_match()`, `regexp_matches()`: Compares a string against a regular expression pattern and returns matched substrings. [#3702](https://github.com/singularity-data/risingwave/pull/3702) [#4062](https://github.com/singularity-data/risingwave/pull/4062)
    * `string_agg ()`: Concatenates the values into a string. [#3952](https://github.com/singularity-data/risingwave/pull/3952) [#4183](https://github.com/singularity-data/risingwave/pull/4183)
    * `current_database()`: Returns the current database.  [#3650](https://github.com/singularity-data/risingwave/pull/3650)
* New SQL commands:
    * `SHOW ALL`: Lists all configuration parameters. Use `SHOW parameter` to show the value of a configuration parameter. [#3694](https://github.com/singularity-data/risingwave/pull/3694) [#3664](https://github.com/singularity-data/risingwave/pull/3664)
    * `CREATE SINK`: Sinks data to Kafka. [#3923](https://github.com/singularity-data/risingwave/pull/3923) [#3682](https://github.com/singularity-data/risingwave/pull/3682) [#3674](https://github.com/singularity-data/risingwave/pull/3674)
    * `EXPLAIN TRACE`: Traces each optimization stage of the optimizer. [#3945](https://github.com/singularity-data/risingwave/pull/3945)
* Support for lookup joins. Currently, lookup joins can only be performed in local query mode. To use lookup joins, users need to set the configuration parameter `rw_batch_enable_lookup_join`  to true.  [#3859](https://github.com/singularity-data/risingwave/pull/3859) [#3763](https://github.com/singularity-data/risingwave/pull/3763)
* An `ORDER BY` clause in the `CREATE MATERIALIZED VIEW` statement is allowed but not considered as part of the definition of the materialized view. It is only used in the initial creation of the materialized view. It is not used during refreshes. This is a behavior change due to the introduction of parallel table scans. [#3670](https://github.com/singularity-data/risingwave/pull/3670)
* Support for filter clauses on aggregate functions. [#4114](https://github.com/singularity-data/risingwave/pull/4114)

### **Connectors**

* RisingWave can now sink data to Kafka topics in append-only mode and Debezium mode. [#3923](https://github.com/singularity-data/risingwave/pull/3923) [#3682](https://github.com/singularity-data/risingwave/pull/3682) [#3674](https://github.com/singularity-data/risingwave/pull/3674)
* Syntax change for `CREATE SOURCE`: A parameter name is no longer wrapped by single quotation marks. [#3997](https://github.com/singularity-data/risingwave/pull/3997). See the example:
    * Old: `CREATE SOURCE s1 WITH ( 'connector' = 'kafka', 'kafka.topic' = 'kafka_1_partition_topic', 'kafka.brokers' = '127.0.0.1:29092' ) ROW FORMAT json;`  
    * New: `CREATE SOURCE s WITH ( connector = 'kafka', kafka.topic = 'kafka_1_partition_topic', kafka.brokers = '127.0.0.1:29092' ) ROW FORMAT json;`


## Assets

* Run this version from Docker: <br/>`run -it --pull=always -p 4566:4566 -p 5691:5691 ghcr.io/singularity-data/risingwave:v0.1.11 playground`
* [Prebuilt library for Linux](https://github.com/singularity-data/risingwave/releases/download/v0.1.11/risingwave-v0.1.11-x86_64-unknown-linux.tar.gz)
* [Source code (zip)](https://github.com/singularity-data/risingwave/archive/refs/tags/v0.1.11.zip)
* [Source code (tar.gz)](https://github.com/singularity-data/risingwave/archive/refs/tags/v0.1.11.tar.gz)




## v0.1.10

This version was released on July 5, 2022.

### Main changes

#### SQL features

##### SQL operators and functions

* Support string concatenation operator `||`. [#3147](https://github.com/singularity-data/risingwave/pull/3147)
* Support interval comparison. [#3222](https://github.com/singularity-data/risingwave/pull/3222)
* Support dividing intervals by integers, floats, or decimals. [#3441](https://github.com/singularity-data/risingwave/pull/3441)
* Intervals multiplying intervals by floats. [#3641](https://github.com/singularity-data/risingwave/pull/3641)
* Support more temporal operations. [#3472](https://github.com/singularity-data/risingwave/pull/3472)
* Support Common Table Expressions (CTEs) as input of time window functions. [#3188](https://github.com/singularity-data/risingwave/pull/3188)
* Add these new functions:
    * `concat()` for concatenating strings [#3091](https://github.com/singularity-data/risingwave/pull/3091)
    * `repeat()` for repeating string [#3148](https://github.com/singularity-data/risingwave/pull/3148)
    * `octet_length()` and bit_length() for getting string length [#3526](https://github.com/singularity-data/risingwave/pull/3526)
    * `Row()` for constructing rows [#2914](https://github.com/singularity-data/risingwave/pull/2914) [#3152](https://github.com/singularity-data/risingwave/pull/3152)
    * `pg_typeof()` for getting data types of values [#3494](https://github.com/singularity-data/risingwave/pull/3494)
    * `current_database()` for getting the name of the current database in the session [#3650](https://github.com/singularity-data/risingwave/pull/3650)
    * `approx_count_distinct()` for distinct counting [#3121](https://github.com/singularity-data/risingwave/pull/3121)
    * `unnest()` for expanding nested tables to rows [#3017](https://github.com/singularity-data/risingwave/pull/3017) 
* Support `count()`, `min()`, and `max()` functions on these data types: *interval*, *timestamp*, *varchar*, and *date*. [#3069](https://github.com/singularity-data/risingwave/pull/3069)

##### SQL commands

* Support `EXPLAIN CREATE INDEX`. [#3229](https://github.com/singularity-data/risingwave/pull/3229)
* Add cascade and restrict options in `REVOKE` commands. [#3363](https://github.com/singularity-data/risingwave/pull/3363)
* Expand the `CREATE TABLE` syntax to support creating append-only tables. [#3058](https://github.com/singularity-data/risingwave/pull/3058)
* Support the `CREATE USER` command and user authentication. [#3074](https://github.com/singularity-data/risingwave/pull/3074)

##### Data types

* Support implicit casts from single-quoted literals. [#3487](https://github.com/singularity-data/risingwave/pull/3487)
* Add string as an alias for data type varchar.  [#3094](https://github.com/singularity-data/risingwave/pull/3094)
* Support string intervals.  [#3037](https://github.com/singularity-data/risingwave/pull/3037)

##### Database management

* Add the default super user “postgres”.  [#3127](https://github.com/singularity-data/risingwave/pull/3127)
* The default schema name is changed to “public” from “dev”.  [#3166](https://github.com/singularity-data/risingwave/pull/3166)

#### Connectors

* Add random seed for the Datagen Source Connector. [#3124](https://github.com/singularity-data/risingwave/pull/3124)

### Assets

* [Prebuilt library for Linux](https://github.com/singularity-data/risingwave/releases/download/v0.1.10/risingwave-v0.1.10-x86_64-unknown-linux.tar.gz) 
* [Source code (zip)](https://github.com/singularity-data/risingwave/archive/refs/tags/v0.1.10.zip)
* [Source code (tar.gz)](https://github.com/singularity-data/risingwave/archive/refs/tags/v0.1.10.tar.gz)


## v0.1.8

This version was released on May 14, 2022. 

### Main changes

#### SQL features

* Support SQL functions: `concat_ws()`, `abs()`, `round()`, `ceil()`, `floor()`. [#2589](https://github.com/singularity-data/risingwave/pull/2589) [#2531](https://github.com/singularity-data/risingwave/pull/2531) [#2716](https://github.com/singularity-data/risingwave/pull/2716)
* Support casts from number types (*smallint*, *integer*, *bigint*, *numeric*, *real*, and *double precision*) to *varchar* using the `to_string` method. [#2522](https://github.com/singularity-data/risingwave/pull/2522)
* Support creating a table with nested columns. [#2434](https://github.com/singularity-data/risingwave/pull/2434)
* Support non-literals in the `IN` operator. [#2588](https://github.com/singularity-data/risingwave/pull/2588)
* Support the `IS [NOT] DISTINCT FROM` expression. [#2582](https://github.com/singularity-data/risingwave/pull/2582)
* Support the `UPDATE` command. Subqueries on the right side of multi-value assignments are not supported yet. [#2602](https://github.com/singularity-data/risingwave/pull/2602)
* Support table alias in window table functions. [#2633](https://github.com/singularity-data/risingwave/pull/2633)
* Support database user management. [#2943](https://github.com/singularity-data/risingwave/pull/2943)

#### Connectors

Support the Datagen Source Connector, which can be used to generate mock data for testing purposes. [#2737](https://github.com/singularity-data/risingwave/pull/2737)

#### Observability

* Add metrics for these components in Grafana.
    * Compaction and object-store  [#2573](https://github.com/singularity-data/risingwave/pull/2573) [#2761](https://github.com/singularity-data/risingwave/pull/2761)
    * Iterator and cache [#2709](https://github.com/singularity-data/risingwave/pull/2709)
    * Streaming exchange service [#2906](https://github.com/singularity-data/risingwave/pull/2906)


* Support listing KVs by epoch and table in the risectl tool. [#2640](https://github.com/singularity-data/risingwave/pull/2640)

#### Deployment

* RisingWave docker images support the playground mode in the bridge Docker networking mode. [#2921](https://github.com/singularity-data/risingwave/pull/2921)
* CA certificates are bundled into RisingWave docker images so that docker images can be used with S3. [#2853](https://github.com/singularity-data/risingwave/pull/2853)

### Assets

* [Prebuilt library for Linux](https://github.com/singularity-data/risingwave/releases/download/v0.1.8/risingwave-v0.1.8-x86_64-unknown-linux.tar.gz)
* [Source code (zip)](https://github.com/singularity-data/risingwave/archive/refs/tags/v0.1.8.zip) 
* [Source code (tar.gz)](https://github.com/singularity-data/risingwave/archive/refs/tags/v0.1.8.tar.gz)