---
id: sports-betting-position-and-risk-management
slug: /sports-betting-position-and-risk-management
title: Sports betting position and risk management
description: Manage your sports betting or trading positions in real-time by using RisingWave to monitor exposure and risk.
---

## Overview

Sports betting involves wagering money on the outcome of sports events. Bettors place bets on various aspects of the game, such as the winning team or the point spread. Bookmakers determine and provide details on the odds and payouts, which are continuously updated based on real-time game dynamics and market behavior.   

By continuously monitoring and analyzing real-time market and betting positions data, bookmakers and bettors can make more informed decisions. Bettors can instantly calculate their profits and refine their betting strategies based on their current risk level. Bookmakers can adjust odds based on the market, maintaining profitability. 

In this tutorial, you will learn how to analyze real-time betting and market data to dynamically evaluate the risk, profit, and loss of betting positions.

## Prerequisites

* Ensure that the [PostgreSQL](https://www.postgresql.org/docs/current/app-psql.html) interactive terminal, `psql`, is installed in your environment. For detailed instructions, see [Download PostgreSQL](https://www.postgresql.org/download/).
* Install and run RisingWave. For detailed instructions on how to quickly get started, see the [Quick start](/get-started.md) guide.
* Ensure that a Python environment is set up and install the [psycopg2](https://pypi.org/project/psycopg2/) library. 

## Step 1: Set up the data sources

Once RisingWave is installed and deployed, run the two SQL queries below to set up the tables. We will insert data into these tables to simulate live data streams.

The table `positions` tracks key details about each betting position within different sports league. It contains information such as the stake amount, expected return, fair value, and market odds, allowing us to assess the risk and performance of each position. 

```sql
CREATE TABLE positions (
    position_id INT,
    league VARCHAR,
    position_name VARCHAR,
    timestamp TIMESTAMP,
    stake_amount FLOAT,
    expected_return FLOAT,
    max_risk FLOAT,
    fair_value FLOAT,
    current_odds FLOAT,
    profit_loss FLOAT,
    exposure FLOAT
);
```
The table `market_data` describes the market activity related to specific positions. We can track pricing and volume trends across different bookmakers, observing pricing changes over time.

```sql
CREATE TABLE market_data (
    position_id INT,
    bookmaker VARCHAR,
    market_price FLOAT,
    volume INT,
    timestamp TIMESTAMP
);
```

## Step 2: Run the data generator

To keep this demo simple, a Python script is used to generate and insert data into the tables created above. 

Navigate to the [position_risk_management](https://github.com/risingwavelabs/awesome-stream-processing) folder in the [awesome-stream-processing-repository](https://github.com/risingwavelabs/awesome-stream-processing) and run the `data_generator.py` file. This Python script utilizes the `psycopg2` library to establish a connection with RisingWave so we can generate and insert synthetic data into the tables `positions` and `market_data`. 

If you are not running RisingWave locally or are not using default RisingWave database credentials, edit the connections parameters accordingly. The default connection parameters are shown below. Otherwise, the script can be run as is. 

```python
default_params = {
    "dbname": "dev",
    "user": "root",
    "password": "",
    "host": "localhost",
    "port": "4566"
}
```

## Step 3: Create materialized views

In this demo, we will create three materialized views to gain insight on individual positions and the market risk.

### Track individual positions

The `position_overview` materialized view provides key information on each position, such as the stake, max risk, market price, profit loss, and risk level. It joins the `positions` table with the most recent `market_price` from the `market_data` table. This is done using the `ROW_NUMBER()` function, which assigns a rank to each record based on `position_id`, ordered by the timestamp in descending order.

`profit_loss` is calculated as the difference between `market_price` and `fair_value` while `risk_level` is based on `profit_loss` relative to `max_risk`.

```sql
CREATE MATERIALIZED VIEW position_overview AS
SELECT
    p.position_id,
    p.position_name,
    p.league,
    p.stake_amount,
    p.max_risk,
    p.fair_value,
    m.market_price,
    (m.market_price - p.fair_value) * p.stake_amount AS profit_loss,
    CASE
        WHEN (m.market_price - p.fair_value) * p.stake_amount > p.max_risk THEN 'High'
        WHEN (m.market_price - p.fair_value) * p.stake_amount BETWEEN p.max_risk * 0.5 AND p.max_risk THEN 'Medium'
        ELSE 'Low'
    END AS risk_level,
    m.timestamp AS last_update
FROM
    positions AS p
JOIN
    (SELECT position_id, market_price, timestamp,
            ROW_NUMBER() OVER (PARTITION BY position_id ORDER BY timestamp DESC) AS row_num
     FROM market_data) AS m
ON p.position_id = m.position_id
WHERE m.row_num = 1;
```

We can query from `position_overview` to see the results.

```sql
SELECT * FROM position_overview LIMIT 5;
```

```bash
 position_id |  position_name   | league | stake_amount | max_risk | fair_value | market_price |     profit_loss     | risk_level |           last_update            
-------------+------------------+--------+--------------+----------+------------+--------------+---------------------+------------+----------------------------------
           9 | Team A vs Team C | NBA    |        495.6 |   727.74 |       1.64 |         2.07 |  213.10799999999998 | Low        | 2024-11-11 15:46:49.414689+00:00
           2 | Team B vs Team E | NBA    |        82.96 |    113.2 |       2.89 |         4.53 |            136.0544 | High       | 2024-11-11 15:46:49.410444+00:00
           9 | Team E vs Team B | NHL    |       121.86 |   158.26 |       3.04 |         2.07 | -118.20420000000003 | Low        | 2024-11-11 15:46:49.414689+00:00
           2 | Team D vs Team B | NBA    |       408.89 |   531.91 |       1.98 |         4.53 |           1042.6695 | High       | 2024-11-11 15:46:49.410444+00:00
           9 | Team C vs Team B | NFL    |       420.62 |   449.32 |       2.01 |         2.07 |  25.237200000000023 | Low        | 2024-11-11 15:46:49.414689+00:00
```

### Monitor overall risk

The `risk_summary` materialized view gives an overview on the number of positions that are considered "High", "Medium", or "Low" risk. We group by `risk_level` from `position_overview` and count the number of positions in each category.

This allows us to quickly understand overall risk exposure across all positions.

```sql
CREATE MATERIALIZED VIEW risk_summary AS
SELECT
    risk_level,
    COUNT(*) AS position_count
FROM
    position_overview
GROUP BY
    risk_level;
```

We can query from `risk_summary` to see the results.

```sql
SELECT * FROM risk_summary;
```
```bash
 risk_level | position_count 
------------+----------------
 High       |             23
 Medium     |             46
 Low        |            341
```

### Retrieve latest market prices

The `market_summary` materialized view shows the current market data for each betting from the `positions` table. It joins `positions` and `market_data` to include the most recent market price for each bookmaker. Again, the `ROW_NUMBER()` function is used to retrieve the most recent record for each bookmaker and position.

```sql
CREATE MATERIALIZED VIEW market_summary AS
SELECT
    p.position_id,
    p.position_name,
    p.league,
    m.bookmaker,
    m.market_price,
    m.timestamp AS last_update
FROM
    positions AS p
JOIN
    (SELECT position_id, bookmaker, market_price, timestamp,
            ROW_NUMBER() OVER (PARTITION BY position_id, bookmaker ORDER BY timestamp DESC) AS row_num
     FROM market_data) AS m
ON p.position_id = m.position_id
WHERE m.row_num = 1;
```

We can query from `market_summary` to see the results.

```sql
SELECT * FROM market_summary LIMIT 5;
```
```bash
 position_id |  position_name   | league | bookmaker  | market_price |        last_update         
-------------+------------------+--------+------------+--------------+----------------------------
           8 | Team D vs Team E | NBA    | FanDuel    |         2.07 | 2024-11-12 15:03:03.681245
           3 | Team A vs Team E | MLB    | FanDuel    |         2.27 | 2024-11-12 15:02:55.525759
           9 | Team B vs Team E | Tennis | BetMGM     |         4.77 | 2024-11-12 15:03:09.833653
           4 | Team C vs Team B | NHL    | Caesars    |         1.02 | 2024-11-12 15:03:07.767925
           3 | Team A vs Team D | NBA    | Caesars    |         2.21 | 2024-11-12 15:02:45.320730
```

When finished, press `Ctrl+C` to close the connection between RisingWave and `psycopg2`.

## Summary

In this tutorial, we learn:

- How to connect to RisingWave from a Python application using `psycopg2`.
- How to use `ROW_NUMBER()` to retrieve the most recent message based on the timestamp.