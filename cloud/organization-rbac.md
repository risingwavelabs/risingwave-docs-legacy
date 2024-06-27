---
id: organization-rbac
title: Role-based access control (RBAC)
description: Support role-based access control for cloud users.
slug: /organization-rbac
---

As a part of enterprise-level security management, RisingWave Cloud now supports role-based access control for cloud users. Among RisingWave Cloud users in the organization, each user is associated with a pre-defined role. The organization administrator will have permission to edit the roles of all the members, whereas other members will have access to different subsystems depending on their roles.

## Service accounts and users

The role-based access control system applies both user and service accounts. Users and service accounts are the entities that can be authenticated, then authorized to perform operations in the database.

Although users and service accounts look similar, they are fundamentally different:

A user generally belongs to an individual. Individuals are often part of a team or a department of an organization.

A service account generally belongs to an org. A service account is suited for an application accessing the database.

## Roles

### OrganizationAdmin

As an `OrganizationAdmin`
I have access to:
    - All operations on tenants and tenants related resources
    - All operations on service accounts, users, invitations, role management (for role bindings)
    - All operations on any billing resources
- but do NOT have access to:
    - My own admin role binding

### OrganizationMember

As an OrganizationMember

- I have access to:
    - View all the tenants
    - View all the service accounts, users, invitations
- I do NOT have access to:
    - Any tenants related operation, including update, create, delete
    - Operations on service accounts, users, invitations, including update, create, delete
    - any billing resources


### BillingManager

As an BillingMember

- I have access to:
    - All the operations on billing resources
- I do NOT have access to:
    - Any other operations

### ProjectAdmin

As an ProjectAdmin:

- I have access to:
    - All the operations on any tenants.
- I do NOT have access to:
    - Operations on billings, service accounts, users, invitations
    