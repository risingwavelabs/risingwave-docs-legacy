import React from "react";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import IconClose from "@theme/Icon/Close";
import NavbarLogo from "@theme/Navbar/Logo";
import { useThemeConfig } from "@docusaurus/theme-common";
import NavbarItem from "@theme/NavbarItem";
import styles from "./styles.module.css";
function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items;
}
function CloseButton() {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <button
      type="button"
      aria-label={translate({
        id: "theme.docs.sidebar.closeSidebarButtonAriaLabel",
        message: "Close navigation bar",
        description: "The ARIA label for close button of mobile sidebar",
      })}
      className="clean-btn navbar-sidebar__close"
      onClick={() => mobileSidebar.toggle()}
    >
      <IconClose color="var(--ifm-color-emphasis-600)" />
    </button>
  );
}
export default function NavbarMobileSidebarHeader() {
  const items = useNavbarItems().filter((item) => item?.className?.includes("github-link"));
  const mobileSidebar = useNavbarMobileSidebar();
  console.log(items[0]);
  return (
    <div className="navbar-sidebar__brand">
      <NavbarLogo />
      <NavbarColorModeToggle className="margin-right--md" />
      <div className={styles.githubIcon}>
        <NavbarItem mobile {...items[0]} onClick={() => mobileSidebar.toggle()} />
      </div>
      <div className={styles.githubIcon}></div>
      <CloseButton />
    </div>
  );
}
