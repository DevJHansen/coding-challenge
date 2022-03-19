import React, { useState } from "react";
import { Typography, Button, CircularProgress } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import data from "../../data/data.json";
import geo from "../../data/geo.json";
import axios from "axios";
import { calculateDistance } from "../../utils/helpers";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: "100vh",
      backgroundColor: "#262626",
      color: "white",
      padding: 100,
    },
    button: {
      color: "white",
      backgroundColor: "#ff5757",
    },
    text: {
      color: "white",
    },
    spinner: {
      color: "#ff5757",
    },
  })
);

const Validate: React.FC = () => {
  const classes = useStyles();
  const [validData, setValidData] = useState<number>(0);
  const [validGeo, setValidGeo] = useState<number>(0);
  const [unconfirmedGeo, setUnconfirmedGeo] = useState<number>(0);
  const [unconfirmedData, setUnconfirmedData] = useState<number>(0);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  const validateGeo = async () => {
    setValidGeo(0);
    setUnconfirmedGeo(0);
    setGeoLoading(true);

    let countValid: number = 0;
    let countUnconfirmed: number = 0;
    let countTotalChecked: number = 0;

    for (const element of geo) {
      // Look up actual coordinates of each IP
      const url: string = `http://ipwhois.app/json/${element.ipv4}`;

      try {
        const getIpCoordinated = await axios({
          method: "get",
          url,
        });

        const latlng = element.geo.split(",");
        const checkDistance: number = calculateDistance(
          Number(latlng[0]),
          Number(latlng[1]),
          getIpCoordinated.data.latitude,
          getIpCoordinated.data.longitude
        );

        // If distance between origional coordinates and look up coordinates is greater than 50km we deem it invalid.
        if (checkDistance < 50) {
          countValid++;
        }
      } catch (error) {
        console.log(error);
        countUnconfirmed++;
      }

      countTotalChecked++;

      if (countTotalChecked === geo.length) {
        setValidGeo(countValid);
        setUnconfirmedGeo(countUnconfirmed);
        setGeoLoading(false);
      }
    }
  };

  const validateData = async () => {
    setDataLoading(true);
    setValidData(0);
    setUnconfirmedData(0);

    // Use proxy to prevent cors errors
    const url: string = `http://localhost:5000`;

    try {
      const getNodes = await axios({
        method: "post",
        url,
        data,
      });
      setValidData(getNodes.data.data.valid);
      setUnconfirmedData(getNodes.data.data.unconfirmed);
      setDataLoading(false);
    } catch (error) {
      console.log(error);
      setDataLoading(false);
    }
  };

  const handleValidate = () => {
    validateData();
    validateGeo();
  };

  return (
    <>
      <div className={classes.root}>
        <Typography variant="h4" component="div" className={classes.text}>
          Challenge 1
        </Typography>
        <Typography
          variant="subtitle1"
          component="div"
          className={classes.text}
        >
          Find and display the amount of valid objects in data.json and geo.json
        </Typography>
        {geoLoading || dataLoading ? (
          <CircularProgress className={classes.spinner} />
        ) : (
          <Button
            variant="contained"
            className={classes.button}
            onClick={handleValidate}
          >
            Validate Data
          </Button>
        )}
        <Typography
          variant="subtitle1"
          component="div"
          className={classes.text}
        >
          Number of valid objects in geo.json = {validGeo} / {geo.length}.
          Unconfirmed = {unconfirmedGeo}
        </Typography>
        <Typography
          variant="subtitle1"
          component="div"
          className={classes.text}
        >
          Number of valid objects in data.json = {validData} / {data.length}.
          Unconfirmed = {unconfirmedData}
        </Typography>
      </div>
    </>
  );
};

export default Validate;
