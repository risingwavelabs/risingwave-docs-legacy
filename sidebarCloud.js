module.exports = {
  CloudSidebar: [
    {
      type: "category",
      label: "About",
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "about-whats-risingwave-cloud",
        },
        {
          type: "doc",
          id: "about-whats-new",
        },
        {
          type: "doc",
          id: "about-faq",
        },
      ],
    },
    {
      type: "category",
      label: "Quickstart",
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: "doc",
          id: "quickstart",
          label: "Get started in 5 steps",
        },
        {
          type: "link",
          label: "1. Sign up and log in",
          href: "/cloud/quickstart/?step=1",
        },
        {
          type: "link",
          label: "2. Create a cluster",
          href: "/cloud/quickstart/?step=2",
        },
        {
          type: "link",
          label: "3. Connect to a cluster",
          href: "/cloud/quickstart/?step=3",
        },
        {
          type: "link",
          label: "4. Explore RisingWave with examples",
          href: "/cloud/quickstart/?step=4",
        },
        {
          type: "link",
          label: "5. Ingest, process, and deliver data",
          href: "/cloud/quickstart/?step=5",
        },
      ],
    },
    {
      type: "category",
      label: "Cluster & database",
      collapsible: false,
      collapsed: false,
      link:{type: 'doc', id:'cluster-overview'},
      items: [
        {
          type: "category",
          label: "Manage clusters",
          collapsible: true,
          items: [
            {
              type: "doc",
              id: "cluster-manage-clusters",
              label: "Overview",
            },
            {
              type: "doc",
              id: "cluster-choose-a-cluster-plan",
            },
            {
              type: "doc",
              id: "cluster-connect-to-a-cluster",
            },
            {
              type: "doc",
              id: "cluster-check-status-and-metrics",
              label: "Check status and metrics",
            },
            {
              type: "doc",
              id: "cluster-stop-and-delete-clusters",
            },
          ],
        },
        {
          type: "category",
          label: "Manage database users",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "cluster-manage-database-users",
              label: "Overview",
            },
            {
              type: "doc",
              id: "cluster-create-a-database-user",
              label: "Create a user",
            },
            {
              type: "doc",
              id: "cluster-change-database-user-password",
              label: "Change user password",
            },
            {
              type: "doc",
              id: "cluster-delete-a-database-user",
              label: "Delete a user",
            },
          ],
        },
        {
          type: "doc",
          id: "cluster-monitor-materialized-views",
        },
      ],
    },
    {
      type: "category",
      label: "Console",
      collapsible: false,
      collapsed: false,
      link:{type: 'doc', id:'console-overview'},
      items: [
        {
          type: "doc",
          id: "console-overview",
          label: "Overview",
        },
      ],
    },
    {
      type: "category",
      label: "Develop",
      collapsible: false,
      collapsed: false,
      link:{type: 'doc', id:'develop-overview'},
      items: [
        {
          type: "doc",
          id: "develop-overview",
        },
      ],
    },
    {
      type: "category",
      label: "Account",
      collapsible: false,
      collapsed: false,
      link:{type: 'doc', id:'account-overview'},
      items: [
        {
          type: "category",
          label: "Manage your account",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "account-manage-your-account",
              label: "Overview",
            },
            {
              type: "link",
              label: "Update your profile",
              href: "/cloud/account-manage-your-account/?task=update-profile",
            },
            {
              type: "link",
              label: "Change account password",
              href: "/cloud/account-manage-your-account/?task=change-password",
            },
            {
              type: "link",
              label: "Delete your account",
              href: "/cloud/account-manage-your-account/?task=delete-account",
            },
            {
              type: "link",
              label: "Switch accounts",
              href: "/cloud/account-manage-your-account/?task=switch-accounts",
            },
          ],
        },
        {
          type: "doc",
          id: "account-messages-and-alerts",
        },
        {
          type: "doc",
          id: "account-forgot-password",
        },
      ],
    },
  ],
};
