import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import useLocalStorageState from "use-local-storage-state";

const Root = () => {
  const [token, setToken] = useLocalStorageState("token");
  const [loggedinUser, setLoggedinUser] = useState("");
  const [currentUser, setCurrentUser] = useState({
    message: "",
    userId: "",
    userName: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // check if a token is present

    if (!!token && token.length > 20) {
      // send a request to verify the token
      axios
        .get("http://localhost:3000/sessionLookup", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {
          setCurrentUser(result.data);
        })
        .catch((err) => {
          console.log(err.message);
          setToken(null);
          navigate("/users/login");
        });
    }
  }, []);

  const logoutHandler = (e) => {
    localStorage.clear();
    navigate("/users/login");
  };

  return (
    <div style={{ margin: "0px", padding: "0px" }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "transparent", backdropFilter: "blur(10px)" }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              <NavLink
                to={!!token ? "/home" : "/  "}
                underline="none"
                style={{ textDecoration: "none", color: "#000000" }}
              >
                TODO
              </NavLink>
            </Typography>

            {!!token ? (
              <>
                <Typography sx={{ color: "black", mr: "20px" }}>
                  Logged in as : <br />
                  {loggedinUser}
                </Typography>
                <Button
                  // color="inherit"
                  variant="contained"
                  sx={{ fontWeight: "bold" }}
                  onClick={logoutHandler}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  // color="inherit"
                  variant="contained"
                  sx={{ fontWeight: "bold", mr: "10px" }}
                >
                  <NavLink
                    to="/users/login"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Login
                  </NavLink>
                </Button>

                <Button
                  // color="inherit"
                  variant="contained"
                  sx={{ fontWeight: "bold" }}
                >
                  <NavLink
                    to="/users/signup"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Signup
                  </NavLink>
                </Button>
              </>
            )}
          </Toolbar>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              zIndex: -1,
            }}
          />
        </AppBar>
      </Box>
      <Box sx={{ mt: "80px" }}></Box>
      <Outlet
        context={[currentUser, setCurrentUser, loggedinUser, setLoggedinUser]}
      />
    </div>
  );
};

export default Root;
