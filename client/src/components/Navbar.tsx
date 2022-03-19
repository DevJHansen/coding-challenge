import React from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  makeStyles,
  Theme,
  createStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: "black",
    },
    link: {
      textDecoration: "none",
      color: "white",
      fontSize: "20px",
      marginLeft: theme.spacing(5),
      "&:hover": {
        borderBottom: "1px solid white",
      },
    },
  })
);

const Navbar: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <CssBaseline />
      <Toolbar>
        {isMobile ? (
          <SideMenu />
        ) : (
          <div>
            <Link to="/" className={classes.link}>
              Validate
            </Link>
            <Link to="/sort" className={classes.link}>
              Sort
            </Link>
            <Link to="/merge" className={classes.link}>
              Merge
            </Link>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
