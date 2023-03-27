import { JsonSchema, RuleEffect } from "@jsonforms/core";
import { UISchema } from "../store";

const SinkFrom = ["Table", "Materialized View", "Query"];
const Format = ["Append Only", "Debezium"];

export const sinkKafkaSchema: JsonSchema = {
  type: "object",
  properties: {
    sinkName: { type: "string" },
    sinkFrom: { type: "string", enum: SinkFrom },
    tableName: { type: "string" },
    bootstrapServer: { type: "string" },
    topic: { type: "string" },
    query: { type: "string" },
    format: { type: "string", enum: Format },
    forceAppendOnly: { type: "boolean" },
    useKafkaTransactions: { type: "boolean" },
  },
  required: ["sinkName", "bootstrapServer", "topic"],
};

export const sinkKafkaUISchema: UISchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/sinkName",
        },
        {
          type: "Control",
          scope: "#/properties/sinkFrom",
        },
      ],
    },
    {
      type: "Group",
      rule: {
        effect: RuleEffect.SHOW,
        condition: {
          scope: "#/properties/sinkFrom",
          schema: {
            const: SinkFrom[2],
          },
        },
      },
      elements: [
        {
          type: "Control",
          scope: "#/properties/query",
          options: {
            multi: true,
          },
        },
      ],
    },
    {
      type: "Control",
      scope: "#/properties/tableName",
      rule: {
        effect: RuleEffect.SHOW,
        condition: {
          scope: "#/properties/sinkFrom",
          schema: {
            not: { const: SinkFrom[2] },
          },
        },
      },
    },
    {
      type: "HorizontalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/bootstrapServer",
        },
        {
          type: "Control",
          scope: "#/properties/topic",
        },
      ],
    },
    {
      type: "Control",
      scope: "#/properties/format",
    },
    {
      type: "Control",
      scope: "#/properties/forceAppendOnly",
    },
    {
      type: "Control",
      scope: "#/properties/useKafkaTransactions",
    },
  ],
};

export const sinkKafkaInitialdata = {
  sinkName: "",
  topic: "",
  sinkFrom: SinkFrom[0],
  bootstrapServer: "",
  startupTimestampOffset: "",
  confluentSchemaRegistryURL: "",
  schemaLocation: "",
  query: `SELECT 
  avg(distance) as avg_distance, 
  avg(duration) as avg_duration 
FROM taxi_trips`,
  tableName: "",
  format: Format[0],
  forceAppendOnly: true,
  useKafkaTransactions: true,
};
