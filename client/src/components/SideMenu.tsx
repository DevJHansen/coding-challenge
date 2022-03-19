import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  list: {
    backgroundColor: "#262626",
    height: "100vh",
    minWidth: 150,
  },
  link: {
    textDecoration: "none",
    fontSize: "20px",
    color: "white",
  },
  icon: {
    color: "white",
  },
}));

const SideMenu: React.FC = () => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  return (
    <>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List className={classes.list}>
          <ListItem
            onClick={() => setOpenDrawer(false)}
            className={classes.link}
          >
            <ListItemText>
              <Link to="/" className={classes.link}>
                Validate
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/sort" className={classes.link}>
                Sort
              </Link>
            </ListItemText>
          </ListItem>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/merge" className={classes.link}>
                Merge
              </Link>
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon className={classes.icon} />
      </IconButton>
    </>
  );
};
export default SideMenu;
