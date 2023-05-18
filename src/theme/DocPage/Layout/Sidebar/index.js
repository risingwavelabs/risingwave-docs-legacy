import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import { useLocation } from '@docusaurus/router';
import DocSidebar from '@theme/DocSidebar';
import ExpandButton from '@theme/DocPage/Layout/Sidebar/ExpandButton';
import styles from './styles.module.css';
import useWindowSize from "./../../../../hooks/useWindowSize"

// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({ children }) {
  const sidebar = useDocsSidebar();
  return (
    <React.Fragment key={sidebar?.name ?? 'noSidebar'}>
      {children}
    </React.Fragment>
  );
}
export default function DocPageLayoutSidebar({
  sidebar,
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
}) {

  const size = useWindowSize();
  const { pathname } = useLocation();
  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }
    setHiddenSidebarContainer((value) => !value);
  }, [setHiddenSidebarContainer, hiddenSidebar]);

  useEffect(() => {
    if (size.width <= 1200) {
      setHiddenSidebar(true);
      setHiddenSidebarContainer(true);
    } else if (size.width >= 1536) {
      setHiddenSidebar(false);
      setHiddenSidebarContainer(false);
    }
  }, [size])

  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        styles.docSidebarContainer,
        hiddenSidebarContainer && styles.docSidebarContainerHidden,
      )}
      onTransitionEnd={(e) => {
        if (!e.currentTarget.classList.contains(styles.docSidebarContainer)) {
          return;
        }
        if (hiddenSidebarContainer) {
          setHiddenSidebar(true);
        }
      }}>
      <ResetOnSidebarChange>
        <div
          className={clsx(
            styles.sidebarViewport,
            hiddenSidebar && styles.sidebarViewportHidden,
          )}>
          <DocSidebar
            sidebar={sidebar}
            path={pathname}
            onCollapse={toggleSidebar}
            isHidden={hiddenSidebar}
          />
          {hiddenSidebar && <ExpandButton toggleSidebar={toggleSidebar} />}
        </div>
      </ResetOnSidebarChange>
    </aside>
  );
}
