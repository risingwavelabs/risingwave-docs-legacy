import React, { useEffect, useState } from "react";
import { Popover } from "react-tiny-popover";
import "./style.css";
import { toast } from "react-toastify";
import { postNotification } from "../../api/feedback";

type Props = {
  note: string;
  text: string;
  block?: boolean;
};

function LightNotify({ note, text, block }: Props) {
  const [shown, setShown] = useState(false);
  const [email, setEmail] = useState("");
  const [valid, setValid] = useState(false);

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
        <form className={valid ? "newsletter-form valid mt-2" : "newsletter-form mt-2"}>
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
      <button className={block ? "light block" : "light"} onClick={() => setShown(!shown)}>
        {text}
      </button>
    </Popover>
  );
}

export default LightNotify;
