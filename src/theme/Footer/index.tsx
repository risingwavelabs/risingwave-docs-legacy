import React from "react";
import { useLocation } from "@docusaurus/router";
import Footer from "@theme-original/Footer";
import type FooterType from "@theme/Footer";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
  const location = useLocation();
  return (
    <>
      {location?.pathname?.includes?.("cloud") ? (
        <img
          style={{ display: "none" }}
          referrerPolicy="no-referrer-when-downgrade"
          src="https://static.scarf.sh/a.png?x-pxid=63a86d76-f62d-4852-9f08-79a13d42ec3c"
        />
      ) : (
        <img
          style={{ display: "none" }}
          referrerPolicy="no-referrer-when-downgrade"
          src="https://static.scarf.sh/a.png?x-pxid=2e45a652-ff43-4a5a-a189-3c27f799428c"
        />
      )}
      <Footer {...props} />
    </>
  );
}
