import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import ThemedImage from "@theme/ThemedImage";
import HomePageWave from "@site/src/components/HomePageWave";
import LogoSvg from "@site/static/img/logo.svg";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useColorMode } from "@docusaurus/theme-common";
import HomepageFeature from "@site/src/components/HomepageFeature";
import HomepageBanner from "@site/src/components/HomepageBanner";
import useWindowSize from "@site/src/hooks/useWindowSize";
import { Button } from "@mui/material";
import styled from "@emotion/styled";
import Translate from "@docusaurus/Translate";
import HomepageIntro from "@site/src/components/HomepageIntro";
import TextSVGBlack from "./TextSVGBlack";
import SVGText from "./RisingWaveText";

const ButtonGroup = styled("div")((props) => ({
  display: "flex",
  flexDirection: props.windoWidth < 768 ? "column" : "row",
  alignItems: "center",
  justifyContent: "center",
}));

const HeroBanner = styled("div")(() => ({
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  padding: "1rem",
  height: "calc(100vh - 350px)",
  minHeight: "350px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
}));

function HomepageHeader() {
  const windowSize = useWindowSize();
  const { siteMetadata } = useDocusaurusContext();
  const { isDarkTheme } = useColorMode();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(isDarkTheme);
  }, [isDarkTheme]);

  return (
    <HeroBanner>
      <div>
        <LogoSvg width="200" height="200" />
      </div>
      <div>
        <SVGText width="250" height="100" fill={dark ? "#fff" : "#000"} />
      </div>
      <ButtonGroup windoWidth={windowSize.width}>
        <Link to={`/docs/current/intro`}>
          <Button variant="contained" sx={{ width: 200, margin: "5px", textTransform: "none" }}>
            <Translate>Docs</Translate>
          </Button>
        </Link>
        <Link to={`https://playground.risingwave.dev/`}>
          <Button
            variant="outlined"
            sx={{
              width: 200,
              margin: "5px",
              textTransform: "none",
              color: dark ? "#fff" : "#1976d2",
            }}
          >
            <Translate>Try it out</Translate>
          </Button>
        </Link>
      </ButtonGroup>
    </HeroBanner>
  );
}

export default function Home() {
  // useEffect(() => {
  //   window.location.href = window.location.href + "docs/latest/intro";
  // }, []);

  return (
    <Layout title={`Home`} description="RisingWave Community and Docs">
      <main>
        {/* <HomepageBanner content={
          <span>🥇 Join our first code camp! <Link to="https://www.risingwave.com/events/code-camp/">Learn More</Link></span>
        } /> */}
        <div
          style={{
            height: "100vh",
            minHeight: "700px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ zIndex: 2 }}>
            <HomepageHeader />
          </div>
          <div style={{ zIndex: 1 }}>
            <HomePageWave />
          </div>
        </div>

        {/* <div style={{ marginLeft: "5vw", marginRight: "5vw" }}>
          <HomepageIntro />
          <HomepageFeature />
        </div> */}
      </main>
    </Layout>
  );
}
