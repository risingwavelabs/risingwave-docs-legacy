import { JsonSchema } from "@jsonforms/core";
import { UISchema } from "../store";

export const PostgreSQLSchema: JsonSchema = {
  type: "object",
  properties: {
    host: {
      type: "string",
    },
    port: {
      type: "string",
    },
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
    databaseName: {
      type: "string",
    },
    schemaName: {
      type: "string",
    },
    tableName: {
      type: "string",
    },
    slotName: {
      type: "string",
    },
    sourceSchema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          columnName: {
            type: "string",
          },
          dataType: {
            type: "string",
          },
          selectAsPrimaryKey: {
            type: "boolean",
          },
        },
      },
    },
  },
  required: [
    "host",
    "port",
    "username",
    "password",
    "databaseName",
    "tableName",
    "slotName",
  ],
};

export const PostgreSQLUISchema: UISchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/host",
        },
        {
          type: "Control",
          scope: "#/properties/port",
        },
      ],
    },
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/username",
        },
        {
          type: "Control",
          scope: "#/properties/password",
        },
      ],
    },
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/databaseName",
        },
        {
          type: "Control",
          scope: "#/properties/schemaName",
        },
      ],
    },
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/tableName",
        },
        {
          type: "Control",
          scope: "#/properties/slotName",
        },
      ],
    },
    {
      type: "VerticalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/sourceSchema",
        },
      ],
    },
  ],
};

export const PostgreSQLInitialData = {
  host: "",
  port: "",
  username: "",
  password: "",
  databaseName: "",
  tableName: "",
  schemaName: "",
  slotName: "",
  sourceSchema: [
    {
      columnName: "column",
      dataType: "varchar",
      selectAsPrimaryKey: true,
    },
  ],
};
