import React, { useEffect } from "react";
import "./CasePanel.css";

const caseList = [
  {
    title: "What is Risingwave, and what is the difference between Risingwave and Flink",
  },
  {
    title: "Write a SQL to create a table called 'customers' with columns for 'id', 'name', and 'email'",
  },
  {
    title: "Design a SQL query to create a materialized view named 'sales_summary' that aggregates sales data by month",
  },
  {
    title: "How to create kafka source named bookstore, where endpoint is 192.168.0.1:9092 and topic is books",
  },
];

const CasePanel = ({ handleChoose }) => {
  useEffect(() => {}, []);
  return (
    <div className="panel-wrapper">
      <p>Examples:</p>
      <ul>
        {caseList.map((item) => {
          return (
            <li
              onClick={() => {
                handleChoose(item.title);
              }}
              key={item.title}
            >
              {item.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default CasePanel;
