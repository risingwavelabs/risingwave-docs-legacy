import { JsonSchema, RuleEffect } from "@jsonforms/core";
import { UISchema } from "../store";

const StartupMode = ["Earliest", "Latest"];
export const RowFormat = ["JSON", "Avro", "Protobuf"];
export const SSLSettings = [
  "SSL without SASL",
  "SASL/PLAIN",
  "SASL/SCRAM",
  "SASL/GSSAPI",
  "SASL/OAUTHBEARER",
];
export const DataType = [
  "varchar",
  "boolean",
  "smallint",
  "integer",
  "bigint",
  "numeric",
  "real",
  "double",
  "date",
  "time",
  "timestamp",
  "timestamptz",
  "interval",
];

export const kafkaSchema: JsonSchema = {
  type: "object",
  properties: {
    sourceName: {
      type: "string",
    },
    topic: {
      type: "string",
    },
    bootstrapServers: {
      type: "string",
    },
    scanStartupMode: {
      type: "string",
      enum: StartupMode,
    },
    startupTimestampOffset: {
      type: "string",
    },
    message: {
      type: "string",
    },
    rowFormat: {
      type: "string",
      enum: RowFormat,
    },
    description: {
      title: "",
      type: "string",
    },
    schemaLocation: {
      type: "string",
    },
    confluentSchemaRegistryURL: {
      type: "string",
    },
    SSLandSSALSettings: {
      type: "string",
      enum: SSLSettings,
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
            enum: DataType,
          },
          selectAsPrimaryKey: {
            type: "boolean",
          },
        },
      },
    },
  },
  required: ["sourceName", "topic", "bootstrapServers"],
};

export const kafkaUISchema: UISchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/sourceName",
        },
        {
          type: "Control",
          scope: "#/properties/topic",
        },
      ],
    },
    {
      type: "Control",
      scope: "#/properties/bootstrapServers",
      options: {
        trim: true,
      },
    },
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/scanStartupMode",
        },
        {
          type: "Control",
          scope: "#/properties/startupTimestampOffset",
        },
      ],
    },
    {
      type: "Control",
      scope: "#/properties/rowFormat",
      options: {
        trim: true,
      },
    },
    {
      type: "Group",
      rule: {
        effect: RuleEffect.SHOW,
        condition: {
          scope: "#/properties/rowFormat",
          schema: {
            not: { const: RowFormat[0] },
          },
        },
      },
      elements: [
        {
          type: "Control",
          scope: "#/properties/message",
        },
        {
          type: "Control",
          scope: "#/properties/description",
          options: {
            readOnly: true,
          },
        },
        {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/schemaLocation",
            },
            {
              type: "Control",
              scope: "#/properties/confluentSchemaRegistryURL",
            },
          ],
        },
        {
          type: "Control",
          scope: "#/properties/SSLandSSALSettings",
          options: {
            trim: true,
          },
        },
      ],
    },
    {
      type: "Group",
      rule: {
        effect: RuleEffect.SHOW,
        condition: {
          scope: "#/properties/rowFormat",
          schema: {
            const: RowFormat[0],
          },
        },
      },
      elements: [
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
    },
  ],
};

export const kafkaInitialdata = {
  sourceName: "",
  topic: "",
  rowFormat: RowFormat[0],
  bootstrapServers: "",
  scanStartupMode: StartupMode[0],
  startupTimestampOffset: "",
  description: "Please specify one of the following locations:",
  confluentSchemaRegistryURL: "",
  schemaLocation: "",
  SSLandSSALSettings: SSLSettings[0],
  sourceSchema: [
    {
      columnName: "name",
      dataType: DataType[0],
      selectAsPrimaryKey: true,
    },
  ],
};
