import React from "react";
import { Typography, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
const Landing = () => {
  return (
    <div
      style={{
        height: "85vh",
        margin: "0px",
        padding: "px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Todo App
      </Typography>
      <Button variant="contained">
        <NavLink
          to="/users/signup"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Get Started
        </NavLink>
      </Button>
    </div>
  );
};

export default Landing;
