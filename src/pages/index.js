import React, { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    window.location.href = window.location.href + "home";
    // window.location.href = window.location.href + "landing";
  }, []);

  return <></>;
}
