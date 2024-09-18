---
id: use-cases
title: RisingWave use cases
slug: /use-cases
keywords: [streaming database, risingwave, use cases]
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/use-cases/" />
</head>

RisingWave excels in a variety of real-time data processing scenarios, making it an ideal choice for several categories of use cases, including:

- Streaming analytics
- Event-driven applications
- Real-time data enrichment
- Feature engineering

This article will explore these use cases in detail, complete with practical examples to demonstrate how RisingWave can be effectively utilized.

## Streaming analytics

Consider scenarios like stock trading, sports betting, IoT monitoring, or other domains where you are dealing with high-velocity event streams from APIs, sensors, Kafka, or other sources. The need to continuously analyze this data is crucial for detecting buy or sell opportunities in financial markets, monitoring real-time sensor data for anomalies, or tracking live sports events for betting insights. In such cases, the analysis must be both fresh and consistent, ensuring that decisions are made based on the most current information.

### Example: Stock trading analytics

Take stock trading as an example. Imagine you want to analyze real-time market data to identify potential trading opportunities. Suppose your data is streaming from Kafka. Here is how RisingWave can streamline this process.

1. Connect to Kafka <br />

  Begin by connecting RisingWave to your Kafka topic to ingest the live market data.  
  ```sql
  CREATE SOURCE stock_trades (
    symbol varchar,
    price double precision,
    volume double precision
  ) WITH (
    connector='kafka',
    topic='stock_trades',
    properties.bootstrap.server='localhost:9092',
    scan.startup.mode='earliest',
  ) FORMAT PLAIN ENCODE JSON;
  ```
2. Express analytics logic in materialized views <br />

  Define your analytics logic using SQL in materialized views. For instance, you might want to detect price movements that indicate a buy or sell signal.   
  ```sql
  CREATE MATERIALIZED VIEW buy_signals AS
  SELECT symbol, price, volume
  FROM stock_trades
  WHERE price > 100 AND volume > 1000;
  ```
3. Check the result <br />

  Query the materialized view to get real-time insights on potential buy signals.  
  ```sql
  SELECT * FROM buy_signals;
  ```

With RisingWave, you can efficiently process and analyze streaming data in real-time, enabling timely and informed decision-making.

## Event-driven applications

In event-driven architectures, the ability to respond to events as they happen is paramount. Whether you are building sophisticated monitoring and alerting systems for critical applications like fraud detection, anomaly detection, or customer engagement systems like marketing automation, RisingWave provides the real-time capabilities you need.

### Example: Fraud detection system

Imagine building a fraud detection system that monitors credit card transactions. You want to trigger an alert when a credit card is used more than five times within a short period for purchases exceeding a certain amount.

1. Connect to Kafka <br />

  Ingest the transaction data from Kafka.  
  ```sql
  CREATE SOURCE transactions (
    card_number varchar,
    purchase_amount double precision,
    purchase_time timestamptz
  ) WITH (
    connector='kafka',
    topic='credit_card_transactions',
    properties.bootstrap.server='localhost:9092',
    scan.startup.mode='earliest',
  ) FORMAT PLAIN ENCODE JSON;
  ``` 
2. Define the event logic <br />

  Create a materialized view that tracks suspicious activity for cards that are used more than five times within five minutes and have a total purchase amount over 5000.     
  ```sql
  CREATE MATERIALIZED VIEW suspicious_transactions AS
    SELECT
      card_number,
      COUNT(*) AS transaction_count,
      SUM(purchase_amount) AS total_spent
    FROM TUMBLE(transactions, purchase_time, INTERVAL '5 MINUTES')
    GROUP BY card_number, window_end
    HAVING COUNT(*) > 5 AND SUM(purchase_amount) > 5000;
  ```  
3. Send alerts <br />

  Deliver the results to another Kafka topic or directly trigger alerts. 
  ```sql
  CREATE SINK suspicious_activity FROM suspicious_transactions
  WITH (
    connector='kafka',
    properties.bootstrap.server='localhost:9092',
    topic='suspicious_activity'
    ) FORMAT PLAIN ENCODE JSON;
  ```
    
By leveraging RisingWave, you can implement real-time monitoring and alerting systems that react instantly to critical events, enhancing security and operational efficiency.

## Real-time data enrichment

Real-time data enrichment is essential in scenarios where raw data needs to be augmented with additional context before being processed further. This is particularly useful for industries like finance, e-commerce, and ad tech, where combining real-time data streams with historical or reference data can significantly enhance decision-making.

### Example: Real-time customer personalization in E-Commerce

Imagine running an e-commerce platform and wanting to personalize customer experiences in real-time. As customers browse your site, you collect clickstream data and combine it with historical purchase data to offer personalized recommendations instantly.

