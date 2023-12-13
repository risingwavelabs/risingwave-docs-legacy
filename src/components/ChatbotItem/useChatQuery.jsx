import { useState } from "react";

const CHAT_BOT_ID = "19473c6b-6d74-49e7-af12-d25500ae69c3";

const fetchAsk = async ({ prompt, session = "anonymous", handleStreaming }) => {
  const postBody = {
    prompt: prompt,
    chatbotUuid: CHAT_BOT_ID,
    session,
  };

  try {
    const response = await fetch("https://www.owlbot.ai/api/chatbot/ask", {
      method: "POST",
      body: JSON.stringify(postBody),
    });

    if (!handleStreaming) {
      return response;
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      handleStreaming(chunkValue, done);
    }
  } catch (error) {
    handleStreaming(`Sorry, I didn't understand your question.`, true);
  }

  return;
};

export const useChatQuery = (props) => {
  const session = props?.session;
  const [chatList, setChatList] = useState([]);
  const [querying, setQuerying] = useState(false);

  const ask = async (prompt, askSession) => {
    setQuerying(true);

    const currentChatList = [
      ...chatList,
      {
        type: "ask",
        content: prompt,
      },
    ];

    setChatList(currentChatList);
    const setAnswer = (value) => {
      const res = currentChatList.concat({
        type: "answer",
        content: value,
      });
      setChatList(res);
    };

    await appendAnswerItem(prompt, setAnswer, askSession || session);
    setQuerying(false);
  };

  const appendAnswerItem = async (prompt, setAnswer, session) => {
    let cur = "";

    setAnswer("...");

    const handleStreaming = (value, done) => {
      cur += value;
      setAnswer(done ? cur : `${cur}...`);
    };
    return fetchAsk({ prompt, session, handleStreaming });
  };

  return {
    chatList,
    querying,
    ask,
  };
};
