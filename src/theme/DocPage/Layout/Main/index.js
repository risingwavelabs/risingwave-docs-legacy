import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';
export default function DocPageLayoutMain({hiddenSidebarContainer, children}) {
  const [iscloud,setIscloud] = useState(false)
  const sidebar = useDocsSidebar();
  useEffect(()=>{
    if(window?.location?.pathname?.includes?.('cloud')){
      setIscloud(true)
    }
  },[])
  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced,
      )}>
        {iscloud ? <img referrerpolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=63a86d76-f62d-4852-9f08-79a13d42ec3c" /> :
        <img referrerpolicy="no-referrer-when-downgrade" src="https://static.scarf.sh/a.png?x-pxid=2e45a652-ff43-4a5a-a189-3c27f799428c" />
        }
      <div
        className={clsx(
          'container padding-top--md padding-bottom--lg',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced,
        )}>
        {children}
      </div>
    </main>
  );
}
