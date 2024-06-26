---
id: about-whats-new
title: What's new?
description: What's new in RisingWave Cloud?
slug: /whats-new
---

# What's new?

Keep up with the latest updates on RisingWave Cloud.

## June 2024

Here are the notable new features and changes we introduced to RisingWave Cloud in June.

### Introducing projects

We have reorganized some core concepts in RisingWave for better clarity and user experience. From June, RisingWave Cloud introduces projects as the central concept of building applications. Each project is associated with its plan, its computational resources, its database users, and its associated functionalities. To get started with RisingWave Cloud, you will need to create a new plan by default. Currently, RisingWave Cloud offers three plans: Developer, Pro, and Enterprise. 

<img
  src={require('./images/cloud-updates/june-dashboard.png').default}
  alt="RisingWave Cloud New Dashboard"
/>

Inside each project, RisingWave Cloud lists all functionalities available in this plan. We will add more functionalities soon to different plans in the future. 

<img
  src={require('./images/cloud-updates/june-projects.png').default}
  alt="RisingWave Cloud New Dashboard"
/>

For our existing RisingWave Cloud customers, their existing clusters will be automatically transferred to a project with its corresponding plan. 

### Progress tab in the workspace

One pain point that our customers frequently mention is hard to understand the progress of the created materialized views. As a first step towards resolving this issue, we add a progress tab in the workspace. After running a create materialized view command in the workspace, the progress tab will demonstrate the current running progress of all materialized views created in the background. 

<img
  src={require('./images/cloud-updates/june-workspace.png').default}
  alt="RisingWave Cloud New Dashboard"
/>

### Role-based access control

As a part of enterprise-level security management, RisingWave Cloud now supports role-based access control for cloud users. Among RisingWave Cloud users in the organization, each user is associated with a pre-defined role. The organization administrator will have permission to edit the roles of all the members, whereas other members will have access to different subsystems depending on their roles. We will add editable roles to allow administrators to define their customized roles in the future. 

<img
  src={require('./images/cloud-updates/june-roles.png').default}
  alt="RisingWave Cloud New Dashboard"
/>