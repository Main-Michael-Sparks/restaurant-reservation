import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {

  // Renders the menu and every other component into a responsive container.
  return (
      <div className="container-fluid">
            <Menu />
            <Routes />
      </div>
  )
}

export default Layout;
