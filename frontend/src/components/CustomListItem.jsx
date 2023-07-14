import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import SaveIcon from "@mui/icons-material/Save";

const CustomListItem = ({
  item,
  deleteTodo,
  editTodo,
  updateTodo,
  edswitch,
}) => {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);

  return (
    <>
      <ListItem
        secondaryAction={
          edswitch ? (
            <>
              <IconButton
                onClick={() => {
                  {
                    item.isEditable
                      ? updateTodo(item._id, {
                          title: title,
                          description: description,
                        })
                      : editTodo(item._id);
                  }
                }}
                edge="end"
                aria-label="edit"
                sx={{ mr: "8px" }}
              >
                {item.isEditable ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              <IconButton
                onClick={() => {
                  deleteTodo(item._id);
                }}
                edge="end"
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </>
          ) : (
            <div></div>
          )
        }
      >
        {item.isEditable ? (
          <Box
            sx={{
              mt: "18px",
              mb: "18px",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Edit Title"
              size="small"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              sx={{
                mb: "18px",
                width: "100px",
                minWidth: "200px",
                mr: "8px",
              }}
            />

            <TextField
              label="Edit Description"
              size="small"
              multiline
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              sx={{ mb: "14px", width: "50%", minWidth: "200px" }}
            />
          </Box>
        ) : (
          <ListItemText primary={item.title} secondary={item.description} />
        )}
      </ListItem>
      <Divider />
    </>
  );
};

export default CustomListItem;
