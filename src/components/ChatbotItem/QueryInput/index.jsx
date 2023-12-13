import React from "react";
import { TextField, Tooltip, InputAdornment } from "@mui/material";
import classNames from "classnames";
import { useRef } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import styles from "./style.module.css";

const QueryInput = ({ disabled, expand, onSubmit, onHandleExpand }) => {
  const inputRef = useRef(null);
  const handleSubmit = () => {
    if (!inputRef.current) return;
    onSubmit(inputRef.current.value);
    inputRef.current.value = "";
  };
  return (
    <div>
      <div className={styles["expand-wrapper"]}>
        <Tooltip title="Ask AI question about Risingwave" placement="bottom" arrow>
          <div className={classNames(styles.icon, { [styles.expand]: expand })} onClick={onHandleExpand}>
            <div className={styles.arrow}></div>
            {!expand && <SmartToyIcon color="primary" />}
          </div>
        </Tooltip>

        {expand && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <TextField
              fullWidth
              name="AI_Query"
              disabled={disabled}
              autoComplete="off"
              InputProps={{
                type: "search",
                startAdornment: (
                  <InputAdornment position="start">
                    <SmartToyIcon className={styles["cursor-pointer"]} color="primary" onClick={handleSubmit} />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              placeholder="Ask AI questions about RisingWave ... e.g. What is Risingwave?"
              inputRef={inputRef}
            />
          </form>
        )}
      </div>
    </div>
  );
};
export default QueryInput;
