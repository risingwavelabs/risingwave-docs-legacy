import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

export const CssTextField = styled(TextField)({
  [`&:hover .MuiInput-underline:before`]: {
    borderBottomColor: "var(--ifm-background-color)",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "var(--ifm-background-color)",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "var(--ifm-button-color)",
  },
  "& .MuiInputBase-root": {
    color: "var(--ifm-font-color-base)",
  },
});
