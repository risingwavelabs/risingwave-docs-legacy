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

type LinkProps = {
  text: string;
  url?: string;
  docs: string;
};

type Props = {
  title: string;
  content: string;
  doc?: string;
  url?: string;
  btn?: string;
  maxWidth?: string;
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
  maxWidth,
  ...rest
}: Props) {
  const history = useHistory();
  const { globalData } = useDocusaurusContext();
  const location = useLocation();

  return (
    <Card
      {...rest}
      variant="outlined"
      sx={{
        width: width ? width : "100%",
      }}
      className={`${links ? styles.defaultContainer : styles.cardContainer}`}
      onClick={() => {
        if (links) return;
        if (doc) {
          globalData["docusaurus-plugin-content-docs"].default["versions"].map(
            (v) => {
              if (location.pathname.includes(v.path)) {
                history.push(`${v.path}/${doc}`);
              }
            }
          );
        } else if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
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
          <Typography className={styles.cardLinks}>
            {links.map((link) => {
              return (
                <div
                  className={styles.flexBox}
                  onClick={() => {
                    if (link.url) {
                      window.open(link.url, "_blank", "noopener,noreferrer");
                    } else if (link.docs) {
                      globalData["docusaurus-plugin-content-docs"].default[
                        "versions"
                      ].map((v) => {
                        if (location.pathname.includes(v.path)) {
                          history.push(`${v.path}/${link.docs}`);
                        }
                      });
                    }
                  }}
                >
                  <Typography className={styles.cardLink}>
                    {link.text}
                  </Typography>
                  <RightArrow />
                </div>
              );
            })}
          </Typography>
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

const RightArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
      fill="#95adee"
    />
  </svg>
);
