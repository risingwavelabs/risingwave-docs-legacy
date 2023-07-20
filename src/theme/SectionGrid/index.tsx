import React from "react";
import styles from "./styles.module.css";

type Icons = {
  name: string;
  src: string;
  href: string;
};

type Props = {
  children: React.ReactNode;
  icons: Icons[];
};

function SectionGrid({ children, icons }: Props) {
  return (
    <section>
      <div className={styles.sectionContainer}>
        <div className={styles.gridContainer}>
          <div className={styles.leftContainer}>{children}</div>

          <div className={styles.rightContainer}>
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
