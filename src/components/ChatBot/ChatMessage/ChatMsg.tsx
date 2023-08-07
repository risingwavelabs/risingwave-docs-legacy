import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Typography, Avatar, Grid } from "@mui/material";

import { Styles, withStyles } from "@mui/styles";
import defaultChatMsgStyles from "./defaultChatMsg.styles";

interface ChatMessageProps {
  classes: any;
  avatar: string;
  messages: string[];
  side: "left" | "right";
  GridContainerProps?: any;
  GridItemProps?: any;
  AvatarProps?: any;
  typographyProps?: any;
}

export const ChatMsg = withStyles(defaultChatMsgStyles as Styles<any, any>, { name: "ChatMsg" })(
  ({
    classes,
    avatar,
    messages,
    side,
    GridContainerProps,
    GridItemProps,
    AvatarProps,
    typographyProps,
  }: ChatMessageProps) => {
    console.log(classes);

    const attachClass = (index) => {
      if (index === 0) {
        return classes[`${side}First`];
      }
      if (index === messages.length - 1) {
        return classes[`${side}Last`];
      }
    };

    return (
      <Grid container justifyContent={side === "right" ? "flex-end" : "flex-start"} {...GridContainerProps}>
        {side === "left" && (
          <Grid item xs={1} {...GridItemProps}>
            <Avatar src={avatar} {...AvatarProps} className={cx(classes?.avatar, AvatarProps?.className)} />
          </Grid>
        )}
        <Grid item xs={11}>
          {messages.map((msg, i) => {
            return (
              <div key={i} className={classes[`${side}Row`]}>
                <Typography
                  align={side}
                  {...typographyProps}
                  className={cx(classes?.msg, classes[side], attachClass(i), typographyProps?.className)}
                >
                  {msg}
                </Typography>
              </div>
            );
          })}
        </Grid>
        {side === "right" && (
          <Grid item xs={1} {...GridItemProps}>
            <Avatar src={avatar} {...AvatarProps} className={cx(classes?.avatar, AvatarProps?.className)} />
          </Grid>
        )}
      </Grid>
    );
  }
);
