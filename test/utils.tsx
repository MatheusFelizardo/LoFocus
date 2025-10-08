import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: { mode: "light" },
  shape: { borderRadius: 16 },
});

function TestProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function renderWithProviders(ui: React.ReactElement, options?: any) {
  return render(ui, { wrapper: TestProviders, ...options });
}

export * from "@testing-library/react";
