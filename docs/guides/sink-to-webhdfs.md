---
 id: sink-to-webhdfs
 title: Sink data to WebHDFS
 description: Describes how to sink data to WebHDFS.
 slug: /sink-to-webhdfs
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-webhdfs/" />
</head>

This guide describes how to sink data from RisingWave to WebHDFS.

As a workaround for HDFS, WebHDFS allows external clients to execute Hadoop file system operations without necessarily running on the Hadoop cluster itself. Therefore, it reduces the dependency on the Hadoop environment when using HDFS.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='webhdfs',
   connector_parameter = 'value', ...
);
```

## Parameters

| Parameter names | Description |
|-|-|
| connector        | Required. Support the WebHDFS connector only. |
| webhdfs.endpoint | Required. The endpoint for the WebHDFS service. |
| webhdfs.path     | Required. The directory where the sink file is located. |
| type             | Required. Defines the type of the sink. Options include `append-only` or `upsert`. |

## Example

```sql
CREATE SINK webhdfs_sink AS SELECT v1
FROM t1
WITH (
    connector='webhdfs',
    webhdfs.path = '<test_path>',
    webhdfs.endpoint = '<test_endpoint>',
    type = 'append-only',
)FORMAT PLAIN ENCODE PARQUET(force_append_only=true);
```

For more information about encode `Parquet` or `JSON`, see [Sink data in parquet or json encode](/data-delivery.md#sink-data-in-parquet-or-json-encode).