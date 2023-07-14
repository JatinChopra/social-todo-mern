import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Box,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const Signup = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [alertText, setAlertText] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const formHandler = (e) => {
    setLoading(true);
    e.preventDefault();
    setAlertText("");
    setAlertSeverity("");

    if (!user.username || !user.password || !user.email) {
      setLoading(false);
      setAlertText("Please fill all the fields");
      setAlertSeverity("error");
      return;
    }

    // send request to create a new user and handle any errors
    axios
      .post("http://localhost:3000/users/signup", user)
      .then((result) => {
        setAlertSeverity("success");
        setAlertText(result.data.message);
        setLoading(false);
        setUser({
          username: "",
          email: "",
          password: "",
        });
      })
      .catch((err) => {
        setAlertSeverity("error");
        setAlertText(err.response.data.message);

        setLoading(false);
      });
  };

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ mt: "38px", mb: "24px" }}>
          Create a new account
        </Typography>
        {!!alertText ? (
          <Alert severity={alertSeverity} sx={{ mb: "28px" }}>
            <AlertTitle>{alertSeverity}</AlertTitle>
            {alertText} —{" "}
            <strong>
              <NavLink to="/users/login" style={{ color: "inherit" }}>
                Login
              </NavLink>
            </strong>
          </Alert>
        ) : (
          <></>
        )}

        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <TextField
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            placeholder="Username"
            sx={{ mb: "18px" }}
            value={user.username}
            onChange={onChangeHandler}
          />
          <TextField
            required
            fullWidth
            type="email"
            id="Email"
            label="Email"
            name="email"
            placeholder="Email"
            sx={{ mb: "18px" }}
            value={user.email}
            onChange={onChangeHandler}
          />
          <TextField
            required
            fullWidth
            type="password"
            id="Password"
            name="password"
            label="Password"
            placeholder="Password"
            sx={{ mb: "18px" }}
            value={user.password}
            onChange={onChangeHandler}
          />
          <LoadingButton
            loading={loading}
            variant="contained"
            fullWidth
            sx={{ mr: "auto", ml: "auto", maxWidth: "70%" }}
            onClick={formHandler}
          >
            Sign up
          </LoadingButton>
        </Box>
      </Container>
    </>
  );
};

export default Signup;
