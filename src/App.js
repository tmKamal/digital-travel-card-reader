import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import Login from "./pages/auth/login";
import Logout from "./pages/auth/logout";
import SignUp from "./pages/auth/signup";
import JourneyHistory from "./pages/journey/journey-history";
import MainMenu from "./pages/main-menu";
import MakePayment from "./pages/make-payment/make-payment";


export default function App() {
  const [token, setToken] = useState();
  const [name, setName] = useState();
  const [mgr, setMgr] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((name, token, mgr) => {
    setToken(token);
    setName(name);
    setMgr(mgr);
    

    localStorage.setItem(
      "mgrData",
      JSON.stringify({
        name: name,
        token: token,
        mgr: mgr,
      })
    );

    console.log("auto logged in" + mgr + " " + token);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setName(null);
    setMgr(null);

    localStorage.removeItem("mgrData");
    localStorage.clear();
    return <Redirect to={"/login"} />;
  }, []);

  // automatic login at start up (using local storage)
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("mgrData"));
    if (storedData && storedData.token) {
      login(storedData.name, storedData.token, storedData.mgr);
    }
    setIsLoading(false);
  }, [login]);

  let reactRoutes;
  if (token) {
    reactRoutes = (
      <Switch>
        <Route path="/" exact>
          <MainMenu></MainMenu>
        </Route>
        <Route path="/make-payments" exact>
          <MakePayment></MakePayment>
        </Route>
        <Route path="/journey-history" exact>
          <JourneyHistory></JourneyHistory>
        </Route>

        <Route path="/logout" exact>
          <Logout></Logout>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    reactRoutes = (
      <Switch>
        <Route path="/login" exact>
          <Login></Login>
        </Route>
        <Route path="/signup" exact>
          <SignUp></SignUp>
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
        name: name,
        mgr: mgr,
        login: login,
        logout: logout,
      }}
    >
      {!isLoading&&<Router>{reactRoutes}</Router>}
    </AuthContext.Provider>
  );
}
