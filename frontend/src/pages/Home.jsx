import React, { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Box from "@mui/material/Box";
import { LoadingButton } from "@mui/lab";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import { Typography, Grid } from "@mui/material";
import { useOutletContext } from "react-router-dom";

import CreateList from "../components/CreateList";
import SideBar from "../components/SideBar";

const Home = () => {
  const [token, setToken] = useLocalStorageState("token");
  const [edswitch, setEdswitch] = useState(true);
  const [currentUser, setCurrentUser, loggedinUser, setLoggedinUser] =
    useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);

  const fetchFriendTodos = ({ friend }) => {
    axios
      .post(
        "http://localhost:3000/friends/accessTodos",
        { friend: friend },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        setCurrentUser(friend);
        setTodos(res.data.todos);
        setEdswitch(false);
      });
  };

  const fetchTodos = () => {
    axios
      .get("http://localhost:3000/todo/all", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setTodos(result.data.todos);
        setEdswitch(true);
      });
  };

  useEffect(() => {
    // do a session lookup
    axios
      .get("http://localhost:3000/sessionLookup", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setCurrentUser(result.data);
        setLoggedinUser(result.data.userName);
      })
      .catch((err) => {
        setToken(null);
        navigate("/users/login");
      });

    if (!token) {
      navigate("/");
      return;
    }
    // fetch the todos and populate the todos array
    fetchTodos();
  }, [loading]);

  const addTaskHandler = () => {
    setLoading(true);

    if (!todo) {
      setLoading(false);
      return;
    }

    // call the api to add a new todo
    axios
      .post(
        "http://localhost:3000/todo/new",
        {
          title: todo,
          description: description,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        setTodo("");
        setDescription("");
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error !!!");
      });
  };

  const addFriendTaskHandler = () => {
    let reqObj = {
      friend: currentUser,
      todoData: {
        title: todo,
        description: description,
      },
    };
    setLoading(true);
    axios
      .post("http://localhost:3000/friends/createTodo", reqObj, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setLoading(false);
        fetchFriendTodos({ friend: currentUser });
      })
      .catch((err) => {
        console.log("error while adding a new task for friend.");
      });
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:3000/todo/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        fetchTodos();
      });
  };

  const editTodo = (id) => {
    // add a new property iseditable to true
    let newTodos = todos.map((item) => {
      if (item._id === id) {
        return { ...item, isEditable: true };
      }

      return { ...item, isEditable: false };
    });

    setTodos(newTodos);
  };

  const updateTodo = (id, newTodo) => {
    axios
      .put(`http://localhost:3000/todo/${id}`, newTodo, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        fetchTodos();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <SideBar fetchFriendTodos={fetchFriendTodos} setTodos={setTodos} />
        </Grid>
        <Grid item xs={9}>
          <Box
            sx={{
              width: "100%",
              mr: "42px",
              display: "flex",
              flexDirection: "column",
              // justifyContent: "center",
              alignItems: "center",
              height: "90vh",
            }}
          >
            <Box
              sx={{
                width: "60%",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "center",
                mt: "80px",
              }}
            >
              <TextField
                InputProps={{
                  startAdornment: <PlaylistAddIcon sx={{ mr: "10px" }} />,
                }}
                placeholder=" Add a new todo"
                variant="standard"
                sx={{ mb: "18px" }}
                value={todo}
                onChange={(e) => {
                  setTodo(e.target.value);
                }}
              />
              <TextField
                id="standard-textarea"
                InputProps={{
                  startAdornment: <TextSnippetIcon sx={{ mr: "10px" }} />,
                }}
                placeholder="Add a Description"
                multiline
                variant="standard"
                sx={{ mb: "18px" }}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <LoadingButton
                  size="medium"
                  endIcon={<AddCircleIcon />}
                  loading={loading}
                  onClick={edswitch ? addTaskHandler : addFriendTaskHandler}
                  loadingPosition="end"
                  variant="contained"
                  sx={{ maxWidth: "100px", mr: "8px" }}
                >
                  <span>Add</span>
                </LoadingButton>
              </Box>
            </Box>

            <Box
              sx={{
                width: "60%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                {currentUser.userName}'s Todo List
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <LoadingButton
                  sx={{ mr: "8px" }}
                  size="small"
                  loading={false}
                  onClick={() => {
                    fetchTodos();
                  }}
                  variant="contained"
                >
                  <Typography fontSize={"small"}>My Todos</Typography>
                </LoadingButton>
              </Box>
            </Box>

            <CreateList
              todos={todos}
              edswitch={edswitch}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              updateTodo={updateTodo}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
