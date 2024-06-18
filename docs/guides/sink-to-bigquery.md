---
 id: sink-to-bigquery
 title: Sink data from RisingWave to Google BigQuery
 description: Sink data from RisingWave to Google BigQuery.
 slug: /sink-to-bigquery
---

This guide describes how to sink data from RisingWave to Google BigQuery.

[BigQuery](https://cloud.google.com/bigquery?hl=en) is Google's fully managed data warehouse and data analytics platform, capable of handling and analyzing large volumes of data as it is highly scalable.

You can test out this process on your own device by using the `big-query-sink` demo in the [`integration_test directory`](https://github.com/risingwavelabs/risingwave/tree/main/integration_tests) of the RisingWave repository.

## Prerequisites

Before sinking data from RisingWave to BigQuery, please ensure the following:

- The BigQuery table you want to sink to is accessible from RisingWave.
- Ensure you have an upstream materialized view or table in RisingWave that you can sink data from.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='bigquery',
   connector_parameter = 'value', ...
);
```

## Parameters

| Parameter Names | Description |
| --------------- | ---------------------------------------------------------------------- |
|*sink_name*| Name of the sink to be created.|
|*sink_from*| A clause that specifies the direct source from which data will be output. *sink_from* can be a materialized view or a table. Either this clause or *select_query* query must be specified.|
|AS *select_query*| A `SELECT` query that specifies the data to be output to the sink. Either this query or a *sink_from* clause must be specified. See [SELECT](/sql/commands/sql-select.md) for the syntax and examples of the `SELECT` command.|
| type | Required. Data format. Allowed formats:<ul><li> `append-only`: Output data with insert operations.</li><li>`upsert`: For this type, you need to set corresponding permissions and primary keys based on the [Document of BigQuery](https://cloud.google.com/bigquery/docs/change-data-capture).</li></ul>|
| force_append_only | Optional. If `true`, forces the sink to be `append-only`, even if it cannot be. |
| bigquery.local.path | Optional. The file path leading to the JSON key file located in your local server. Details can be found in [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) under your Google Cloud account. Either `bigquery.local.path` or `bigquery.s3.path` must be specified. |
| bigquery.s3.path | Optional. The file path leading to the JSON key file located in S3. Details can be found in [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) under your Google Cloud account. At least one of `bigquery.local.path` or `bigquery.s3.path` must be specified.|
| bigquery.project | Required. The BigQuery project ID. |
| bigquery.dataset | Required. The BigQuery dataset ID. |
| bigquery.table | Required. The BigQuery table you want to sink to. |
| aws.credentials.access_key_id | Optional. The access key of the S3 file. This must be specified if sinking to an S3 file. |
| aws.credentials.secret_access_key | Optional. The secret access key of the S3 file. This must be specified if sinking to an S3 file.|
| region | Optional. The service region of the S3 file. This must be specified if sinking to an S3 file. |

## Examples

We can create a BigQuery sink with a local JSON key file.

```sql
CREATE SINK big_query_sink_local
FROM mv1
WITH (
    connector = 'bigquery',
    type = 'append-only',
    bigquery.local.path= '${bigquery_service_account_json_path}',
    bigquery.project= '${project_id}',
    bigquery.dataset= '${dataset_id}',
    bigquery.table= '${table_id}',
    force_append_only='true'
);
```

Or we can create a BigQuery sink with an S3 JSON key file.

```sql
CREATE SINK big_query_sink_s3
FROM mv1
WITH (
    connector = 'bigquery',
    type = 'append-only',
    bigquery.s3.path= '${s3_service_account_json_path}',
    bigquery.project= '${project_id}',
    bigquery.dataset= '${dataset_id}',
    bigquery.table= '${table_id}',
    aws.credentials.access_key_id = '${aws_access_key}',
    aws.credentials.secret_access_key = '${aws_secret_access}',
    region = '${aws_region}',
    force_append_only='true',
);
```

## Data type mapping

|RisingWave Data Type | BigQuery Data Type|
|-----|-----|
|boolean | bool |
|smallint | int64 |
|integer |int64|
|bigint |int64|
|real |unsupported|
|double precision |float64|
|numeric |numeric|
|date |date|
|character varying (varchar) |string|
|time without time zone |unsupported|
|timestamp without time zone |datetime|
|timestamp with time zone |timestamp|
|interval |interval|
|struct | struct|
|array |array |
|bytea| bytes|
|JSONB |JSON|
|serial| int64|
