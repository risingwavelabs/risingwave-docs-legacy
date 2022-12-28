---
id: grafana-integration
title: Visualize RisingWave data in Grafana
description: Visualize RisingWave data in Grafana
slug: /grafana-integration
---

Grafana is an open-source analytics and visualization web application. It is well suited for time-series data as well as application and server monitoring. 

This guide will go over how to add RisingWave as a data source in Grafana. 

## Prerequisites

### Install and launch RisingWave

To install and start RisingWave locally, see the [Get started](../docs/get-started.md) guide. We recommend running RisingWave locally for testing purposes. 

Connect to streaming sources. For details on connecting to a streaming source and what connectors are supported with RisingWave, see [CREATE SOURCE](../docs/sql/commands/sql-create-source.md).

### Install and launch Grafana

To install Grafana locally, see the [Install Grafana](https://grafana.com/docs/grafana/latest/setup-grafana/installation/) guide. Next, to start Grafana, follow the **Sign in to Grafana** step of the [Build your first dashboard](https://grafana.com/docs/grafana/latest/getting-started/build-first-dashboard/) guide. 

## Establish a connection between RisingWave and Grafana

### Add RisingWave as a data source

1. Go to **Configuration > Data source**.
2. Click the **Add data source** button.
3. Select **PostgreSQL** from the list of supported databases.
4. Fill in the **PostgreSQL Connection** fields like so:

<img
  src={require('../images/grafana-integration.png').default}
  alt="Connect to RW database in Grafana"
/>

:::note 

If both RisingWave and Grafana are started locally, the host domain can be either **localhost:4566** or **127.0.0.1:4566**.

If you are running Grafana Cloud, the host domain should be your computer’s public IP address.

:::

5. Click **Save & test**.

For this guide, we connected to RisingWave with the `root` user. In production, it is recommended to use a dedicated read-only user when querying the database using Grafana.

To add a new read-only user, use the following SQL query:

```sql
CREATE USER grafanareader WITH PASSWORD 'password';
```

Then, when adding RisingWave as a database, fill in the **User** and **Password** fields with the name and password of the new user created. For more details on creating a user, see the [CREATE USER](../docs/sql/commands/sql-create-user.md) command. 

To allow the read-only user to query from a materialized view, use the following SQL query:

```sql
GRANT SELECT ON MATERIALIZED VIEW mv_name TO grafanareader;
```

See the [GRANT](../docs/sql/commands/sql-grant.md) command for more details.

Now that RisingWave is added as a database, you can start creating dashboards within Grafana using the data in RisingWave. For an extensive tutorial that covers how to create dashboards in Grafana with data queried from RisingWave, check out the [Use RisingWave to monitor RisingWave metrics](../docs/tutorials/monitor-rw-metrics.md) tutorial, which uses a demo cluster so you can easily try it out on your device.