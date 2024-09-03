import * as React from "react";
import { ResponsiveStyleValue } from "@mui/system";
import Grid, { GridDirection } from "@mui/material/Grid";

type Props = {
  children: React.ReactNode;
  spacing: number;
  justifyContent: string;
  alignItems: string;
  justifyItems: string;
  direction: ResponsiveStyleValue<GridDirection>;
};

export default function ResponsiveGrid({
  children,
  spacing,
  justifyContent,
  alignItems,
  direction,
  justifyItems,
  ...rest
}: Props) {
  return (
    <Grid
      width="100%"
      direction={direction}
      spacing={spacing}
      alignItems={alignItems}
      justifyItems={justifyItems}
      justifyContent={justifyContent}
      {...rest}
    >
      {children}
    </Grid>
  );
}
