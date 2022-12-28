import React, { useEffect, useState } from "react";
import NotifyButton from "../NotifyButton";
import styles from "./styles.module.css";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import { getLike, postLike } from "../../api/feedback";

type Props = {
  feature: string;
};

function Capsule({ feature }: Props) {
  const [clicked, setClicked] = useState(localStorage.getItem(feature) === "clicked");
  const [count, setCount] = useState(0);

  useEffect(() => {
    getLike(feature).then((res) => setCount(res.data?.like));
  }, [feature]);

  const LikeFeature = () => {
    const isClicked = localStorage.getItem(feature);
    if (isClicked) {
      setClicked(true);
      getLike(feature).then((res) => setCount(res.data?.like));
      return;
    }

    postLike(feature).then(() => {
      localStorage.setItem(feature, "clicked");
      getLike(feature).then((r) => setCount(r.data?.like));
      setClicked(true);
    });
  };

  return (
    <div className={styles.capsule}>
      <Tooltip title="I need this feature" arrow>
        <div className={styles.capsuleLeft} onClick={LikeFeature}>
          {clicked ? (
            <>
              <FillThumbsUpIcon size="16px" />
              <span className={styles.count}>{count}</span>
            </>
          ) : (
            <ThumbsUpIcon size="16px" />
          )}
        </div>
      </Tooltip>
      <Divider light orientation="vertical" flexItem variant="middle" />
      <div className={styles.capsuleRight}>
        <NotifyButton note="test" size="16px" />
      </div>
    </div>
  );
}

export default Capsule;

type ButtonSize = {
  size?: string;
};

const ThumbsUpIcon = ({ size }: ButtonSize) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size ?? "16px"}
    height={size ?? "16px"}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      fill="#95adee"
      d="M14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h3.482a1 1 0 0 0 .817-.423L11.752.85a.5.5 0 0 1 .632-.159l1.814.907a2.5 2.5 0 0 1 1.305 2.853L14.6 8zM7 10.588V19h11.16L21 12.104V10h-6.4a2 2 0 0 1-1.938-2.493l.903-3.548a.5.5 0 0 0-.261-.571l-.661-.33-4.71 6.672c-.25.354-.57.644-.933.858zM5 11H3v8h2v-8z"
    />
  </svg>
);

const FillThumbsUpIcon = ({ size }: ButtonSize) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size ?? "16px"}
    height={size ?? "16px"}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      fill="#95adee"
      d="M2 9h3v12H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zm5.293-1.293l6.4-6.4a.5.5 0 0 1 .654-.047l.853.64a1.5 1.5 0 0 1 .553 1.57L14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H8a1 1 0 0 1-1-1V8.414a1 1 0 0 1 .293-.707z"
    />
  </svg>
);
