import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavigationStyles from "./NavigationStyles.js";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      variant="light"
      style={NavigationStyles.customNavbar}
    >
      <Link to="/" className="navbar-brand" style={NavigationStyles.brand}>
        <span style={NavigationStyles.neonBlue}>G</span>
        <span style={NavigationStyles.neonOrange}>A</span>
        <span style={NavigationStyles.neonPink}>M</span>
        <span style={NavigationStyles.neonYellow}>E</span>
        <span style={NavigationStyles.neonGreen}>S</span>
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse
        id="responsive-navbar-nav"
        style={NavigationStyles.responsiveNavbar}
      >
        <Nav className="mr-auto" style={NavigationStyles.mrAuto}>
          <Link
            to="/memory"
            className="nav-link"
            style={NavigationStyles.neonBlue}
          >
            Memory
          </Link>
          <Link
            to="/snake"
            className="nav-link"
            style={NavigationStyles.neonPink}
          >
            Snake
          </Link>
          <Link
            to="/minesweeper"
            className="nav-link"
            style={NavigationStyles.neonYellow}
          >
            Minesweeper
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
