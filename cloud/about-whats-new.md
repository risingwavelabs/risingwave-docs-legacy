---
id: about-whats-new
title: What's new?
description: What's new in RisingWave Cloud?
slug: /whats-new
---

# What's new?

Keep up with the latest updates on RisingWave Cloud.

## July 2024

Here are the notable new features and changes we introduced to RisingWave Cloud in July.

### Launching Azure

RisingWave Cloud now supports both hosted service and BYOC deployment on the Azure platform. You can now connect hosted RisingWave clusters with Azure-hosted services via Azure Private Link, or a BYOC project in your Azure account. If your desired region on Azure is not available yet, please contact our sales at [sales@risingwave-labs.com](mailto:sales@risingwave-labs.com) for a PoC request.


### BYOC project CA certificate

Different from hosted services, each BYOC environment is equipped with one unique CA certification to establish an SSL connection between all RisingWave projects in this BYOC environment and the psql client. If you have downloaded the CA cert for hosted projects before, make sure to re-download it following the instructions in the cloud portal.

<img
  src={require('./images/cloud-updates/byoc-ca-cert.png').default}
  alt="Download CA certificate in BYOC environment"
/>

### New source wizards

We added three more connector wizards, namely MongoDB CDC, AWS S3, and Google Cloud storage, to help our users build their sources without writing any SQL statements. To request more connector wizards, please contact us. 


## June 2024

Here are the notable new features and changes we introduced to RisingWave Cloud in June.

### Introducing projects

We have reorganized some core concepts in RisingWave for better clarity and user experience. From June, RisingWave Cloud is introducing projects as the central concept of building applications. Each project is connected to its own plan, computational resources, database users, and related functionalities. To get started with RisingWave Cloud, you will need to create a new plan. Currently, RisingWave Cloud offers three plans: Developer, Pro, and Enterprise. 

<img
  src={require('./images/cloud-updates/june-dashboard.png').default}
  alt="RisingWave Cloud New Dashboard"
/>

Inside each project, RisingWave Cloud lists all functionalities available for this plan. We will add more functionalities to different plans in the future. 

<img
  src={require('./images/cloud-updates/june-projects.png').default}
  alt="RisingWave Cloud New Dashboard"
/>

For current RisingWave Cloud customers, their existing clusters will be automatically transferred to a project with its corresponding plan. 

### Progress tab in the workspace

One pain point our customers frequently mention is that it is hard to understand the progress of the created materialized views. As a first step towards resolving this issue, we add a progress tab in the workspace. After running a create materialized view command in the workspace, the progress tab will demonstrate the current progress of all materialized views created in the background. 

<img
  src={require('./images/cloud-updates/june-workspace.png').default}
  alt="RisingWave Cloud New Dashboard"
/>

### Role-based access control

As a part of enterprise-level security management, RisingWave Cloud now supports role-based access control for cloud users. Among RisingWave Cloud users in the organization, each user is associated with a pre-defined role. The organization administrator will have permission to edit the roles of all the members, whereas other members will have access to different subsystems depending on their roles. In the future, we will add editable roles to allow administrators to define their customized roles. 

<img
  src={require('./images/cloud-updates/june-roles.png').default}
  alt="RisingWave Cloud New Dashboard"
/>