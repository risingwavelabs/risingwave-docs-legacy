import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import IconButton from "@mui/material/IconButton";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { CssTextField } from "../ChatBot/CssTextField";
import InputAdornment from "@mui/material/InputAdornment";
import AnswerCard from "./AnswerCard/AnswerCard";
import ClickAwayListener from "@mui/material/ClickAwayListener";

type Props = {};

function AIBot({}: Props) {
  const [showInput, setShowInput] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [promptCopy, setPromptCopy] = useState("");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");

  const switchToInput = () => {
    setShowInput((prev) => !prev);
  };

  const sendAsk = async () => {
    const postBody = {
      prompt: prompt,
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
      setAnswer(cur);
    }

    if (done) {
      setIsSending(false);
      setPrompt("");
    }
  };

  const sendMessage = async () => {
    if (prompt) {
      setIsSending(true);
      setPromptCopy(prompt);
    }
  };

  useEffect(() => {
    if (isSending === true) {
      sendAsk();
    }
  }, [isSending]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setShowInput(false);
        setShowAnswer(false);
      }}
    >
      <div>
        {!showInput ? (
          <IconButton
            onClick={switchToInput}
            className={styles.buttonWrapper}
            color="primary"
            aria-label="Ask AI questions"
          >
            <SmartToyIcon />
          </IconButton>
        ) : (
          <form
            onFocus={() => {
              if (answer) setShowAnswer(true);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
              setShowAnswer(true);
            }}
          >
            <CssTextField
              fullWidth
              className={styles.chatBoxInput}
              value={prompt}
              autoComplete="off"
              onChange={(e) => setPrompt(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SmartToyIcon className={styles.iconWrapper} />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              placeholder="Ask AI questions about RisingWave ... e.g. What is Risingwave?"
            />
          </form>
        )}
        {showAnswer && (
          <AnswerCard showAnswer={showAnswer} setShowAnswer={setShowAnswer} question={promptCopy} answer={answer} />
        )}
      </div>
    </ClickAwayListener>
  );
}

export default AIBot;
