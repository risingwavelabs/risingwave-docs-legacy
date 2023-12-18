import React from "react";
import copyToClipboard from "copy-to-clipboard";
import { toast } from "react-toastify";
import styles from "./style.module.css";

const Icon_copy = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
    <path
      fill="#B3B3B3"
      d="M10 14v1.25a.74.74 0 0 1-.75.75H.75a.722.722 0 0 1-.75-.75V3.75A.74.74 0 0 1 .75 3H3v9.25c0 .969.781 1.75 1.75 1.75H10Zm0-10.75c0 .438.313.75.75.75H14v8.25a.74.74 0 0 1-.75.75h-8.5a.722.722 0 0 1-.75-.75V.75A.74.74 0 0 1 4.75 0H10v3.25Zm3.75-.969c.156.156.25.344.25.531V3h-3V0h.188c.187 0 .374.094.53.25l2.032 2.031Z"
    />
  </svg>
);

const CustomPreComp = ({ children }) => {
  const handleCopyCode = () => {
    const value = children?.[0]?.props.children[0];
    if (copyToClipboard(value)) {
      toast.success("Copied to clipboard");
    }
  };
  return (
    <div className={styles["answer-pre"]}>
      <button className={styles["copy-button"]} onClick={handleCopyCode}>
        <Icon_copy />
      </button>
      {children}
    </div>
  );
};
export default CustomPreComp;
