import React, { useContext } from "react";

/// React router dom
import {  Switch, Route } from "react-router-dom";

/// Css
import "./index.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";


import AccessRequests from "./components/Dashboard/AccessRequests";


/// Pages
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import LockScreen from "./pages/LockScreen";
import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";
import { ThemeContext } from "../context/ThemeContext";

const Markup = () => {
  const { menuToggle } = useContext(ThemeContext);
  const routes = [
    /// Dashboard
    { url: "", component: AccessRequests  },
    { url: "requests-list", component: AccessRequests },


    /// pages
    { url: "page-register", component: Registration },
    { url: "page-lock-screen", component: LockScreen },
    { url: "page-login", component: Login },
    { url: "page-forgot-password", component: ForgotPassword },
    { url: "page-error-400", component: Error400 },
    { url: "page-error-403", component: Error403 },
    { url: "page-error-404", component: Error404 },
    { url: "page-error-500", component: Error500 },
    { url: "page-error-503", component: Error503 },
  ];
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  let pagePath = path.split("-").includes("page");
  return (
    <>
      <div
        id={`${!pagePath ? "main-wrapper" : ""}`}
        className={`${!pagePath ? "show" : "mh100vh"}  ${
          menuToggle ? "menu-toggle" : ""
        }`}
      >
        {!pagePath && <Nav />}

        <div className={`${!pagePath ? "content-body" : ""}`}>
          <div
            className={`${!pagePath ? "container-fluid" : ""}`}
            style={{ minHeight: window.screen.height - 60 }}
          >
            <Switch>
              {routes.map((data, i) => (
                <Route
                  key={i}
                  exact
                  path={`/${data.url}`}
                  component={data.component}
                />
              ))}
            </Switch>
          </div>
        </div>
        {!pagePath && <Footer />}
      </div>
    </>
  );
};

export default Markup;
