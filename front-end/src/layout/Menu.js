import React from "react";

import { Link, useLocation } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {

  // Uses location hook for the navbar tabs. 
  const location = useLocation();
  const root = location.pathname === "/" ? "nav-link active" : "nav-link";
  const dashboard = location.pathname === "/dashboard" ? "nav-link active" : "nav-link";
  const search = location.pathname === "/search" ? "nav-link active" : "nav-link";
  const reservation = location.pathname === "/reservations/new" ? "nav-link active" : "nav-link";
  const tables = location.pathname === "/tables/new" ? "nav-link active" : "nav-link";

  // Displays the navigation bar.
  return (
    <ul className="nav nav-tabs flex-column flex-md-row bg-light">
      <li className="nav-item ">
        <Link to="/" className={root}>
          <span>Periodic Tables</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className={dashboard} to="/dashboard">
          <span className="oi oi-dashboard" />
          &nbsp;Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <Link className={search} to="/search">
          <span className="oi oi-magnifying-glass" />
          &nbsp;Search
        </Link>
      </li>
      <li className="nav-item">
        <Link className={reservation} to="/reservations/new">
          <span className="oi oi-plus" />
          &nbsp;New Reservation
        </Link>
      </li>
      <li className="nav-item">
        <Link className={tables} to="/tables/new">
          <span className="oi oi-layers" />
          &nbsp;New Table
        </Link>
      </li>
    </ul>
  );
}

export default Menu;
