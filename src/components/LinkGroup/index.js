import React, { useState } from "react";
import styles from "./index.module.css";
import { Stack, Collapse } from "@mui/material";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styled from "@emotion/styled";

const buttonSize = 40;

const LinkButton = styled("div")({
  backgroundColor: "#EBEDF0",
  padding: "10px",
  width: `${buttonSize}px`,
  height: `${buttonSize}px`,
  borderRadius: "10px",
});

const FoldedTextSpan = styled("span")({
  color: "#8294CC",
  fontSize: "12px",
  fontWeight: "bold",
});

const FoldedTab = styled("div")({
  backgroundColor: "#EBEDF0",
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
  top: `${buttonSize / 4}px`,
  right: `${buttonSize}px`,
});

const LinkImg = styled("img")({
  width: "20px",
  height: "20px",
});

const LinkItem = (props) => {
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => props.setFocus(true)}
      onMouseLeave={() => props.setFocus(false)}
    >
      <FoldedTabContainer className={styles.foldedTab} orientation="horizontal" in={props.focusing}>
        <FoldedTab>
          <FoldedTextSpan>
            <a href={props.link} target="_blank">
              {props.label}
            </a>
          </FoldedTextSpan>
        </FoldedTab>
      </FoldedTabContainer>
      <LinkButton className={styles.button}>
        <a href={props.link} target="_blank">
          <LinkImg src={props.imgUrl} />
        </a>
      </LinkButton>
    </div>
  );
};

export default function LinkGroup(props) {
  const [slackFocus, setSlackFocus] = useState(false);
  const [twitterFocus, setTwitterFocus] = useState(false);
  const [githubFocus, setGithubFocus] = useState(false);
  const [rwFocus, setRWFocus] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.flexBox}>
        <LinkItem
          link="https://www.risingwave-labs.com"
          focusing={rwFocus}
          setFocus={setRWFocus}
          label="Risingwave Labs"
          imgUrl={useBaseUrl("/img/logo.svg")}
        />
        <LinkItem
          link="https://github.com/risingwavelabs/risingwave"
          focusing={githubFocus}
          setFocus={setGithubFocus}
          label="Github/RisingWave"
          imgUrl={useBaseUrl("/img/home/github.png")}
        />
        <LinkItem
          link="https://twitter.com/SingularityData"
          focusing={twitterFocus}
          setFocus={setTwitterFocus}
          label="Follow us on Twitter"
          imgUrl={useBaseUrl("/img/home/twitter.png")}
        />
        <LinkItem
          link="https://join.slack.com/t/risingwave-community/shared_invite/zt-120rft0mr-d8uGk3d~NZiZAQWPnElOfw"
          focusing={slackFocus}
          setFocus={setSlackFocus}
          label="Let's chat on Slack"
          imgUrl={useBaseUrl("/img/home/slack.png")}
        />
      </div>
    </div>
  );
}
