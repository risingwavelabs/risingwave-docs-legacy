---
 id: sink-to-google-cloud-storage
 title: Sink data to Google Cloud Storage
 description: Describes how to sink data to Google Cloud Storage.
 slug: /sink-to-google-cloud-storage
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-google-cloud-storage/" />
</head>

This guide describes how to sink data from RisingWave to Google Cloud Storage sink using GCS connector in RisingWave.

[Google Cloud Storage](https://cloud.google.com/storage/docs) is a RESTful online file storage web service for storing and accessing data on Google Cloud Platform infrastructure.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='gcs',
   connector_parameter = 'value', ...
);
```

## Parameters

| Parameter names | Description |
|-|-|
| connector             | Required. Support the GCS connector only.|
| gcs.bucket_name        | Required. The name of the bucket where the sink data is stored in. |
| gcs.credential             | Optional. Base64-encoded credential key obtained from the GCS service account key JSON file. To get this JSON file, refer to the [guides of GCS documentation](https://cloud.google.com/iam/docs/keys-create-delete#iam-service-account-keys-create-console).  To encode it in base64, run the following command: <code>cat ~/Downloads/rwc-byoc-test-464bdd851bce.json &#124; base64 -b 0 &#124; pbcopy</code>, and then paste the output as the value for this parameter. If this field is not specified, ADC (application default credentials) will be used.|
| gcs.service_account| Optional. The service account of the GCS sink. If `gcs.credential` or ADC is not specified, the credentials will be derived from the service account.|
| gcs.path | The directory where the sink file is located. |
| type | Required. Defines the type of the sink. Options include `append-only` or `upsert`. |

## Example

```sql
CREATE SINK gcs_sink AS SELECT v1
FROM t1
WITH (
    connector='gcs',
    gcs.path = '<test_path>',
    gcs.bucket_name = '<bucket_name>',
    gcs.credential = '<account_name>',
    gcs.service_account = <service_account>
    type = 'append-only',
)FORMAT PLAIN ENCODE PARQUET(force_append_only=true);
```

For more information about encode `Parquet`, see [Sink data in parquet format](/data-delivery.md#sink-data-in-parquet-format).