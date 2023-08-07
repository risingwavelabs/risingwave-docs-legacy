import React, { useState } from "react";
import Button from "@mui/material/Button";
import styles from "./styles.module.css";

import SimpleDialog from "./Dialog";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <div className={styles.chatBoxContainer}>
      <Button onClick={handleClickOpen} className={styles.chatButton} startIcon={<SmartToyIcon />} disableRipple>
        Ask AI questions
      </Button>
      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  );
}
