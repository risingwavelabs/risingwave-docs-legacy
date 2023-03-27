import { JsonSchema, RuleEffect } from "@jsonforms/core";
import { UISchema } from "../store";

const SinkFrom = ["Table", "Materialized View", "Query"];
const Format = ["Append Only", "Debezium"];

export const sinkJDBCSchema: JsonSchema = {
  type: "object",
  properties: {
    sinkName: { type: "string" },
    sinkFrom: { type: "string", enum: SinkFrom },
    tableName: { type: "string" },
    JDBCURL: { type: "string" },
    targetTableName: { type: "string" },
    query: { type: "string" },
    format: { type: "string", enum: Format },
  },
  required: ["sinkName", "bootstrapServer", "JDBCURL", "targetTableName"],
};

export const sinkJDBCUISchema: UISchema = {
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
          scope: "#/properties/JDBCURL",
        },
        {
          type: "Control",
          scope: "#/properties/targetTableName",
        },
      ],
    },
  ],
};

export const sinkJDBCInitialdata = {
  sinkName: "",
  topic: "",
  sinkFrom: SinkFrom[0],
  bootstrapServer: "",
  JDBCURL: "",
  targetTableName: "",
  confluentSchemaRegistryURL: "",
  tableName: "",
};
