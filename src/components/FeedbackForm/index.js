import React, { useState } from "react";
import styled from "@emotion/styled";
import PullRequestIcon from "@site/static/img/github_pr.svg";
import IssueIcon from "@site/static/img/github_issue.svg";
import { Button, Typography, Stack } from "@mui/material";
import CommunityLinkGroup from "@site/src/components/LinkGroup";
import { sendFeedback } from "@site/src/api/feedback";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./index.module.css";

const BreakLine = styled("div")({
  width: "100%",
  height: "1px",
  backgroundColor: "var(--ifm-color-emphasis-300)",
  padding: "0",
  marginTop: "30px",
  marginBottom: "20px",
});

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
    <>
      <BreakLine />
      <div className={styles.communityLinkContainer}>
        <CommunityLinkGroup />
      </div>

      <form
        style={{
          width: "100%",
          marginTop: "15px",
        }}
      >
        <Stack direction="row" spacing={2}>
          {/* left group */}
          {/* <div className={styles.leftGroup}>
            <div className={styles.leftGroupContainer}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FormHeaderTitle>Was the doc helpful?</FormHeaderTitle>
                <Button size="small" variant={formData.like ? "contained" : "outlined"} color="primary" onClick={handleLike}>
                  <ThumbUpOffAltIcon />
                </Button>
                <Button size="small" variant={formData.unlike ? "contained" : "outlined"} color="primary" onClick={handleUnLike}>
                  <ThumbDownOffAltIcon />
                </Button>
              </Stack>
              <div className={styles.leftGroupHidden}>
                <Collapse sx={{ width: "100%" }} in={formData.like || formData.unlike}>
                  <div style={{ width: "100%", maxWidth: "360px" }}>
                    <div>
                      <TextField
                        multiline
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        placeholder={!formData.like && !formData.unlike ? "" : (formData.like
                          ? "(Optional) Share your thoughts about using RisingWave with us"
                          : "(Optional) Got feedback? We'd love to hear it!")}
                        sx={{ marginY: "10px"}}
                        inputProps={{ style: { color: "gray" } }}
                        name="description"
                      />
                      <Stack direction="row" spacing={1}>
                        <Button variant="outlined" style={{ fontWeight: "bold" }} onClick={handleSubmit}>
                          Submit
                        </Button>
                        <Button color="primary" style={{ marginRight: "25px", fontWeight: "bold" }} onClick={handleCancel}>
                          Cancel
                        </Button>
                      </Stack>
                    </div>
                  </div>
                </Collapse>
              </div>
            </div>
          </div> */}

          {/* right group */}
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

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </form>
    </>
  );
}
