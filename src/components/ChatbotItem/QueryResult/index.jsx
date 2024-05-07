import React from "react";
import Answer from "./Answer";
import AskItem from "./AskItem";
import styles from "./style.module.css";

const QueryResult = ({ chatList }) => {
  return (
    <div className={styles["query-panel"]}>
      {chatList.map((item, index) => {
        return item.type === "ask" ? (
          <div className={styles["ask-item"]} key={index}>
            <AskItem content={item.content} />
          </div>
        ) : (
          <Answer key={index} content={item.content} />
        );
      })}
    </div>
  );
};
export default QueryResult;
