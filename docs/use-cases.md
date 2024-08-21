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

- **Streaming analytics**
- **Event-driven applications**
- **Real-time data enrichment**
- **Feature engineering**

This article will explore these use cases in detail, complete with practical examples to demonstrate how RisingWave can be effectively utilized.

## Streaming analytics

Consider scenarios like stock trading, sports betting, IoT monitoring, or other domains where you are dealing with high-velocity event streams from APIs, sensors, Kafka, or other sources. The need to continuously analyze this data is crucial for detecting buy or sell opportunities in financial markets, monitoring real-time sensor data for anomalies, or tracking live sports events for betting insights. In such cases, the analysis must be both fresh and consistent, ensuring that decisions are made based on the most current information.

### Example: Stock trading analytics

Take stock trading as an example. Imagine you want to analyze real-time market data to identify potential trading opportunities. Suppose your data is streaming from Kafka. Here is how RisingWave can streamline this process.

1. Connect to Kafka
Begin by connecting RisingWave to your Kafka topic to ingest the live market data.
    
    ```sql
    CREATE SOURCE stock_trades
    WITH (
        KAFKA BROKERS = 'localhost:9092',
        TOPIC = 'stock_trades',
        FORMAT = 'json'
    );
    
    ```
    
2. Express analytics logic in materialized views
Define your analytics logic using SQL in materialized views. For instance, you might want to detect price movements that indicate a buy or sell signal.
    
    ```sql
    CREATE MATERIALIZED VIEW buy_signals AS
    SELECT symbol, price, volume
    FROM stock_trades
    WHERE price > 100 AND volume > 1000;
    
    ```
    
3. Check the result
Query the materialized view to get real-time insights on potential buy signals.
    
    ```sql
    SELECT * FROM buy_signals;
    ```
    

With RisingWave, you can efficiently process and analyze streaming data in real-time, enabling timely and informed decision-making.

## Event-driven applications

In event-driven architectures, the ability to respond to events as they happen is paramount. Whether you are building sophisticated monitoring and alerting systems for critical applications like fraud detection, anomaly detection, or customer engagement systems like marketing automation, RisingWave provides the real-time capabilities you need.

### Example: Fraud detection system

Imagine building a fraud detection system that monitors credit card transactions. You want to trigger an alert when a credit card is used more than five times within a short period for purchases exceeding a certain amount.

1. Connect to Kafka
Ingest the transaction data from Kafka.
    
    ```sql
    CREATE SOURCE transactions
    WITH (
        KAFKA BROKERS = 'localhost:9092',
        TOPIC = 'credit_card_transactions',
        FORMAT = 'json'
    );
    
    ```
    
2. Define the event logic
Create a materialized view that tracks suspicious activity.
    
    ```sql
    CREATE MATERIALIZED VIEW suspicious_transactions AS
    SELECT card_number, COUNT(*) AS transaction_count, SUM(amount) AS total_spent
    FROM transactions
    GROUP BY card_number
    HAVING COUNT(*) > 5 AND SUM(amount) > 1000;
    
    ```
    
3. Send alerts
Deliver the results to another Kafka topic or directly trigger alerts.
    
    ```sql
    CREATE SINK alert_sink
    WITH (
        KAFKA BROKERS = 'localhost:9092',
        TOPIC = 'fraud_alerts'
    ) AS
    SELECT card_number, transaction_count, total_spent
    FROM suspicious_transactions;
    
    ```
    

By leveraging RisingWave, you can implement real-time monitoring and alerting systems that react instantly to critical events, enhancing security and operational efficiency.

## Real-time data enrichment

Real-time data enrichment is essential in scenarios where raw data needs to be augmented with additional context before being processed further. This is particularly useful for industries like finance, e-commerce, and ad tech, where combining real-time data streams with historical or reference data can significantly enhance decision-making.

### Example: Real-time customer personalization in E-Commerce

Imagine running an e-commerce platform and want to personalize customer experiences in real-time. As customers browse your site, you collect clickstream data and combine it with historical purchase data to offer personalized recommendations instantly.

1. Ingest real-time clickstream data
Connect RisingWave to your clickstream data source.
    
    ```sql
    CREATE SOURCE clickstream_data
    WITH (
        KAFKA BROKERS = 'localhost:9092',
        TOPIC = 'clickstream_data',
        FORMAT = 'json'
    );
    
    ```
    
2. Enrich data with historical purchases
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
    
3. Deliver personalized recommendations
Send the enriched data to the recommendation engine for immediate use.
    
    ```sql
    CREATE SINK recommendations_sink
    WITH (
        KAFKA BROKERS = 'localhost:9092',
        TOPIC = 'personalized_recommendations'
    ) AS
    SELECT * FROM personalized_recommendations;
    
    ```
    

RisingWave empowers you to enhance customer experiences in real-time by enriching raw data with valuable context, leading to more accurate and effective personalization.

## Feature engineering

Feature engineering is the process of creating feature vectors from raw data, which are essential inputs for machine learning models. In industries like ad tech, where predicting user behavior in real-time is crucial, generating accurate feature vectors from streaming data can significantly enhance the performance of your models.

### Example: Real-time ads bidding

In the context of online advertising, predicting the optimal bidding price for ad slots is a key challenge. By using the previous day's bidding data, you can build feature vectors that help predict future bidding prices in real-time.

1. Ingest previous day’s bidding data
Start by ingesting the previous day's bidding data from Kafka into RisingWave.
    
    ```sql
    CREATE SOURCE bidding_data
    WITH (
        KAFKA BROKERS = 'localhost:9092',
        TOPIC = 'bidding_data',
        FORMAT = 'json'
    );
    
    ```
    
2. Build feature vectors
Create feature vectors that capture important attributes such as average bid amount, maximum bid, and bid frequency. These features will be used to train your model and make predictions.
    
    ```sql
    CREATE MATERIALIZED VIEW bidding_feature_vectors AS
    SELECT
        ad_id,
        AVG(bid_amount) AS avg_bid,
        MAX(bid_amount) AS max_bid,
        COUNT(*) AS bid_count,
        SUM(CASE WHEN bid_won THEN 1 ELSE 0 END) AS win_rate,
        AVG(response_time) AS avg_response_time
    FROM bidding_data
    WHERE event_time >= NOW() - INTERVAL '1 day'
    GROUP BY ad_id;
    
    ```
    
3. Use feature vectors for prediction
These feature vectors can then be used by your machine learning model to predict the optimal bid for future ad slots.
    
    ```sql
    SELECT * FROM bidding_feature_vectors WHERE ad_id = 'specific_ad_id';
    
    ```
    
4. Real-time inference
As new bidding data arrives, you can continuously update your feature vectors and use them for real-time inference, ensuring your bids are always informed by the most recent data.
    
    ```sql
    CREATE MATERIALIZED VIEW live_predictions AS
    SELECT
        ad_id,
        PREDICT_BID(avg_bid, max_bid, bid_count, win_rate, avg_response_time) AS predicted_bid
    FROM bidding_feature_vectors;
    
    ```
    

RisingWave enables the seamless creation and updating of feature vectors from streaming data, ensuring that your machine learning models are always working with the most relevant and up-to-date information for real-time ad bidding.