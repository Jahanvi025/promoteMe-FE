import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {
    primary: {
      light: "rgba(119, 118, 122, 1)",
      main: "rgba(12, 143, 252, 1)",
      dark: "rgba(29, 26, 34, 1)",
      contrastText: "#fff",
    },
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "initial",
        },
      },
    },
  },
});

export default theme;
