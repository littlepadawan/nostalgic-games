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
      <Link to="/" className="navbar-brand" style={NavigationStyles.home}>
        Games
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto" style={NavigationStyles.customNav}>
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
            style={NavigationStyles.neonPurple}
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
