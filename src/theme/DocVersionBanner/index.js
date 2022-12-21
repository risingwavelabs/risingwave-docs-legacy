import React, { useEffect, useState } from "react";
import { useLocation } from "@docusaurus/router";

export default function DocVersionBannerWrapper(props) {
  const location = useLocation();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const version = location.pathname.split("/")[2];
    if (version !== "current") {
      setShown(true);
    }
  }, [location.pathname]);

  return (
    <>
      {shown && (
        <div
          className="theme-doc-version-banner alert alert--warning margin-bottom--md"
          role="alert"
        >
          <div>You are viewing the documentation of an unreleased version of RisingWave.</div>
          <b>
            <a href={`/docs/current/${location.pathname.split("/").at(-2)}`}>
              {" "}
              Switch to the current public release →
            </a>
          </b>
        </div>
      )}
      {/* <DocVersionBanner {...props} /> */}
    </>
  );
}
