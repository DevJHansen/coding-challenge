import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#262626",
    },
    heading: {
      color: "#ff5757",
    },
    text: {
      color: "white",
    },
  })
);

const NotFound: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography
        variant="h1"
        component="div"
        gutterBottom
        className={classes.heading}
      >
        404
      </Typography>
      <Typography variant="subtitle1" component="div" className={classes.text}>
        Oops, we can't seem to find the page you're looking for.
      </Typography>
    </div>
  );
};

export default NotFound;
