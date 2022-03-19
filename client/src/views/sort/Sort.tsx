import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import axios from "axios";
import {
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@material-ui/core";
import data from "../../data/data.json";
import { calculateDistance } from "../../utils/helpers";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minHeight: "100vh",
      backgroundColor: "#262626",
      color: "white",
      padding: 100,
    },
    input: {
      borderColor: "#ff5757",
      color: "red",
    },
    input2: {
      borderColor: "#ff5757",
      color: "red",
      marginLeft: 10,
    },
    button: {
      marginBottom: 20,
      color: "white",
      backgroundColor: "#ff5757",
    },
    text: {
      color: "white",
      marginBottom: 10,
    },
    textWarning: {
      color: "#ff5757",
      marginBottom: 10,
    },
    spinner: {
      color: "#ff5757",
    },
    table: {
      marginTop: 20,
    },
  })
);

interface SortedListObject {
  geo: string;
  active: number;
  asn: number;
  city: string;
  countrycode: string;
  datacenter: string;
  id: number;
  hostname: string;
  distanceFromCoords: number;
}

const Sort: React.FC = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [lat, setLat] = useState<string>("");
  const [long, setLong] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>(" ");
  const [list, setList] = useState<SortedListObject[]>([]);

  const handleSort = async () => {
    setErrMsg(" ");
    setLoading(true);
    if (
      !Number(lat) ||
      !Number(long) ||
      Number(long) < -180 ||
      Number(long) > 180 ||
      Number(lat) < -90 ||
      Number(lat) > 90
    ) {
      setErrMsg("Please enter valid coordinates");
      setLoading(false);
      return;
    }

    // Use proxy to prevent cors errors
    const url: string = `http://localhost:5000`;

    try {
      let elementsWithDistance: SortedListObject[] = [];
      let nearest10: SortedListObject[] = [];
      const getNodes = await axios({
        method: "post",
        url,
        data,
      });
      getNodes.data.data.validData.forEach(
        (element: {
          geo: string;
          active: number;
          asn: number;
          city: string;
          countrycode: string;
          datacenter: string;
          id: number;
          hostname: string;
        }) => {
          const latlng = element.geo.split(",");
          const checkDistance: number = calculateDistance(
            Number(latlng[0]),
            Number(latlng[1]),
            Number(lat),
            Number(long)
          );
          elementsWithDistance.push({
            distanceFromCoords: checkDistance,
            active: element.active,
            asn: element.asn,
            city: element.city,
            countrycode: element.countrycode,
            geo: element.geo,
            datacenter: element.datacenter,
            id: element.id,
            hostname: element.hostname,
          });
        }
      );
      if (elementsWithDistance.length === getNodes.data.data.validData.length) {
        const sorted = elementsWithDistance.sort((a, b) => {
          return a.distanceFromCoords - b.distanceFromCoords;
        });
        for (let i = 0; i < 10; i++) {
          nearest10.push(sorted[i]);
          if (i === 9) {
            setList(nearest10);
          }
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setErrMsg(
        "Error fetching data. Please ensure proxy server is running and try again. If you need additional help, please read the README.md"
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div className={classes.root}>
        <Typography variant="h4" component="div" className={classes.text}>
          Challenge 2
        </Typography>
        <Typography
          variant="subtitle1"
          component="div"
          className={classes.text}
        >
          Get 10 closest locations from data.json
        </Typography>
        <div>
          <TextField
            id="outlined-basic"
            label="Latitude"
            variant="outlined"
            className={classes.input}
            color="secondary"
            focused
            onChange={(e) => setLat(e.target.value)}
            value={lat}
          />
          <TextField
            id="outlined-basic"
            label="Longitude"
            variant="outlined"
            className={classes.input2}
            color="secondary"
            focused
            onChange={(e) => setLong(e.target.value)}
            value={long}
          />
        </div>
        <Typography
          variant="subtitle1"
          component="div"
          className={classes.textWarning}
        >
          {errMsg}
        </Typography>
        {loading ? (
          <CircularProgress className={classes.spinner} />
        ) : (
          <Button
            variant="contained"
            className={classes.button}
            onClick={handleSort}
          >
            Sort
          </Button>
        )}
        <TableContainer component={Paper} className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Active</TableCell>
                <TableCell>ASN</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Country Code</TableCell>
                <TableCell>Geo</TableCell>
                <TableCell>Datacenter</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Host Name</TableCell>
                <TableCell align="right">Distance from Coords</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.length
                ? list.map((element, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{element.active}</TableCell>
                        <TableCell>{element.asn}</TableCell>
                        <TableCell>{element.city}</TableCell>
                        <TableCell>{element.countrycode}</TableCell>
                        <TableCell>{element.geo}</TableCell>
                        <TableCell>{element.datacenter}</TableCell>
                        <TableCell>{element.id}</TableCell>
                        <TableCell>{element.hostname}</TableCell>
                        <TableCell align="right">
                          {element.distanceFromCoords}
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default Sort;
