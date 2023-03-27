import { JsonSchema, RuleEffect } from "@jsonforms/core";
import { UISchema } from "../store";
import { DataType, RowFormat } from "../Source-Kafka/Source-Kafka";

const StartupMode = ["Earliest", "Latest"];

export const pulsarSchema: JsonSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    topic: {
      type: "string",
    },
    serviceURL: {
      type: "string",
    },
    adminURL: {
      type: "string",
    },
    startupMode: {
      type: "string",
      enum: StartupMode,
    },
    startupTimestampOffset: {
      type: "string",
    },
    rowFormat: {
      type: "string",
      enum: RowFormat,
    },
    message: {
      type: "string",
    },
    schemaLocation: {
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
            enum: DataType,
          },
          selectAsPrimaryKey: {
            type: "boolean",
          },
        },
      },
    },
  },
  required: ["name", "topic", "serviceURL", "adminURL"],
};

export const pulsarUISchema: UISchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/name",
        },
        {
          type: "Control",
          scope: "#/properties/topic",
        },
      ],
    },
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/serviceURL",
        },
        {
          type: "Control",
          scope: "#/properties/adminURL",
        },
      ],
    },
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/startupMode",
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
          scope: "#/properties/schemaLocation",
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

export const pulsarInitialData = {
  name: "",
  topic: "",
  serviceURL: "",
  adminURL: "",
  startupMode: StartupMode[0],
  startupTimestampOffset: "",
  rowFormat: RowFormat[0],
  schemaLocation: "",
  sourceSchema: [
    {
      columnName: "name",
      dataType: DataType[0],
      selectAsPrimaryKey: true,
    },
  ],
};
