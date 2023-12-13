import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CustomPreComp from "../CustomPreComp";
import styles from "./Answer.module.css";
import classNames from "classnames";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Answer = ({ content, className }) => {
  useEffect(() => {}, []);
  return (
    <>
      <div className={classNames(styles["answer-wrapper"], className)}>
        <div className={styles.icon}>
          <SmartToyIcon color="primary" />
        </div>
        <div className={styles["answer-content"]}>
          <ReactMarkdown
            linkTarget="_blank"
            components={{
              pre: CustomPreComp,
              code({ inline, className = "answer-code", children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter {...props} style={a11yDark} language={match[1]} className={styles["code-wrapper"]}>
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
    </>
  );
};
export default Answer;
