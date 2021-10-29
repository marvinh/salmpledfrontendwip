import * as React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import ButtonAppBar from "./components/ButtonAppBar";
import { Box, CircularProgress, createTheme, CssBaseline } from "@mui/material";
import { AuthProvider, AuthContext } from "./providers/AuthContext";

import Dashboard from "./components/Dashboard";
import CreateSamplePack from "./components/CreateSamplePack";
import Login from "./components/Login";
import { Redirect } from "react-router";
import { useContext } from "react";
import { ThemeProvider } from "@emotion/react";


function PrivateRoute({ children, ...rest }) {
  const { user, loading } = useContext(AuthContext);
  console.log("Loading", loading)
  return (
    <>
    {
      loading ? <CircularProgress /> : (
    <Route {...rest} render={({ location }) => {
      return !!user
        ? children
        : <Redirect to={{
           pathname: '/login',
           state: { from: location }
          }} />
    }} />)
  }
  </>
  )
}
const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#181E22",
    },
    secondary: {
      main: "#DEDEDE",
    },
  },
});
const Home = () => {
  return (
    <Box> <p> You are on the homepage </p> </Box>
  )
}

export default function App() {
  return (

    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <Router>
          <div className="App">
            <ButtonAppBar/>
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/login" exact component={Login} />
              <PrivateRoute>
                <Route path="/dashboard" exact component={Dashboard}/>
                <Route path="/createsamplepack/:username/:packid" component={CreateSamplePack}/>
              </PrivateRoute>
            </Switch>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
    
  );
}


