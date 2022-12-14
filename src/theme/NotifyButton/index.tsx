import React, { useEffect, useState } from "react";
import { Popover } from "react-tiny-popover";
import "./style.css";
import { useColorMode } from "@docusaurus/theme-common";
import { toast } from "react-toastify";
import { postNotification } from "../../api/feedback";
import Tooltip from "@mui/material/Tooltip";

type Props = {
  note: string;
  size?: string;
};

function NotifyButton({ note, size }: Props) {
  const [shown, setShown] = useState(false);
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");

  const getNotify = () => {
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (!emailValid) {
      toast.error("Email address is invalid!");
      return;
    }

    postNotification(email, note)
      .then(() => {
        toast.success("Congratulation! You have subscribed this feature.");
        setShown(false);
      })
      .catch((err) => {
        if (err.response) toast.info(err.response.data.msg ?? "Something went wrong :(");
        else if (err.request) toast.error("Something went wrong :(");
      })
      .finally(() => setEmail(""));
  };

  return (
    <>
      <Popover
        isOpen={shown}
        positions={["bottom"]}
        align="start"
        onClickOutside={() => {
          setShown(false);
        }}
        content={
          <form className={valid ? "newsletter-form valid" : "newsletter-form"}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              required
              onChange={(e) => {
                setEmail(e.target.value);
                setValid(!!e.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));
              }}
            />
            <button type="submit" disabled={!valid} onClick={getNotify}>
              <span className=""> Notify Me </span>
            </button>
          </form>
        }
      >
        <Tooltip title="Notify me when it's available" arrow>
          <div className="notify-button" id="app-title" onClick={() => setShown(!shown)}>
            <NotifyIconDefault size={size} />
          </div>
        </Tooltip>
      </Popover>
    </>
  );
}

export default NotifyButton;

type ButtonSize = {
  size?: string;
};

const NotifyIconDefault = ({ size }: ButtonSize) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size ?? "16px"}
      height={size ?? "16px"}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill="#95adee"
        d="M18 10a6 6 0 1 0-12 0v8h12v-8zm2 8.667l.4.533a.5.5 0 0 1-.4.8H4a.5.5 0 0 1-.4-.8l.4-.533V10a8 8 0 1 1 16 0v8.667zM9.5 21h5a2.5 2.5 0 1 1-5 0z"
      />
    </svg>
  );
};
