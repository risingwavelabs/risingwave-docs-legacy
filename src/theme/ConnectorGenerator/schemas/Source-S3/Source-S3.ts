import { JsonSchema } from "@jsonforms/core";
import { UISchema } from "../store";
import { DataType } from "../Source-Kafka/Source-Kafka";

export const S3Schema: JsonSchema = {
  type: "object",
  properties: {
    AWSRegion: {
      type: "string",
    },
    bucketName: {
      type: "string",
    },
    AWSAccessKeyID: {
      type: "string",
    },
    AWSSecretAccessKey: {
      type: "string",
    },
    matchPattern: {
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
  required: ["AWSRegion", "bucketName"],
};

export const S3UISchema: UISchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/AWSRegion",
        },
        {
          type: "Control",
          scope: "#/properties/bucketName",
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
      type: "Control",
      scope: "#/properties/matchPattern",
      options: {
        trim: true,
      },
    },
    {
      type: "Group",
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

export const S3InitialData = {
  AWSRegion: "",
  bucketName: "",
  AWSAccessKeyID: "",
  AWSSecretAccessKey: "",
  matchPattern: "",
  description:
    "If needed, please specify both of the followings at the same time (if not specified, RisingWave will try to use the AWS credentials):",
  sourceSchema: [
    {
      columnName: "name",
      dataType: DataType[0],
      selectAsPrimaryKey: true,
    },
  ],
};
