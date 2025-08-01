import React from "react";
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemButton, IconButton
} from "@mui/material";
import {
  Home, Book, Checklist, Person, EmojiEvents
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 210;

export default function Sidebar({ open, onClose }) {
  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#fff',
        },
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={onClose}>
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/journal" onClick={onClose}>
            <ListItemIcon><Book /></ListItemIcon>
            <ListItemText primary="Journal" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/checklist" onClick={onClose}>
            <ListItemIcon><Checklist /></ListItemIcon>
            <ListItemText primary="Checklist" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/milestones" onClick={onClose}>
            <ListItemIcon><EmojiEvents /></ListItemIcon>
            <ListItemText primary="Milestones" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/user-info" onClick={onClose}>
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="User Info" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
