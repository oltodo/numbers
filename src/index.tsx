import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Source Sans Pro", "Helvetica", "Arial", sans-serif',
    fontWeightMedium: 600,
  },
  palette: {
    background: {
      default: "#0f2c62",
    },
    primary: {
      main: "#44d7b6",
    },
    type: "dark",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
