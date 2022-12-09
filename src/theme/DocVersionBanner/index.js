import React, { useEffect, useState } from "react";
import { useLocation } from "@docusaurus/router";

export default function DocVersionBannerWrapper(props) {
  const location = useLocation();
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (location.pathname.includes("current")) {
      setShown(false);
    }
  }, [location.pathname]);

  return (
    <>
      {shown && (
        <div
          className="theme-doc-version-banner alert alert--warning margin-bottom--md"
          role="alert"
        >
          You are viewing the documentation of an unreleased version of RisingWave.{" "}
          <b>
            <a href="/docs/current/architecture/"> → Switch to the current public release</a>
          </b>
        </div>
      )}
      {/* <DocVersionBanner {...props} /> */}
    </>
  );
}
