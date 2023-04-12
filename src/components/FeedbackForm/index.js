import React, { useState, useEffect } from "react";
import PullRequestIcon from "@site/static/img/github_pr.svg";
import IssueIcon from "@site/static/img/github_issue.svg";
import { Button, Typography, Stack } from "@mui/material";
import CommunityLinkGroup from "@site/src/components/LinkGroup";
import { sendFeedback } from "@site/src/api/feedback";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./index.module.css";
import { Widget } from "@happyreact/react";
import "@happyreact/react/theme.css";

export default function FeedbackForm(props) {
  const [formData, setFormData] = useState({
    description: "",
    like: false,
    unlike: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLike = (e) => {
    setFormData({
      ...formData,
      like: !formData.like,
      unlike: false,
    });
  };

  const handleUnLike = (e) => {
    setFormData({
      ...formData,
      unlike: !formData.unlike,
      like: false,
    });
  };

  const validation = () => {
    if (!formData.description) {
      return {
        success: false,
        msg: "Please fill out all required fields 😥",
      };
    }
    return {
      success: true,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const valid = validation();
      if (valid.success) {
        await sendFeedback(formData.description, Number(formData.like));
      } else {
        toast.error(valid.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (e) {
      toast.error("Someting went wrong 😥", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    // setStatus("");
    setFormData({
      description: "",
      like: false,
      unlike: false,
    });
  };

  return (
    <Stack width="100%">
      <div className={styles.breakLine}></div>
      <div className={styles.communityLinkContainer}>
        <CommunityLinkGroup />
      </div>

      <form>
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
        <Stack direction="row" spacing={2}>
          <Stack spacing={2} className={styles.rightGroup} direction="row" alignItems="baseline">
            <Typography className={styles.rightText}>Help us make this doc better!</Typography>
            <Stack direction="row" spacing={2} className={styles.rightGroupButtonGroup}>
              <Button
                className={styles.footerButton}
                variant="outlined"
                onClick={() => window.open(props.requestIssueUrl)}
                startIcon={<IssueIcon />}
              >
                File an issue
              </Button>
              <Button
                className={styles.footerButton}
                variant="outlined"
                onClick={() => window.open(props.editUrl)}
                startIcon={<PullRequestIcon style={{ color: "red" }} />}
              >
                Edit this page
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
}
