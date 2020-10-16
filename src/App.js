import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import Login from "./pages/login";
import Logout from "./pages/logout";
import QrScanner from "./pages/qr-scanner";

export default function App() {
  const [token, setToken] = useState();
  const [regNo, setRegNo] = useState();
  const [route, setRoute] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((regNo, token, route) => {
    setToken(token);
    setRegNo(regNo);
    setRoute(route);
    

    localStorage.setItem(
      "busData",
      JSON.stringify({
        regNo: regNo,
        token: token,
        route: route,
      })
    );

    console.log("auto logged in" + route + " " + token);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setRegNo(null);
    setRoute(null);

    localStorage.removeItem("busData");
    localStorage.clear();
    return <Redirect to={"/login"} />;
  }, []);

  // automatic login at start up (using local storage)
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("busData"));
    if (storedData && storedData.token) {
      login(storedData.regNO, storedData.token, storedData.route);
    }
    setIsLoading(false);
  }, [login]);

  let reactRoutes;
  if (token) {
    reactRoutes = (
      <Switch>
        <Route path="/" exact>
          <QrScanner />
        </Route>
        <Route path="/logout" exact>
          <Logout />
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
        logout: logout,
      }}
    >
      {!isLoading&&<Router>{reactRoutes}</Router>}
    </AuthContext.Provider>
  );
}
