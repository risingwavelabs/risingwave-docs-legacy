import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./AskItem.module.css";
import classnames from "classnames";

const AskItem = ({ content, className }) => {
  return (
    <div className={classnames(styles["ask-wrapper"], className)}>
      <div className={styles.icon}>
        <AccountCircleIcon />
      </div>
      <span>{content}</span>
    </div>
  );
};
export default AskItem;
