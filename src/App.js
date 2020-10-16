import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import Login from "./pages/login";
import QrScanner from "./pages/qr-scanner";

export default function App() {
  const [token, setToken] = useState();
  const [regNo, setRegNo] = useState();
  const [route, setRoute] = useState();
  const [isLoading,setIsLoading]=useState();

  const login = useCallback((regNo, token, route) => {
    setToken(token);
    setRegNo(regNo);
    setRoute(route);
    setIsLoading(true);

    localStorage.setItem(
      "busData",
      JSON.stringify({
        regNo: regNo,
        token: token,
        route: route,
      })
    );
    console.log("auto logged in" + route + " " + token);
  }, []);

  // automatic login at start up (using local storage)
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("busData"));
    if (storedData && storedData.token) {
      login(storedData.regNO, storedData.token, storedData.route);
    }
  }, [login]);

  let reactRoutes;
  if (token) {
    reactRoutes = (
      <Switch>
        <Route path="/" exact>
          <QrScanner />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    reactRoutes = (
      <Switch>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        regNo: regNo,
        route: route,
        login: login,
      }}
    >
      <Router>{reactRoutes}</Router>
    </AuthContext.Provider>
  );
}
