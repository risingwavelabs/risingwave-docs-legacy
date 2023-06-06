import React, { useEffect } from "react";
import { useHistory, useLocation } from "@docusaurus/router";
type Props = {
    queryString: string
};

function getCurrentPlatform () {
  const platform = window.navigator.platform;
  if (/Mac/.test(platform)) {
    return "macOS";
  } else if (/Win/.test(platform)) {
    return "Windows";
  } else if (/Linux/.test(platform)) {
    return "Linux";
  } else {
    return "unknown platform";
  }
}

function PlatformDetector({queryString}: Props) {
  const history = useHistory();
  const location = useLocation();

  useEffect(()=>{
    switch (getCurrentPlatform()) {
      case "macOS":
        history.push(`${location.pathname.toString()}?${queryString}=macos`)
        break;
      case "Windows":
        history.push(`${location.pathname.toString()}?${queryString}=linux`)
        break;
      case "Linux":
        history.push(`${location.pathname.toString()}?${queryString}=linux`)
        break;
      default:
    }
  },[])

  return <></>;
}

export default PlatformDetector;
