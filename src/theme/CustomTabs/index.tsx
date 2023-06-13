import React, { cloneElement, useState } from "react";
import clsx from "clsx";
import {
  useScrollPositionBlocker,
  useTabs,
} from "@docusaurus/theme-common/internal";
import useIsBrowser from "@docusaurus/useIsBrowser";
import styles from "./styles.module.css";
import DocSidebarItemCategory from "../DocSidebarItem/Category";
import DocSidebarItemLink from "../DocSidebarItem/Link";
import DocSidebarItemHtml from "../DocSidebarItem/Html";

type Props = {};

const myLinksSidebar = [
  {
    type: "doc",
    id: "intro",
    label: "RisingWave",
    href: "",
  },
  {
    type: "doc",
    id: "use-cases",
    label: "Use cases",
    href: "",
  },
  {
    type: "doc",
    id: "architecture",
    label: "Architecture",
    href: "",
  },
  {
    type: "doc",
    id: "key-concepts",
    label: "Key concepts",
    href: "",
  },
  {
    type: "doc",
    label: "Fault tolerance",
    id: "fault-tolerance",
    href: "",
  },
];

function TabMenu({ item, idx, step, setStep, ...props }) {
  return (
    <DocSidebarItemLink
      className={step === idx ? "menu__link--active" : ""}
      item={item}
      {...props}
    />
  );
}

function TabList({ className, block, selectedValue, selectValue, tabValues }) {
  const tabRefs = [];
  const { blockElementScrollPositionUntilNextRender } =
    useScrollPositionBlocker();
  const handleTabChange = (event) => {
    const newTab = event.currentTarget;
    const newTabIndex = tabRefs.indexOf(newTab);
    const newTabValue = tabValues[newTabIndex].value;
    if (newTabValue !== selectedValue) {
      blockElementScrollPositionUntilNextRender(newTab);
      selectValue(newTabValue);
    }
  };
  const handleKeydown = (event) => {
    let focusElement = null;
    switch (event.key) {
      case "Enter": {
        handleTabChange(event);
        break;
      }
      case "ArrowRight": {
        const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
        focusElement = tabRefs[nextTab] ?? tabRefs[0];
        break;
      }
      case "ArrowLeft": {
        const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
        focusElement = tabRefs[prevTab] ?? tabRefs[tabRefs.length - 1];
        break;
      }
      default:
        break;
    }
    focusElement?.focus();
  };
  return (
    <ul
      role="tablist"
      aria-orientation="horizontal"
      className={clsx(
        "tabs",
        {
          "tabs--block": block,
        },
        className
      )}
    >
      {tabValues.map(({ value, label, attributes }) => (
        <li
          // TODO extract TabListItem
          role="tab"
          tabIndex={selectedValue === value ? 0 : -1}
          aria-selected={selectedValue === value}
          key={value}
          ref={(tabControl) => tabRefs.push(tabControl)}
          onKeyDown={handleKeydown}
          onClick={handleTabChange}
          {...attributes}
          className={clsx("tabs__item", styles.tabItem, attributes?.className, {
            "tabs__item--active": selectedValue === value,
          })}
        >
          {label ?? value}
        </li>
      ))}
    </ul>
  );
}

function TabContent({ lazy, children, selectedValue }) {
  const childTabs = (Array.isArray(children) ? children : [children]).filter(
    Boolean
  );
  if (lazy) {
    const selectedTabItem = childTabs.find(
      (tabItem) => tabItem.props.value === selectedValue
    );
    if (!selectedTabItem) {
      // fail-safe or fail-fast? not sure what's best here
      return null;
    }
    return cloneElement(selectedTabItem, { className: "margin-top--md" });
  }
  return (
    <div className="margin-top--md">
      {childTabs.map((tabItem, i) =>
        cloneElement(tabItem, {
          key: i,
          hidden: tabItem.props.value !== selectedValue,
        })
      )}
    </div>
  );
}

function TabsComponent(props) {
  const tabs = useTabs(props);
  const [step, setStep] = useState(0);

  console.log({ ...props });
  return (
    <div className={styles.flex}>
      <div className={styles.flexCol}>
        {myLinksSidebar.map((i, idx) => (
          <TabMenu
            key={i.label}
            item={i}
            idx={idx}
            step={step}
            setStep={setStep}
          />
        ))}
      </div>
      <div className={clsx("tabs-container", styles.tabList)}>
        <TabList {...props} {...tabs} />
        <TabContent {...props} {...tabs} />
      </div>
    </div>
  );
}

function CustomTabs(props) {
  const isBrowser = useIsBrowser();
  return <TabsComponent key={String(isBrowser)} {...props} />;
}

export default CustomTabs;
