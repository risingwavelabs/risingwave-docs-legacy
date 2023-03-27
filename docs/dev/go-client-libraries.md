---
id: go-client-libraries
title: Use RisingWave in your Go application
description: Use RisingWave in your Go application
slug: /go-client-libraries
---

As RisingWave is wire-compatible with PostgreSQL, you can use third-party PostgreSQL drivers to interact with RisingWave from your Python applications.

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
	connStr := "postgres://root:secret@localhost:4566/dev"
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

```go
    sql := `
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
        ) ROW FORMAT JSON
    `

    _, err := conn.Exec(context.Background(), sql)
    return err

```
## Create a materialized view

The code in this section creates a materialized view `counter` to capture the latest total distance and duration..

```go
sql := `
		CREATE MATERIALIZED VIEW counter AS 
        SELECT
            SUM(distance) as total_distance,
            SUM(duration) as total_duration
        FROM walk
	`

	_, err := conn.Exec(context.Background(), sql)
	return err
```

## Query a materialized view

The code in this section queries the materialized view `counter` to get the real-time data.

```go
type CounterRow struct {  //Define a struct to contain results from the materialized view
	total_distance float64
	total_duration float64
}

sql := `SELECT * FROM counter`
	rows, err := conn.Query(context.Background(), sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

var results []CounterRow
	for rows.Next() {
		var row CounterRow
		err = rows.Scan(&row.total_distance, &row.total_duration)
		if err != nil {
			return nil, err
		}
		results = append(results, row) //Handle multiple rows of data
	}

	return results, rows.Err()
//You might want to print the results by using fmt.Printf or fmt.PrintLn functions

```