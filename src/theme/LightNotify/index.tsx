import React, { useEffect, useState } from "react";
import { Popover } from "react-tiny-popover";
import "./style.css";
import { useColorMode } from "@docusaurus/theme-common";
import { toast } from "react-toastify";
import { postNotification } from "../../api/feedback";

type Props = {
  note: string;
  text: string;
  block?: boolean;
};

function LightNotify({ note, text, block }: Props) {
  const [shown, setShown] = useState(false);
  const { isDarkTheme } = useColorMode();
  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setDark(isDarkTheme);
  }, [isDarkTheme]);

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
    <Popover
      isOpen={shown}
      positions={["bottom"]}
      align="start"
      onClickOutside={() => setShown(false)}
      content={
        <div className="mt-2 -ml-2">
          <form className="searchbox-wrap light-shadow">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                getNotify();
              }}
            >
              <span>Notify me</span>
            </button>
          </form>
        </div>
      }
    >
      <button className={block ? "light block" : "light"} onClick={() => setShown(!shown)}>
        {text}
      </button>
    </Popover>
  );
}

export default LightNotify;
