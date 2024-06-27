---
id: project-monitor-materialized-views
title: Monitor materialized views
description: You can view all materialized views defined in the databases of a project.
slug: /monitor-materialized-views
---

You can view all [materialized views](/docs/current/key-concepts/#materialized-views) defined in the databases of a project.

1. Go to the [project details page](project-check-status-and-metrics.md#check-project-details).

2. Select the **Workspace** > **Materialized Views** tab.

    <img
    src={require('./images/cluster-details-mv.png').default}
    alt="Materilized Views in cluster details"
    />
    
3. Click on a materialized view to see the details.

    You can view the direct acyclic graph of streaming executors for maintaining the materialized view. 

    <img
    src={require('./images/mv-graph.png').default}
    alt="Direct acyclic graph"
    />

4. You can click **< \> SQL** to see the query defined in the materialized view (i.e. the `AS` clause).

    <img
    src={require('./images/mv-graph-sql.png').default}
    alt="SQL details of a materialized view"
    />