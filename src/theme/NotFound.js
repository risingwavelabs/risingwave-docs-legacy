import React, { useEffect } from "react";
import NotFound from "@theme-original/NotFound";
import { useHistory, useLocation } from "@docusaurus/router";

export default function NotFoundWrapper(props) {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const paths = location.pathname.split("/");
    const version = paths[2];
    const slug = paths[3];

    if (version === "latest") {
      const res = window.location.href.replace(version, "current");
      window.location.replace(res);
    } else if (version === "current") {
      history.push(`/docs/current/intro`);
    }
  }, []);

  return (
    <>
      <NotFound {...props} />
    </>
  );
}
