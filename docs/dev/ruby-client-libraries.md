---
id: ruby-client-libraries
title: Use RisingWave in your Ruby application
description: Use RisingWave in your Ruby application.
slug: /ruby-client-libraries
---

As RisingWave is wire-compatible with PostgreSQL, you can use third-party PostgreSQL drivers to interact with RisingWave from your Ruby applications.

## Use `ruby-pg` to connect to RisingWave

In this section, we use the [`ruby-pg`](https://github.com/ged/ruby-pg) driver to connect to RisingWave.

### Run RisingWave

To learn about how to run RisingWave, see [Run RisingWave](/get-started.md#run-risingwave).


### Install the `ruby-pg` driver

For information about how to install `ruby-pg`, see the [official ruby-pg documentation](https://github.com/ged/ruby-pg?tab=readme-ov-file#how-to-install).


### Connect to RisingWave

To connect to RisingWave via `ruby-pg`:

```ruby
require 'pg'

conn = PG.connect(host: '127.0.0.1', port: 4566, dbname: 'dev', user: 'root')
```

:::note

`BasicTypeMapForResults` class doesn't support currently, you need cast RisingWave types into Ruby types manually.

:::

### Create a source

The code below creates a source `walk` with the `datagen` connector. The `datagen` connector is used to generate mock data. The `walk` source consists of two columns, `distance` and `duration`, which respectively represent the distance and the duration of a walk. The source is a simplified version of the data that is tracked by smart watches.

```ruby
require 'pg'

conn = PG.connect(host: '127.0.0.1', port: 4566, dbname: 'dev', user: 'root')

sql = <<-EOF
CREATE TABLE walk(distance INT, duration INT)
WITH (
    connector = 'datagen',
    fields.distance.kind = 'sequence',
    fields.distance.start = '1',
    fields.distance.end  = '60',
    fields.duration.kind = 'sequence',
    fields.duration.start = '1',
    fields.duration.end = '30',
    datagen.rows.per.second='15',
    datagen.split.num = '1'
) FORMAT PLAIN ENCODE JSON
EOF
conn.exec(sql) # Execute the query.
```

:::note

All the code examples in this guide include a section for connecting to RisingWave. If you perform multiple actions within one connection session, you do not need to repeat this section.

:::


### Create a materialized view

The code in this section creates a materialized view `counter` to capture the latest total distance and duration.

```ruby
require 'pg'

conn = PG.connect(host: '127.0.0.1', port: 4566, dbname: 'dev', user: 'root')

sql = <<-EOF
CREATE MATERIALIZED VIEW counter
    AS SELECT
    SUM(distance) as total_distance,
    SUM(duration) as total_duration
    FROM walk;
EOF
conn.exec(sql)
```

### Query a materialized view

The code in this section queries the materialized view `counter` to get real-time data.

```ruby
require 'pg'

conn = PG.connect(host: '127.0.0.1', port: 4566, dbname: 'dev', user: 'root')

res = conn.exec('SELECT * FROM counter;')
res.each do |row|
  puts row
end
```
