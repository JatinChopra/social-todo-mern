import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { List, ListItem, ListItemText } from "@mui/material";
import RequestsPanel from "./RequestsPanel";
import LoadingButton from "@mui/lab/LoadingButton";
import ListItemButton from "@mui/material/ListItemButton";
import axios from "axios";
import useLocalStorageState from "use-local-storage-state";

const SideBar = ({ fetchFriendTodos, setTodos }) => {
  const [received, setReceived] = useState([]);
  const [sendRequestLoader, setSendRequestLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState([]);
  const [username, setUsername] = useState("");
  const [tabValue, setTabValue] = React.useState("1");
  const [token, setToken] = useLocalStorageState("token");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = () => {
    axios
      .get("http://localhost:3000/users/friends", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setFriends(res.data.friends);
      })
      .catch((err) => {
        console.log("error while fetching users ");
      });
  };

  const fetchRequests = () => {
    axios
      .get("http://localhost:3000/users/requests", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setReceived(res.data.received);
        setSent(res.data.sent);
      })
      .catch((err) => {
        console.log("Error caught while fetching requests array ");
      });
  };

  const sendRequestHandler = () => {
    setSendRequestLoader(true);
    axios
      .post(
        "http://localhost:3000/users/sendRequest",
        {
          username: username,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        fetchRequests();
        fetchFriends();
        setSendRequestLoader(false);
      })
      .catch((err) => {
        console.log("Error while sending a friend reqest");
      });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "95%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TextField
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        sx={{ mt: "18px", width: "92%" }}
        placeholder="username"
        label="Send Friend Request"
      />
      <div style={{ marginTop: "8px", width: "92%" }}>
        {sendRequestLoader ? (
          <LoadingButton
            loading={sendRequestLoader}
            variant="contained"
            sx={{ float: "right", width: "100px" }}
          >
            <span>Send</span>
          </LoadingButton>
        ) : (
          <Button
            onClick={sendRequestHandler}
            sx={{ float: "right", width: "100px" }}
            variant="contained"
          >
            Send
          </Button>
        )}
      </div>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          mt: "18px",
        }}
      >
        <TabContext value={tabValue} sx={{ width: "100%" }}>
          <Box sx={{ width: "100%" }}>
            <TabList onChange={handleTabChange}>
              <Tab label="Requests" value="1" sx={{ width: "50%" }} />
              <Tab label="Friends" value="2" sx={{ width: "50%" }} />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ height: "85%" }}>
            <RequestsPanel
              sent={sent}
              received={received}
              fetchRequests={fetchRequests}
              fetchFriends={fetchFriends}
            />
          </TabPanel>
          <TabPanel value="2" sx={{ height: "85%" }}>
            <List>
              {friends.map((item, index) => {
                return (
                  <FriendListItem
                    key={index}
                    item={item}
                    fetchFriendTodos={fetchFriendTodos}
                  />
                );
              })}
            </List>
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

const FriendListItem = ({ item, fetchFriendTodos }) => {
  const [friend, setFriend] = useState(item);

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => {
          fetchFriendTodos({ friend: friend });
        }}
      >
        <ListItemText primary={friend.userName} />
        {/* <ListItemText primary={"hello"} /> */}
      </ListItemButton>
    </ListItem>
  );
};
export default SideBar;
