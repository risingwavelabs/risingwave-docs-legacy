import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

import styles from "./styles.module.css";
import { ChatMsg } from "./ChatMessage/ChatMsg";
import { CssTextField } from "./CssTextField";
import { BootstrapDialog } from "./BootstrapDialog";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

type Messages = {
  sender: "left" | "right";
  message: string;
};

export default function SimpleDialog({ onClose, open }: SimpleDialogProps) {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleClose = () => {
    onClose("close dialog");
  };

  const sendAsk = async () => {
    const postBody = {
      prompt: inputValue,
      chatbotUuid: "19473c6b-6d74-49e7-af12-d25500ae69c3",
      session: "anonymous",
    };

    const response = await fetch(`https://www.owlbot.ai/api/chatbot/ask`, {
      method: "POST",
      body: JSON.stringify(postBody),
    });
    if (!response.ok) {
      console.error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let cur = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      cur += chunkValue;
      setMessages((prev) => {
        const list = prev.map((item, index) => {
          if (index === prev.length - 1) {
            return { ...item, message: cur };
          } else {
            return item;
          }
        });
        return list;
      });
    }
    if (done) {
      setIsSending(false);
      setInputValue("");
    }
  };

  const sendMessage = async () => {
    if (inputValue) {
      setMessages([
        ...messages,
        {
          sender: "right",
          message: inputValue,
        },
      ]);
      setIsSending(true);
    }
  };

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1]?.sender === "right") {
      setMessages([...messages, { sender: "left", message: "" }]);
      sendAsk();
    }
  }, [messages]);

  return (
    <BootstrapDialog onClose={handleClose} open={open} className={styles.chatBoxBackground}>
      <Typography className={styles.chatBoxHeader}>{"RisingWave AI Bot"}</Typography>
      <DialogContent className={styles.chatBoxContent}>
        {messages.map((msg, idx) => (
          <ChatMsg key={idx} side={msg.sender} messages={[msg.message]} />
        ))}
      </DialogContent>

      <Stack my={1} alignItems="center" direction="row" justifyContent="space-between" width="100">
        <CssTextField
          disabled={isSending}
          className={styles.chatBoxInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          variant="standard"
          fullWidth
          placeholder="Ask AI any questions about RisingWave ... e.g. What is Risingwave?"
        />
        <Button disabled={isSending} className={styles.chatBoxSend} onClick={sendMessage} endIcon={<SendIcon />}>
          Send
        </Button>
      </Stack>
    </BootstrapDialog>
  );
}
