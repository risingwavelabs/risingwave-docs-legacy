import React, { useEffect, useState } from "react";
import NotFound from "@theme-original/NotFound";
import type NotFoundType from "@theme/NotFound";
import type { WrapperProps } from "@docusaurus/types";
import { useHistory, useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

type Props = WrapperProps<typeof NotFoundType>;

export default function NotFoundWrapper(props: Props): JSX.Element {
  const { globalData } = useDocusaurusContext();
  const location = useLocation();
  const history = useHistory();
  const [show, setShow] = useState(false);
  console.log('location 1', location.pathname); 
  
  useEffect(() => {
    console.log("location", location.pathname);
    console.log("globalData", globalData["docusaurus-plugin-content-docs"]);
    
    
    const paths = location.pathname.split("/");
    const version = paths[2];
    const slug = paths[3];
    const queries = `${slug}${location.search ?? "/" + location.search}${location.hash ?? "/" + location.hash}`;
    if (version === "latest") {
      const res = window.location.href.replace(version, "current");
      window.location.replace(res);
    } else if (version === "current") {
      history.push(`/docs/current/intro`);
    } else {
      const res = globalData["docusaurus-plugin-content-docs"].default["versions"].find((v, index) => {
        if (index === 0) {
          return v.label.split(" ")[0] === version;
        } else {
          return v.name === version;
        }
      });

      if (res) {
        setShow(true);
      } else {
        const currentVersion = globalData["docusaurus-plugin-content-docs"].default["versions"].find((item) => {
          return item.path === "/docs/current";
        });
        const slugValue = paths[paths.length - 1] ? paths[paths.length - 1] : paths[paths.length - 2];
        const docsExists = currentVersion?.docs?.some((doc) => {
          const docPaths = doc.path.split("/");
          return docPaths[docPaths.length - 1] === slugValue;
        });
        if (docsExists) {
          history.push(`/docs/current/${slugValue}`);
        } else {
          history.push(`/docs/current/${queries}`);
        }
      }
    }
  }, []);

  return <>{show && <NotFound {...props} />}</>;  
}
