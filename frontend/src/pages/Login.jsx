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
import { useNavigate } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [alertText, setAlertText] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useLocalStorageState("token");

  const onChangeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const formHandler = (e) => {
    setLoading(true);
    e.preventDefault();
    setAlertText("");
    setAlertSeverity("");

    if (!user.username || !user.password) {
      setLoading(false);
      setAlertText("Please fill all the fields");
      setAlertSeverity("error");
      return;
    }

    // send request to create a new user and handle any errors
    axios
      .post("http://localhost:3000/users/login", user)
      .then((result) => {
        setAlertSeverity("success");
        setAlertText(result.data.message);
        setLoading(false);
        setUser({
          username: "",
          password: "",
        });
        setToken(result.data.token);
        navigate("/home");
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
            {alertText}
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
            Login
          </LoadingButton>
        </Box>
      </Container>
    </>
  );
};

export default Login;
