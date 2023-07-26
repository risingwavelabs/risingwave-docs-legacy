import React from "react";
import styles from "./styles.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useHistory, useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

type Icons = {
  text: string;
  src: string;

  doc?: string;
  url?: string;
  cloud?: string;
  block?: boolean;
};

type Props = {
  cols: number;
  children: React.ReactNode;
  icons: Icons[];
};

function SectionGrid({ children, icons, cols }: Props) {
  const matches = useMediaQuery("(min-width:640px)");
  const history = useHistory();
  const location = useLocation();
  const { globalData } = useDocusaurusContext();

  return (
    <section>
      <div className={styles.sectionContainer}>
        <div className={styles.gridContainer}>
          <div className={styles.leftContainer}>{children}</div>

          <div
            className={styles.rightContainer}
            style={{
              gridTemplateColumns: matches ? `repeat(${cols ?? 3}, minmax(0, 1fr))` : "repeat(2, minmax(0, 1fr))",
            }}
          >
            {icons?.map((icon) => (
              <div
                key={icon.text}
                className={styles.iconContainer}
                onClick={() => {
                  if (icon.doc) {
                    for (let v of globalData["docusaurus-plugin-content-docs"].default["versions"]) {
                      if (location.pathname.includes(v.path)) {
                        return history.push(`${v.path}/${icon.doc}`);
                      } else {
                        return history.push(`/docs/current/${icon.doc}`);
                      }
                    }
                  } else if (icon.url) {
                    window.open(icon.url, "_blank", "noopener,noreferrer");
                  } else if (icon.cloud) {
                    history.push(`/cloud/${icon.cloud}`);
                  }
                }}
              >
                <img alt={icon.text} src={icon.src} className={`${styles.icon} disabled-zoom`} />
                <p className={styles.iconHeader}>{icon.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionGrid;
