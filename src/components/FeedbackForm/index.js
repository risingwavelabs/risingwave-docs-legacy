import React, { useState, useEffect } from "react";
import { Button, Typography, Stack } from "@mui/material";
import CommunityLinkGroup from "@site/src/components/LinkGroup";
import "react-toastify/dist/ReactToastify.css";
import styles from "./index.module.css";
import { Widget } from "@happyreact/react";
import "@happyreact/react/theme.css";
import { useColorMode } from "@docusaurus/theme-common";
import IssueIcon from "./IssueIcon";
import PullRequestIcon from "./PullRequestIcon";

export default function FeedbackForm(props) {
  const [formData, setFormData] = useState({
    description: "",
    like: false,
    unlike: false,
  });

  const { colorMode } = useColorMode();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(colorMode === "dark");
  }, [colorMode]);

  return (
    <Stack width="100%">
      <div className={styles.breakLine}></div>
      <div className={styles.communityLinkContainer}>
        <CommunityLinkGroup />
      </div>

      <form>
        <Stack direction="row" spacing={2} className={styles.rightGroupContainer}>
          <Stack spacing={2} className={styles.rightGroup} direction="row" alignItems="baseline">
            <Typography className={styles.rightText}>Help us make this doc better!</Typography>
            <Stack direction="row" spacing={2} className={styles.rightGroupButtonGroup}>
              <Button
                className={styles.footerButton}
                variant="outlined"
                onClick={() => window.open(props.requestIssueUrl)}
                startIcon={<IssueIcon fill={dark ? "#48dcbc" : "#0098ef"} />}
              >
                File an issue
              </Button>
              <Button
                className={styles.footerButton}
                variant="outlined"
                onClick={() => window.open(props.editUrl)}
                startIcon={<PullRequestIcon fill={dark ? "#48dcbc" : "#0098ef"} />}
              >
                Edit this page
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <div className={styles.happyReact}>
          <h3 className={styles.title}>Was this page helpful?</h3>
          <Widget
            className={styles.widget}
            token="8e453b8d-5ed6-4a2a-94e5-292cecc9b05a"
            resource={props.unversionedId}
            classes={{
              root: styles.root,
              container: styles.container,
              grid: styles.grid,
              cell: styles.cell,
              reaction: styles.reaction,
            }}
          />
        </div>
      </form>
    </Stack>
  );
}
