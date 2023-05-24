---
id: connector-amazon-msk
title: Ingest data from Amazon MSK
description: Ingest data from Amazon MSK.
slug: /connector-amazon-msk
---

Amazon Managed Streaming for Apache Kafka (MSK) is a fully managed service that simplifies the setup, scaling, and management of Apache Kafka clusters, a popular open-source distributed streaming platform. Kafka is designed to handle real-time data feeds and follows the publisher-subscriber (pub-sub) model. Kafka's ability to handle high-volume real-time data makes it crucial for data pipelines, analytics, and event-driven architectures.

To ingest data from Amazon MSK into RisingWave, you need an operational Amazon MSK cluster and a Kafka topic established. Once set, you'll leverage the Kafka connector in RisingWave to consume data from your MSK topic.

This guide will detail the ingesting streaming data from Amazon MSK into RisingWave, enabling powerful and real-time data analytics in your workflows.



## Set up Amazon MSK

To learn about how to set up an Amazon MSK account and create a cluster, see [Getting started using Amazon MSK](https://docs.aws.amazon.com/msk/latest/developerguide/getting-started.html). For this demo, we will assume the selection of **Quick create** for the **Cluster creation method** and **Provisioned** for the **Cluster type**. The cluster creation can take about 15 minutes.

Once you have created a cluster, note down the following information regarding the cluster you want to connect to.

1. Get the **VPC** value from the **All cluster settings** before clicking **Create cluster**.

2. Get the **Security groups associated with VPC** from the **All cluster settings** before clicking **Create cluster**.

3. Get the **ARN** value from the **Cluster summary** after clicking on **Create cluster**.


To customize the IAM policy, see [IAM access control](https://docs.aws.amazon.com/msk/latest/developerguide/iam-access-control.html).




## Set up EC2 on AWS

To learn how to create an EC2 client machine and add the security group of the client to the inbound rules of the cluster's security group from the VPC console, see [Create a client machine](https://docs.aws.amazon.com/msk/latest/developerguide/create-client-machine.html).





## Configure MSK Kafka


### Enable SASL

1. Access the [Amazon MSK console](https://console.aws.amazon.com/msk/) and select the MSK cluster.

2. Click on the **Properties** tab, and click **Edit** in the **Security settings** section.

3. Click the **SASL/SCRAM authentication** checkbox and click **Save changes**.

For more information regarding SASL settings, see Sign-in credentials authentication with AWS Secrets Manager.



### Create a symmetric key

1. Access the [AWS Key Management Service (AWS KMS) console](https://console.aws.amazon.com/kms).

2. Click **Create Key**, select **Symmetric**, and click **Next**.

3. Give the key an **Alias** and click **Next**.

4. Under **Administrative permissions**, select the **AWSServiceRoleForKafka** checkbox and click **Next**.

5. Under **Key usage permissions**, again select the **AWSServiceRoleForKafka** checkbox and click **Next**.

6. Lastly, review the details and click **Finish**.

For more information, see [Creating symmetric encryption KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html#create-symmetric-cmk).




### Store a new Secret

1. Access the [AWS Secrets Manager console](https://console.aws.amazon.com/secretsmanager/).

2. Click **Store a new secret**.

3. Under **Secret type**, select **Other type of secret**.

4. Under **Key/value pairs**, click on **Plaintext**, paste the following in the space below, and replace `<your-username>` and `<your-password>` with the username and password you want to set for the cluster.

```
 {
    "username": "<your-username>",
    "password": "<your-password>"
  }
```

5. Under **Encryption key**, select the symmetric key alias you previously created.

6. On the next page, enter a **Secret name** that starts with `AmazonMSK_`.

7. After creating the secret, record the **Secret ARN (Amazon Resource Name)** value.

For more information, see [Sign-in credentials authentication with AWS Secrets Manager](https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html).




### Link the Secret with the MSK cluster

1. Access the [Amazon MSK console](https://console.aws.amazon.com/msk/) and select the MSK cluster.

2. Click the **Actions** tab and select **Edit security settings**.

3. Click to select the **SASL/SCRAM authentication** checkbox and click **Save changes**.

4. Back on the main page, click the **Properties** tab, and in the **Security settings** section, under **SASL/SCRAM authentication**, click **Associate secrets**.

5. Paste the **Secret ARN** value you recorded in the previous step and click **Associate secrets**.




### Use SSH to log into the EC2 machine

```
ssh -i “xxx.pem" ubuntu@ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com
```

To find your specific command values: 

1. Access the [EC2 console](https://console.aws.amazon.com/ec2/) and select the instance you created.

2. Click **Connect**, select the **SSH client** tab, and copy the command example provided.




### Install AWS CLI and Java

```terminal
sudo apt install unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
sudo apt install openjdk-8-jdk -y
```



### Download Kakfa client

```terminal
wget https://archive.apache.org/dist/kafka/2.6.2/kafka_2.12-2.6.2.tgz
tar -xzf kafka_2.12-2.6.2.tgz
```



### Configure AWS IAM credentials on EC2


1. Run the following command.

```terminal
aws configure
```

2. Place the `users_jaas.conf` with the following contents in `/home/ubuntu`.

```
KafkaClient {
org.apache.kafka.common.security.scram.ScramLoginModule required
  username="<your-username>"
  password="<your-password>";
};
```

3. Run the following command.

```terminal
export KAFKA_OPTS=-Djava.security.auth.login.config=/home/ubuntu/users_jaas.conf
```



4. Use the following command to copy the JDK key store file from your JVM `cacerts` folder into the `kafka.client.truststore.jks` copy.

```terminal
cp /usr/lib/jvm/java-1.8.0-openjdk-amd64/jre/lib/security/cacerts ~/kafka.client.truststore.jks
```


5. Create `client_sasl.properties` at `/home/ubuntu` with the following contents.

```
security.protocol=SASL_SSL
sasl.mechanism=SCRAM-SHA-512
ssl.truststore.location=/home/ubuntu/kafka.client.truststore.jks
```



### Create a topic using the broker address with SASL


1. Access the [Amazon MSK console](https://console.aws.amazon.com/msk/) and select the cluster.

2. Click **View client information** and copy the URL under **Private endpoint** for **SASL/SCRAM**. This will be your `<broker-url>` from now on.

3. Run the following command using the `<broker-url>`.

```terminal
bin/kafka-topics.sh --bootstrap-server <broker-url> --command-config ~/client_sasl.properties --create --topic <topic-name>
```

4. List the topics.

```terminal
bin/kafka-topics.sh --bootstrap-server <broker-url> --list --command-config ~/client_sasl.properties
```

5. Insert test data.

```terminal
bin/kafka-console-producer.sh --bootstrap-server <broker-url> --topic <topic-name> --producer.config ~/client_sasl.properties
```

6. Open another console and consume the message.

```terminal
bin/kafka-console-consumer.sh --bootstrap-server <broker-url> --topic <topic-name> --consumer.config ~/client_sasl.properties --from-beginning
```





## Consume data from Amazon MSK in RisingWave


### Install and launch RisingWave

See the [Get started](https://pr-878.d2fbku9n2b6wde.amplifyapp.com/docs/upcoming/get-started/) guide for options on how you can run RisingWave.


### Download Kafka workload from GitHub and write to Kafka

```terminal
wget https://raw.githubusercontent.com/risingwavelabs/risingwave/main/scripts/source/test_data/kafka_4_partition_topic_with_100_message.4
	bin/kafka-console-producer.sh --bootstrap-server <broker-url> --topic <topic-name> --producer.config ~/client_sasl.properties < kafka_4_partition_topic_with_100_message.4
```


### Connect the cluster


```terminal
psql -h localhost -p 4566 -d dev -U root
```


### Create a source in RisingWave

To learn about the specific syntax used to consume data from a Kafka topic, see [Ingest data from Kafka](https://pr-878.d2fbku9n2b6wde.amplifyapp.com/docs/upcoming/create-source-kafka/).

For example, the following query creates a materialized source that consumes data from an MSK topic connected to Kafka.


```sql
create materialized source s (v1 int, v2 varchar) with (
  connector = 'kafka', topic = '<topic-name>', 
  properties.bootstrap.server = '<broker-url>', 
  scan.startup.mode = 'earliest', 
  properties.sasl.mechanism = 'SCRAM-SHA-512', 
  properties.security.protocol = 'sasl_ssl', 
  properties.sasl.username = '<your-username>', 
  properties.sasl.password = ‘<your-password>’'
) row format json;
```

Then, you can count the records for accuracy.

```sql
SELECT * FROM s;
```
