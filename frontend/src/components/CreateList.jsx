import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import CustomListItem from "./CustomListItem";

const CreateList = ({ todos, edswitch, deleteTodo, editTodo, updateTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    let obj = todos.find((item) => {
      return item.isEditable === true;
    });
    if (obj) {
      setTitle(obj.title);
      setDescription(obj.description);
    } else {
      console.log("obj not found");
    }
  }, []);

  return (
    <>
      <List dense={true} sx={{ width: "60%" }}>
        {todos.map((item) => {
          return (
            <CustomListItem
              key={item._id}
              item={item}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              updateTodo={updateTodo}
              edswitch={edswitch}
            />
          );
        })}
      </List>
    </>
  );
};

export default CreateList;
