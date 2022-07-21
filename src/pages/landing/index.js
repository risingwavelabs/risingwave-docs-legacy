import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import ThemedImage from "@theme/ThemedImage";
import HomePageWave from "@site/src/components/HomePageWave";
import LogoSvg from "@site/static/img/logo.svg";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useColorMode } from '@docusaurus/theme-common'
import HomepageFeature from "@site/src/components/HomepageFeature";
import HomepageBanner from "@site/src/components/HomepageBanner";
import useWindowSize from "@site/src/hooks/useWindowSize";
import { Button } from "@mui/material";
import styled from "@emotion/styled";
import Translate from "@docusaurus/Translate";
import HomepageIntro from "@site/src/components/HomepageIntro";
import TextSvgLight from "@site/static/img/rw-text-white.svg";
import TextSvgDark from "@site/static/img/rw-text-black.svg";

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

  return (
    <HeroBanner>
      <div>
        <LogoSvg width={windowSize.height * 0.17} height={windowSize.height * 0.17} />
      </div>
      <div >
        {isDarkTheme ? (
          <TextSvgLight width={windowSize.height * 0.25} height={windowSize.height * 0.1} />
        ) : (
          <TextSvgDark width={windowSize.height * 0.25} height={windowSize.height * 0.1}/>
        )}
      </div>
      <ButtonGroup windoWidth={windowSize.width}>
        <Link to={`/docs/${siteMetadata.siteVersion}/intro`}>
          <Button variant="contained" sx={{ width: 200, margin: "5px", textTransform: "none" }}>
            <Translate>Read Docs</Translate>
          </Button>
        </Link>
        <Link to={`https://playground.risingwave.dev/`}>
          <Button variant="outlined" sx={{ width: 200, margin: "5px", textTransform: "none" }}>
            <Translate>Try Demo</Translate>
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
          <span>🥇 Join our first code camp! <Link to="https://www.singularity-data.com/events/code-camp/">Learn More</Link></span>
        } /> */}
        <div style={{
          height: "100vh",
          minHeight: "700px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div style={{ zIndex: 2 }}><HomepageHeader /></div>
          <div style={{ zIndex: 1 }}><HomePageWave /></div>
        </div>

        {/* <div style={{ marginLeft: "5vw", marginRight: "5vw" }}>
          <HomepageIntro />
          <HomepageFeature />
        </div> */}
      </main>
    </Layout>
  );
}
