import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiFormLabel-root": {
    color: "var(--ifm-menu-color)",
    padding: "0 2rem",
  },
  "& .MuiTypography-root": {
    color: "var(--ifm-font-color-base)",
  },
  "& .MuiInputBase-root": {
    color: "var(--ifm-font-color-base)",
  },
  "& .MuiPaper-root": {
    backgroundColor: "var(--ifm-card-background-color)",
    color: "var(--ifm-font-color-base)",
  },
}));
