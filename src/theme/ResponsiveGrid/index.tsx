import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

type Props = {
  nums: number;
  cols: number;
  children: React.ReactNode;
};

export default function ResponsiveGrid({ nums, cols, children }: Props) {
  return (
    <Box sx={{ flexGrow: 1, flexWrap: "wrap" }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        alignItems="center"
        justifyItems="center"
      >
        {Array.from(Array(nums)).map((_, index) => (
          <Grid item xs={12} sm={6} md={6} lg={12 / cols} key={index}>
            {children[index]}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
