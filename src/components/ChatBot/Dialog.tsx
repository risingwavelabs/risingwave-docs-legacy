import React, { useState } from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import { blue } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/material/styles";
import styles from "./styles.module.css";
import { ChatMsg } from "./ChatMessage/ChatMsg";
import { CssTextField } from "./CssTextField";
import { BootstrapDialog } from "./BootstrapDialog";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

export default function SimpleDialog({ onClose, open }: SimpleDialogProps) {
  const handleClose = () => {
    onClose("messages");
  };

  const [messages, setMessages] = useState([
    //     `Let Google help apps determine location. This means sending anonymous location data to Google, even when no
    //   apps are running.`,
  ]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = () => {
    if (inputValue) {
      setMessages([...messages, inputValue]);
      setInputValue("");
    }
  };

  return (
    <BootstrapDialog onClose={handleClose} open={open} className={styles.chatBoxBackground}>
      <Typography className={styles.chatBoxHeader}>{"RisingWave AI Bot"}</Typography>
      <DialogContent className={styles.chatBoxContent}>
        {messages.map((message, idx) => (
          <DialogContentText key={idx}>{message}</DialogContentText>
        ))}
        <ChatMsg
          side={"right"}
          messages={["Great! What's about you?", "Of course I did. Speaking of which check this out"]}
        />
        <ChatMsg
          side={"left"}
          messages={["Great! What's about you?", "Of course I did. Speaking of which check this out"]}
        />
      </DialogContent>

      <Stack my={1} alignItems="center" direction="row" justifyContent="space-between" width="100">
        <CssTextField
          className={styles.chatBoxInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          variant="standard"
          fullWidth
          placeholder="Ask AI anything... e.g. What is Risingwave?"
        />
        <Button className={styles.chatBoxSend} onClick={sendMessage} endIcon={<SendIcon />}>
          Send
        </Button>
      </Stack>
    </BootstrapDialog>
  );
}
