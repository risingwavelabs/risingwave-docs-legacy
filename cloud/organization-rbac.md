---
id: organization-rbac
title: Role-based access control (RBAC)
description: Support role-based access control for cloud users.
slug: /organization-rbac
---

In RisingWave Cloud, Role-based access control (RBAC) system empowers organizations to precisely manage access permissions based on their roles. Among RisingWave Cloud users in the organization, each user is associated with a pre-defined role. The organization administrator will have permission to edit the roles of all the members, whereas other members will have access to different subsystems depending on their roles.

## Service accounts and users

RBAC in RisingWave Cloud applies to both service accounts and users. These entities are authenticated and authorized to perform operations within the RisingWave Cloud platform.

Service accounts and users have distinct purposes:

- Service accounts: Typically represents an application. It accesses RisingWave Cloud resources on the application's behalf, using API keys for authentication.

- Users: Typically represents an individual user who interacts with resources via the user interface.

## Role permissions and limitations

Below are permissions and limitations for roles to ensure that each service account or user has appropriate access tailored to their responsibilities.

### OrganizationAdmin

**Permissions:**

- Full control over tenants and related resources.
- Management of service accounts, users, invitations, and role bindings.
- Access to all billing resources.

**Limitations:**

- Cannot modify their own admin role bindings.

---

### OrganizationMember

**Permissions:**

- View access to all tenants.
- View service accounts, users, and invitations.

**Limitations:**

- No permissions for tenant-related operations (create, update, delete).
- No permissions for service accounts, users, or invitations operations (create, update, delete).
- No access to billing resources.

---

### BillingManager

**Permissions:**

- Full access to all billing resources.

**Limitations:**

- No access to any other operations outside of billing.

---

### ProjectAdmin

**Permissions:**

- Full access to operations related to any tenants.

**Limitations:**

- No access to billing operations, service accounts, users, or invitations.

## RoleBinding

A RoleBinding binds a set of permissions defined in a role to a user or service account within a specific namespace. Essentially, it connects a role to subjects (such as users) to grant permissions. RoleBindings are used to enforce RBAC policies and ensure that only authorized entities have access to resources and operations based on their defined roles.

xxx