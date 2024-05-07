---
id: create-source-pulsar
title: Ingest data from Pulsar
description: Connect RisingWave to a Pulsar broker.
slug: /create-source-pulsar
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/create-source-pulsar/" />
</head>


Use the SQL statement below to connect RisingWave to a Pulsar broker.


When creating a source, you can choose to persist the data from the source in RisingWave by using `CREATE TABLE` instead of `CREATE SOURCE` and specifying the connection settings and data format.

## Syntax

```sql
CREATE {TABLE | SOURCE} [ IF NOT EXISTS ] source_name 
[ schema_definition ]
WITH (
   connector='pulsar',
   connector_parameter='value', ...
)
ROW FORMAT data_format 
[ MESSAGE 'message' ]
[ ROW SCHEMA LOCATION 'location' ];
```




import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Stack(
        rr.Sequence(
            rr.Choice(1,
                rr.Terminal('CREATE TABLE'),
                rr.Terminal('CREATE SOURCE')
            ),
            rr.Optional(rr.Terminal('IF NOT EXISTS')),
            rr.NonTerminal('source_name', 'wrap')
        ),
        rr.Optional(rr.NonTerminal('schema_definition', 'skip')),
        rr.Sequence(
            rr.Terminal('WITH'),
            rr.Terminal('('),
            rr.Stack(
                rr.Stack(
                    rr.Sequence(
                        rr.Terminal('connector'),
                        rr.Terminal('='),
                        rr.NonTerminal('pulsar', 'skip'),
                        rr.Terminal(','),
                    ),
                    rr.OneOrMore(
                        rr.Sequence(
                            rr.NonTerminal('connector_parameter', 'skip'),
                            rr.Terminal('='),
                            rr.NonTerminal('value', 'skip'),
                            rr.Terminal(','),
                        ),
                    ),
                ),
                rr.Terminal(')'),
            ),
        ),
        rr.Stack(
            rr.Sequence(
                rr.Terminal('ROW FORMAT'),
                rr.NonTerminal('data_format', 'skip'),
            ),
            rr.Optional(
                rr.Sequence(
                    rr.Terminal('MESSAGE'),
                    rr.NonTerminal('message', 'skip'),
                ),
            ),
            rr.Optional(
                rr.Sequence(
                    rr.Terminal('ROW SCHEMA LOCATION'),
                    rr.NonTerminal('location', 'skip'),
                ),
            ),
            rr.Terminal(';'),
        ),
    )
);


<drawer SVG={svg} />





**schema_definition**:
```sql
(
   column_name data_type [ PRIMARY KEY ], ...
   [ PRIMARY KEY ( column_name, ... ) ]
)
```

:::info

For Avro and Protobuf data, do not specify `schema_definition` in the `CREATE SOURCE` or `CREATE TABLE` statement. The schema should be provided in a Web location in the `ROW SCHEMA LOCATION` section.

:::

:::note

RisingWave performs primary key constraint checks on materialized sources but not on non-materialized sources. If you need the checks to be performed, please create a materialized source.

For materialized sources with primary key constraints, if a new data record with an existing key comes in, the new record will overwrite the existing record. 

:::


|Field|Notes|
|---|---|
|topic	|Required. Address of the Pulsar topic. One source can only correspond to one topic.|
|service.url| Required. Address of the Pulsar service.	|
|admin.url	|Required. Address of the Pulsar admin.|
|scan.startup.mode|Optional. The offset mode that RisingWave will use to consume data. The two supported modes are `earliest` (earliest offset) and `latest` (latest offset). If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp_millis.| Optional. RisingWave will start to consume data from the specified UNIX timestamp (milliseconds).|
|*data_format*| Supported formats: `JSON`, `AVRO`, `PROTOBUF`.|
|*message* |Message for the format. Required when *data_format* is `AVRO` or `PROTOBUF`.|
|*location*| Web location of the schema file in `http://...`, `https://...`, or `S3://...` format. Required when *data_format* is `AVRO` or `PROTOBUF`. Examples:<br/>`https://<example_host>/risingwave/proto-simple-schema.proto`<br/>`s3://risingwave-demo/schema-location` |

## Example
Here is an example of connecting RisingWave to a Pulsar broker to read data from individual topics.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="avro" label="Avro" default>

```sql
CREATE {TABLE | SOURCE} IF NOT EXISTS source_abc 
WITH (
   connector='pulsar',
   topic='demo_topic',
   service.url='pulsar://localhost:6650/',
   admin.url='http://localhost:8080',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT AVRO MESSAGE 'FooMessage'
ROW SCHEMA LOCATION 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.avsc';
```
</TabItem>
<TabItem value="json" label="JSON" default>

```sql
CREATE {TABLE | SOURCE} IF NOT EXISTS source_abc (
   column1 string,
   column2 integer,
)
WITH (
   connector='pulsar',
   topic='demo_topic',
   service.url='pulsar://localhost:6650/',
   admin.url='http://localhost:8080',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT JSON;
```
</TabItem>
<TabItem value="pb" label="Protobuf" default>

```sql
CREATE {TABLE | SOURCE} IF NOT EXISTS source_abc (
   column1 string,
   column2 integer,
)
WITH (
   connector='pulsar',
   topic='demo_topic',
   service.url='pulsar://localhost:6650/',
   admin.url='http://localhost:8080',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT PROTOBUF MESSAGE 'FooMessage'
ROW SCHEMA LOCATION 'https://demo_bucket_name.s3-us-west-2.amazonaws.com/demo.proto';
```
</TabItem>
</Tabs>
