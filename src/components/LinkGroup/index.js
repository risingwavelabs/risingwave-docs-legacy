import React, { useState } from "react";
import styles from "./index.module.css";
import Collapse from "@mui/material/Collapse";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styled from "@emotion/styled";

const buttonSize = 42;

const LinkButton = styled("div")({
  backgroundColor: "#8080803b",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: `${buttonSize}px`,
  height: `${buttonSize}px`,
  borderRadius: "10px",
  transition: "border-radius 1s ease-out",
});

const FoldedTextSpan = styled("span")({
  paddingLeft: "4px",
  color: "var(--ifm-font-color-base)",
  fontSize: "12px",
  fontWeight: "bold",
});

const FoldedTab = styled("div")({
  backgroundColor: "#8080803b",
  height: `${buttonSize}px`,
  borderTopLeftRadius: "10px",
  borderBottomLeftRadius: "10px",
  display: "flex",
  width: "max-content",
  padding: "10px",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
});

const FoldedTabContainer = styled(Collapse)({
  position: "absolute",
  top: `${buttonSize / 4.2}px`,
  right: `${buttonSize + 10}px`,
});

const LinkImg = styled("img")({
  width: "22px",
  height: "22px",
});

const LinkItem = (props) => {
  const openWindow = function (link) {
    window && window.open(link);
  }
  return (
    <div
      className={styles.linkItem}
      style={{ position: "relative", cursor: "pointer" }}
      onMouseEnter={() => props.setFocus(true)}
      onMouseLeave={() => props.setFocus(false)}
      onClick={() => { openWindow(props.link) }}
    >
      <FoldedTabContainer className={styles.foldedTab} orientation="horizontal" in={props.focusing}>
        <FoldedTab className={styles.foldedTabSpan}>
          <FoldedTextSpan>
            {props.label}
          </FoldedTextSpan>
        </FoldedTab>
      </FoldedTabContainer>
      <LinkButton className={`${styles.linkButton} ${props.focusing ? `${styles.linkButtonNoLeftBorder}` : ""}`}>
        <LinkImg src={props.imgUrl} />
      </LinkButton>
    </div >
  );
};

export default function LinkGroup(props) {
  const [slackFocus, setSlackFocus] = useState(false);


  return (
    <div className={styles.container}>
      <div className={styles.flexBox}>
        <LinkItem
          link="https://www.risingwave.com/slack"
          focusing={slackFocus}
          setFocus={setSlackFocus}
          label="Let's chat on Slack"
          imgUrl={useBaseUrl("/img/home/slack.png")}
        />

      </div>
    </div>
  );
}
