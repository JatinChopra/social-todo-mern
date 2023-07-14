import React, { useState, useEffect } from "react";
import { Box, List, ListItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

// setup this when accepting or rejecting a request
import CircularProgress from "@mui/material/CircularProgress";

// import CircularProgress from "@mui/joy/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import axios from "axios";
import useLocalStorageState from "use-local-storage-state";

const RequestsPanel = ({ sent, received, fetchRequests, fetchFriends }) => {
  const [loading, setLoading] = useState(false);
  const [dense, setDense] = useState(true);
  const [token, setToken] = useLocalStorageState("token");

  useEffect(() => {
    fetchRequests();
  }, []);

  const requestHandler = (item) => {
    setLoading(true);
    axios
      .post("http://localhost:3000/users/handle-request", item, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        fetchRequests();
        fetchFriends();
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error while accepting or rejecting request ", err.message);
      });
  };

  return (
    <Box sx={{ height: "100%" }}>
      <List dense={dense}>
        {received.map((item, index) => {
          return (
            <CustomReceivedListItem
              key={Math.random().toString(36).substr(2, 9)}
              item={item}
              requestHandler={requestHandler}
              loading={loading}
            />
          );
        })}
        {sent.map((item) => {
          return (
            <CustomSentListItem
              key={Math.random().toString(36).substr(2, 9)}
              item={item}
              requestHandler={requestHandler}
            />
          );
        })}
      </List>
    </Box>
  );
};

const CustomSentListItem = ({ item, requestHandler }) => {
  const [reqobj, setReqobj] = useState(item);

  // isko pending kardiyo !=pending

  if (item.status !== "pending") {
    return (
      <ListItem>
        <ListItemText
          primary={"Sent to: " + item.recipientUsername}
          secondary={item.status + "ed"}
        />
      </ListItem>
    );
  } else {
    return (
      <ListItem>
        <ListItemText primary={"Sent to: " + item.recipientUsername} />
      </ListItem>
    );
  }
};

const CustomReceivedListItem = ({ item, requestHandler, loading }) => {
  const [reqobj, setReqobj] = useState(item);
  if (item.status !== "pending") {
    return (
      <ListItem>
        <ListItemText
          primary={"Received from: " + item.senderUsername}
          secondary={item.status + "ed"}
        />
      </ListItem>
    );
  } else {
    return (
      <ListItem
        secondaryAction={
          loading ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <IconButton
                edge="end"
                aria-label="reject"
                sx={{ mr: "8px" }}
                onClick={() => {
                  requestHandler({ ...reqobj, status: "reject" });
                }}
              >
                <CancelIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="accept"
                onClick={() => {
                  requestHandler({ ...reqobj, status: "accept" });
                }}
              >
                <CheckCircleIcon />
              </IconButton>
            </>
          )
        }
      >
        <ListItemText primary={"Received from: " + item.senderUsername} />
      </ListItem>
    );
  }
};

export default RequestsPanel;
