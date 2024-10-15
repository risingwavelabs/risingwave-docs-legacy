---
id: go-client-libraries
title: Use RisingWave in your Go application
description: Use RisingWave in your Go application
slug: /go-client-libraries
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/go-client-libraries/" />
</head>

As RisingWave is wire-compatible with PostgreSQL, you can use third-party PostgreSQL drivers to interact with RisingWave from your Go applications.

In this guide, we use the [`pgx` driver](https://github.com/jackc/pgx) to connect to RisingWave.

## Run RisingWave

To learn about how to run RisingWave, see [Run RisingWave](/get-started.md#run-risingwave).

## Install the `pgx` driver

Run the following command to install the `pgx` driver:

```shell
go get github.com/jackc/pgx/v4
```

## Connect to RisingWave

To connect to RisingWave via `pgx`:

```go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v4"
)

func main() {
         // Please replace the placeholders with the actual credentials.
	connStr := "postgres://USER:PASSWORD@localhost:4566/DATABASE"
	conn, err := pgx.Connect(context.Background(), connStr)
	if err != nil {
		log.Fatalf("Unable to connect to RisingWave: %v\n", err)
	}
	defer conn.Close(context.Background())

	fmt.Println("Connected to RisingWave")
}
```

## Create a source

The code below creates a source `walk` with the `datagen` connector. The `datagen` connector is used to generate mock data. The `walk` source consists of two columns, `distance` and `duration`, which respectively represent the distance and the duration of a walk. The source is a simplified version of the data that is tracked by smart watches.

Note that you need to place the code inside a function.

```go
sql := `CREATE TABLE walk(distance INT, duration INT)
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
        ) ROW FORMAT JSON`

_, err := conn.Exec(context.Background(), sql)
return err
```
## Create a materialized view

The code in this section creates a materialized view `counter` to capture the latest total distance and duration. Note that you need to place the code inside a function.

```go
sql := `CREATE MATERIALIZED VIEW counter AS 
        SELECT
            SUM(distance) as total_distance,
            SUM(duration) as total_duration
        FROM walk`

_, err := conn.Exec(context.Background(), sql)
return err
```

## Query a materialized view

The code in this section queries the materialized view `counter` to get the real-time data. Note that you need to place the code inside a function.

```go
sql := `SELECT * FROM counter`
rows, err := conn.Query(context.Background(), sql)
if err != nil {
	return err
}
defer rows.Close()

for rows.Next() {
	var total_distance, total_duration float64
	err = rows.Scan(&total_distance, &total_duration)
	if err != nil {
		return err
	}
	fmt.Printf("Total Distance: %.2f, Total Duration: %.2f\n", total_distance, total_duration)
}
return rows.Err()
```