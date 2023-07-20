import React from "react";
import styles from "./styles.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";

type Icons = {
  name: string;
  src: string;
  href: string;
};

type Props = {
  cols: number;
  children: React.ReactNode;
  icons: Icons[];
};

function SectionGrid({ children, icons, cols }: Props) {
  const matches = useMediaQuery("(min-width:640px)");
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
              <a key={icon.name} className={styles.iconContainer} href={icon.href}>
                <img alt={icon.name} src={icon.src} className={`${styles.icon} disabled-zoom`} />
                <p className={styles.iconHeader}>{icon.name}</p>
              </a>
            ))}
          </div>
        </div>
        <hr />
      </div>
    </section>
  );
}

export default SectionGrid;