1. Ingest real-time clickstream data <br />

  Connect RisingWave to your clickstream data from Kafka and your historical data source from PostgreSQL.   
  ```sql
  CREATE SOURCE clickstream_data (
    user_id varchar,
    page_url varchar,
  ) WITH (
    connector='kafka',
    topic='clickstream_data',
    properties.bootstrap.server='localhost:9092',
    scan.startup.mode='earliest',
  ) FORMAT PLAIN ENCODE JSON;

  CREATE SOURCE historical_customer_data WITH (
    connector = 'postgres-cdc',
    hostname = '127.0.0.1',
    port = '8306',
    username = 'root',
    password = '123456',
    database.name = 'mydb',
    slot.name = 'mydb_slot'
  );

  CREATE TABLE purchase_history (
    user_id varchar primary key,
    recommended_produce varchar,
    category varchar
  ) FROM historical_customer_data TABLE 'my_schema.customer_purchases';
  ```  
2. Enrich data with historical purchases <br />

  Join the real-time clickstream data with historical purchase data to generate personalized product recommendations.
  ```sql
  CREATE MATERIALIZED VIEW personalized_recommendations AS
    SELECT
      c.user_id,
      c.page_url,
      p.recommended_product,
      p.category
    FROM clickstream_data c
    JOIN purchase_history p ON c.user_id = p.user_id
    WHERE c.page_url LIKE '%product%';
  ```   
3. Deliver personalized recommendations <br />

  Send the enriched data to the recommendation engine for immediate use. 
  ```sql
  CREATE SINK recommendations FROM personalized_recommendations
    WITH (
      connector='kafka',
      properties.bootstrap.server='localhost:9092',
      topic='recommendations'
    ) FORMAT PLAIN ENCODE JSON;
  ```

RisingWave empowers you to enhance customer experiences in real-time by enriching raw data with valuable context, leading to more accurate and effective personalization.

## Feature engineering

Feature engineering is the process of creating feature vectors from raw data, which are essential inputs for machine learning models. In industries like ad tech, where predicting user behavior in real-time is crucial, generating accurate feature vectors from streaming data can significantly enhance the performance of your models.

### Example: Real-time ads bidding

In the context of online advertising, predicting the optimal bidding price for ad slots is a key challenge. By using the previous day's bidding data, you can build feature vectors that help predict future bidding prices in real-time.

1. Ingest previous day’s bidding data <br />

  Start by ingesting the previous day's bidding data from Kafka into RisingWave.   
  ```sql
  CREATE SOURCE bidding_data (
    ad_id varchar,
    bid_amount double precision,
    bid_count integer,
    bid_won boolean,
    response_time interval,
    event_time timestamptz
  ) WITH (
    connector='kafka',
    topic='bidding_data',
    properties.bootstrap.server='localhost:9092',
    scan.startup.mode='earliest',
  ) FORMAT PLAIN ENCODE JSON;
  ```
2. Build feature vectors <br />

  Create feature vectors that capture important attributes such as average bid amount, maximum bid, and bid frequency. These features will be used to train your model and make predictions.  
  ```sql
  CREATE MATERIALIZED VIEW bidding_feature_vectors AS
    SELECT
      ad_id,
      AVG(bid_amount) AS avg_bid,
      MAX(bid_amount) AS max_bid,
      COUNT(*) AS bid_count,
      SUM(CASE WHEN bid_won THEN 1 ELSE 0 END) AS win_count,
      AVG(response_time) AS avg_response_time
    FROM bidding_data
    WHERE event_time >= NOW() - INTERVAL '1 day'
    GROUP BY ad_id;
  ```
3. Use feature vectors for prediction <br />

  These feature vectors can then be used by your machine learning model to predict the optimal bid for future ad slots. 
  ```sql
  SELECT * FROM bidding_feature_vectors WHERE ad_id = 'specific_ad_id';
  ```
4. Real-time inference <br />

  As new bidding data arrives, you can continuously update your feature vectors and use them for real-time inference, ensuring your bids are always informed by the most recent data. For instance, you can create a [User-defined function](/sql/udf/user-defined-functions.md), `PREDICT_BID`, that predicts the next bid given the most recent data.
  ```sql
  CREATE MATERIALIZED VIEW live_predictions AS
    SELECT
      ad_id,
      PREDICT_BID(avg_bid, max_bid, bid_count, win_rate, avg_response_time) AS predicted_bid
    FROM bidding_feature_vectors;
  ```
    
RisingWave enables the seamless creation and updating of feature vectors from streaming data, ensuring that your machine learning models are always working with the most relevant and up-to-date information for real-time ad bidding.