import { createTheme } from "@mui/material/styles";
export default ({ palette, spacing }) => {
  const theme = createTheme({ palette: { mode: "light" } });
  const radius = theme.spacing(2.5);
  const size = theme.spacing(4);
  const rightBgColor = theme.palette.primary.main;
  // if you want the same as facebook messenger, use this color '#09f'
  return {
    avatar: {
      width: size,
      height: size,
    },
    leftRow: {
      textAlign: "left",
    },
    rightRow: {
      textAlign: "right",
    },
    msg: {
      padding: theme.spacing(1, 2),
      borderRadius: 4,
      marginBottom: 4,
      display: "inline-block",
      wordBreak: "break-word",
    },
    left: {
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      backgroundColor: theme.palette.grey[100],
    },
    right: {
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
      backgroundColor: "var(--ifm-button-color)",
      color: "var(--ifm-card-content-color) !important",
    },
    leftFirst: {
      borderTopLeftRadius: radius,
    },
    leftLast: {
      borderBottomLeftRadius: radius,
    },
    rightFirst: {
      borderTopRightRadius: radius,
    },
    rightLast: {
      borderBottomRightRadius: radius,
    },
  };
};
