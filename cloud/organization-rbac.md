---
id: organization-rbac
title: Role-based access control (RBAC)
description: Support role-based access control for cloud users.
slug: /organization-rbac
---

In RisingWave Cloud, Role-based access control (RBAC) system empowers organizations to precisely manage access permissions based on their roles. Among RisingWave Cloud users in the organization, each user is associated with a pre-defined role. The organization administrator will have permission to edit the roles of all the members, whereas other members will have access to different subsystems depending on their roles.

## Security principal

A security principal refers to an entity that is authenticated and authorized to perform various operations and access resources in RisingWave Cloud. You can assign a role to any of these security principals:

- Service account: Typically represents an application. It accesses RisingWave Cloud resources on the application's behalf, using API keys for authentication.

- User: Typically represents an individual user who interacts with resources via the user interface.

## Role permissions and limitations

Below are permissions and limitations for roles to ensure that each service account or user has appropriate access tailored to their responsibilities.

| Role              | Permissions                                                                                             | Limitations                                                                                                                      |
|-------------------|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| OrganizationAdmin | <ul><li>Full control over tenants and related resources.</li><li>Management of service accounts, users, invitations, and RoleBinding.</li><li>Access to all billing resources.</li></ul> | <ul><li>Cannot modify their own admin RoleBinding.</li></ul>                                                                      |
| OrganizationMember| <ul><li>View access to all tenants.</li><li>View service accounts, users, and invitations.</li></ul>       | <ul><li>No permissions for tenant-related operations (create, update, delete).</li><li>No permissions for service accounts, users, or invitations operations (create, update, delete).</li><li>No access to billing resources.</li></ul> |
| BillingManager    | <ul><li>Full access to all billing resources.</li></ul>                                                   | <ul><li>No access to any other operations outside of billing.</li></ul>                                                            |
| ProjectAdmin      | <ul><li>Full access to operations related to any tenants.</li></ul>                                       | <ul><li>No access to billing operations, service accounts, users, or invitations.</li></ul>                                       |


## RoleBinding

RoleBindings ensure that only authorized entities have access to resources and operations based on their defined roles.

### Prerequisite

Only the OrganizationAdmin has the permission to manage user's RoleBinding.

### Scenario

| User scenarios                             | Description                                                                                                                                                                      |
|--------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Invite a user to the organization               | Currently, you can only invite a new user as an OrganizationMember. If you want to grant more permissions to the target user, please go to **Organization** > **Role management** > **Users** to modify after the user accepts the invitation.                                     |
| Create a service account in the organization      | The service account RoleBinding is used for authorization when accessing Cloud APIs using the service account's API keys. By default, the service account is assigned the read-only OrganizationMember role. If you need to assign more permissions to the service account, please go to **Organization** > **Role management** > **Service Accounts** to add other roles. |
| Delete or add RoleBinding for a user       | Go to **Organization** > **Role management** > **Users**, click the corresponding `Edit Roles` of the specific role. A popup window will appear, allowing you to uncheck the role or select the new ones. Click **Confirm** to save the change. |
| Delete or add RoleBinding for the service account | Go to **Organization** > **Role management** > **Users**, click the corresponding `Edit Roles` of the specific service account. A popup window will appear, allowing you to uncheck the role or select the new ones. Click **Confirm** to save the change. |

:::note
Every organization needs at least one OrganizationAdmin user. Any attempt to delete the last OrganizationAdmin RoleBinding will fail.
:::
