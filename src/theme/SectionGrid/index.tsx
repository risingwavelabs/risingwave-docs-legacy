import React from "react";
import styles from "./styles.module.css";

type Icons = {
  name: string;
  icon: React.JSX.Element;
  href: string;
};

type Props = {
  children: React.ReactNode;
  icons: Icons[];
};

const EduIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
    ></path>
  </svg>
);

function SectionGrid({ children, icons }: Props) {
  return (
    <section>
      <div className={styles.sectionContainer}>
        <div className={styles.gridContainer}>
          <div className={styles.leftContainer}>{children}</div>

          <div className={styles.rightContainer}>
            {icons?.map((icon) => (
              <a key={icon.name} className={styles.iconContainer} href={icon.href}>
                <span className={styles.iconBox}>{icon.icon}</span>

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
