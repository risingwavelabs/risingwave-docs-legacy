---
 id: ingest-from-neon-cdc
 title: Ingest data from Neon CDC
 description: Describes how to ingest data from Neon CDC.
 slug: /ingest-from-postgres-cdc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-neon-cdc/" />
</head>

Neon is a Serverless Postgres designed for the cloud that separates compute and storage to offer modern developer features such as autoscaling, branching, bottomless storage, and others.

Follow these steps to install PostgreSQL from Neon:

## 1. Sign Up for a Neon Cloud Account

Start by signing up for a free Neon Cloud account, which will grant you access to PostgreSQL services. To create your account, visit [Neon Cloud Account](https://console.neon.tech/sign_in).

## 2. Create Your First Neon Project

Navigate to the Neon Console and select "Create a project." Assign a name and region to your first Neon PostgreSQL project. You will be presented with connection details for your Neon project, so be sure to save them for later use when connecting to your PostgreSQL server.

## 3. Connect to the Neon PostgreSQL Server

You can connect to Neon through Neon's SQL Editor, psql, or from other clients or applications.

For more information about Neon, please refer to [Neon's official documentation](https://neon.tech/docs/introduction).
