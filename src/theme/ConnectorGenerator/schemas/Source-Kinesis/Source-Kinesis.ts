import { JsonSchema, RuleEffect } from "@jsonforms/core";
import { UISchema } from "../store";
import { DataType, RowFormat } from "../Source-Kafka/Source-Kafka";

const StartupMode = ["Earliest", "Latest", "Sequence Number"];

export const kinesisSchema: JsonSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    stream: {
      type: "string",
    },
    AWSRegion: {
      type: "string",
    },
    serviceEntryPointURL: {
      type: "string",
    },
    AWSAccessKeyID: {
      type: "string",
    },
    AWSSecretAccessKey: {
      type: "string",
    },
    AWSSessionToken: {
      type: "string",
    },
    IAMRoleARN: {
      type: "string",
    },
    externalID: {
      type: "string",
    },
    startupMode: {
      type: "string",
      enum: StartupMode,
    },
    sequenceNumber: {
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
    description: {
      title: "",
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
  required: ["name", "stream", "AWSRegion"],
};

export const kinesisUISchema: UISchema = {
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
          scope: "#/properties/stream",
        },
      ],
    },
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/AWSRegion",
        },
        {
          type: "Control",
          scope: "#/properties/serviceEntryPointURL",
        },
      ],
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
          scope: "#/properties/AWSAccessKeyID",
        },
        {
          type: "Control",
          scope: "#/properties/AWSSecretAccessKey",
        },
      ],
    },
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/externalID",
        },
        {
          type: "Control",
          scope: "#/properties/IAMRoleARN",
        },
      ],
    },
    {
      type: "Control",
      scope: "#/properties/AWSSessionToken",
      options: {
        trim: true,
      },
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

export const kinesisInitialData = {
  name: "",
  stream: "",
  AWSRegion: "",
  AWSAccessKeyID: "",
  AWSSecretAccessKey: "",
  AWSSessionToken: "",
  IAMRoleARN: "",
  externalID: "",
  startupMode: StartupMode[0],
  startupTimestampOffset: "",
  rowFormat: RowFormat[0],
  description:
    "If needed, please specify both of the followings at the same time:",
  sourceSchema: [
    {
      columnName: "name",
      dataType: DataType[0],
      selectAsPrimaryKey: true,
    },
  ],
};
