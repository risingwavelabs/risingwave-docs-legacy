import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useHistory, useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";
import { useColorMode } from "@docusaurus/theme-common";

type LinkProps = {
  text: string;
  url?: string;
  doc: string;
};

type Props = {
  title: string;
  content: string;
  doc?: string;
  cloud?: string;
  url?: string;
  height?: string;
  btn?: string;
  width?: string;
  links?: LinkProps[];
};

export default function OutlinedCard({
  title,
  content,
  doc,
  url,
  links,
  btn,
  width,
  height,
  cloud,
  ...rest
}: Props) {
  const history = useHistory();
  const { globalData } = useDocusaurusContext();
  const location = useLocation();
  const { colorMode } = useColorMode();
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    setDark(colorMode === "dark");
  }, [colorMode]);

  return (
    <Card
      {...rest}
      variant="outlined"
      sx={{
        width: width ? width : "100%",
        height: height ? height : "auto",
      }}
      className={`${links ? styles.defaultContainer : styles.cardContainer}`}
      onClick={() => {
        if (links) return;
        if (doc) {
          globalData["docusaurus-plugin-content-docs"].default["versions"].map(
            (v) => {
              if (location.pathname.includes(v.path)) {
                history.push(`${v.path}/${doc}`);
              } else if (location.pathname.includes("cloud")) {
                history.push(`/docs/current/${doc}`);
              }
            }
          );
        } else if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
        } else if (cloud) {
          history.push(`/cloud/${cloud}`);
        }
      }}
    >
      <CardContent className={styles.cardContent}>
        <Typography variant="h5" className={styles.title} component="div">
          {title}
        </Typography>
        <Typography variant="body2" className={styles.content}>
          {content}
        </Typography>
        {links && (
          <Box className={styles.cardLinks}>
            {links.map((link) => {
              return (
                <div key={link.url} className={styles.flexBox}>
                  <Typography
                    className={styles.cardLink}
                    onClick={() => {
                      if (link.url) {
                        window.open(link.url, "_blank", "noopener,noreferrer");
                      } else if (link.doc) {
                        globalData["docusaurus-plugin-content-docs"].default[
                          "versions"
                        ].map((v) => {
                          if (location.pathname.includes(v.path)) {
                            history.push(`${v.path}/${link.doc}`);
                          } else if (location.pathname.includes("cloud")) {
                            history.push(`/docs/current/${doc}`);
                          }
                        });
                      }
                    }}
                  >
                    {link.text}
                    {link.url && <ExternalArrow />}
                    {link.doc && (
                      <RightArrow fill={dark ? "#0098ef" : "#48dcbc"} />
                    )}
                  </Typography>
                </div>
              );
            })}
          </Box>
        )}
      </CardContent>

      {btn && (
        <CardActions>
          <Button size="small" className={styles.cardBtn}>
            {btn}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

type IconProps = {
  fill: string;
};
const RightArrow = ({ fill }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    className={styles.rightArrowIcon}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
      fill={fill}
    />
  </svg>
);

const ExternalArrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.externalArrowIcon}
  >
    <path d="M15 3.5H20.5M20.5 3.5V9M20.5 3.5L12.5 11.5" />
    <path
      d="M11.5 5.5H7.5C6.39543 5.5 5.5 6.39543 5.5 7.5V16.5C5.5 17.6046 6.39543 18.5 7.5 18.5H16.5C17.6046 18.5 18.5 17.6046 18.5 16.5V12.5"
      strokeLinecap="round"
    />
  </svg>
);
