import React, { useState } from "react";
import { Drawer } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CasePanel from "./CasePanel";
import {useChatQuery} from "./useChatQuery"
import QueryInput from "./QueryInput/index"
import Answer from "./QueryResult/Answer"
import AskItem from "./QueryResult/AskItem"
import styles from './styles.module.css';

const ChatbotItem = (props) => {
  const { chatList, querying, ask } = useChatQuery();
  const [showDraw, setShowDraw] = useState(false);
  const onHandleExpand = () => {
    setShowDraw((prev) => !prev);
  };

  const sendAsk = async (prompt) => {
    const storageKey = "User-Chatbot-token"
    let userId = localStorage.getItem(storageKey)
    if(!userId){
      userId = `document-user-${Math.random().toString(36).substring(2, 7)}`
      localStorage.setItem(storageKey, userId)
    }
    ask(prompt, userId);
  };

  const onSubmit = (value) => {
    if (value === "") {
      return;
    }
    sendAsk(value);
  };

  const handleChoose = (value) => {
    sendAsk(value);
  };


  return (
    <div className={styles["chatbot-wrapper"]}>
      <div className={styles["chatbot-icon"]}>
        <SmartToyIcon sx={{fontSize:"20px"}} color="primary" onClick={onHandleExpand} />
      </div>
      <Drawer
        sx={{
          "&.MuiDrawer-root": { width: 0 },
        }}
        PaperProps={{ sx: { "&.MuiPaper-root": { top: "45px",maxWidth:"400px",width:"100%",height: "calc(100% - 45px)", background: "#f9f9f9" } } }}
        hideBackdrop
        variant="persistent"
        open={showDraw}
        anchor="right"
        onClose={() => setShowDraw(false)}>
        <div className={styles["drawer-wrapper"]}>
          <QueryInput expand disabled={querying} onSubmit={onSubmit} onHandleExpand={onHandleExpand} />
          <div className={styles["query-panel"]}>
            {chatList.length === 0 ? <CasePanel handleChoose={handleChoose} /> : 
               chatList.map((item, index) => {
                return item.type === "ask" ? (
                  <div className={styles["ask-item"]} key={`ask-${index}`}>
                    <AskItem content={item.content} />
                  </div>
                ) : (
                  <div className={styles["answer-item"]} key={`answer-${index}`}>
                    <Answer content={item.content} />
                  </div>
                );
              })
            }
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default ChatbotItem;
