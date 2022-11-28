import React, { useEffect, useState } from 'react';
import { Popover } from 'react-tiny-popover';
import './style.css';
import { useColorMode } from '@docusaurus/theme-common';
import { toast } from 'react-toastify';
import { postNotification } from '../../api/feedback';

type Props = {
  note: string;
};

function NotifyButton({ note }: Props) {
  const [shown, setShown] = useState(false);
  const { isDarkTheme } = useColorMode();
  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setDark(isDarkTheme);
  }, [isDarkTheme]);

  const getNotify = () => {
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (!emailValid) {
      toast.error('Email address is invalid!');
      return;
    }

    postNotification(email, note)
      .then(() => {
        toast.success('Congratulation! You have subscribed this feature.');
        setShown(false);
      })
      .catch((err) => {
        if (err.response) toast.info(err.response.data.msg ?? 'Something went wrong :(');
        else if (err.request) toast.error('Something went wrong :(');
      })
      .finally(() => setEmail(''));
  };

  return (
    <Popover
      isOpen={shown}
      positions={['bottom']}
      align="start"
      onClickOutside={() => setShown(false)}
      content={
        <div className="container">
          <div className="container__item">
            <form className="form">
              <input
                type="email"
                className="form-field"
                placeholder="Email address"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn--primary btn--inside"
                onClick={(e) => {
                  e.preventDefault();
                  getNotify();
                }}
              >
                Notify me
              </button>
            </form>
          </div>
        </div>
      }
    >
      <div className="notify-button" onClick={() => setShown(!shown)}>
        {dark ? <NotifyIcon /> : <NotifyIconFill />}
      </div>
    </Popover>
  );
}

export default NotifyButton;

const NotifyIcon = () => {
  return (
    <svg
      className="notify"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M5 18h14v-6.969C19 7.148 15.866 4 12 4s-7 3.148-7 7.031V18zm7-16c4.97 0 9 4.043 9 9.031V20H3v-8.969C3 6.043 7.03 2 12 2zM9.5 21h5a2.5 2.5 0 1 1-5 0z"
        fill="rgba(255,255,255,1)"
      />
    </svg>
  );
};

const NotifyIconFill = () => {
  return (
    <svg
      className="notify"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M5 18h14v-6.969C19 7.148 15.866 4 12 4s-7 3.148-7 7.031V18zm7-16c4.97 0 9 4.043 9 9.031V20H3v-8.969C3 6.043 7.03 2 12 2zM9.5 21h5a2.5 2.5 0 1 1-5 0z" />
    </svg>
  );
};
