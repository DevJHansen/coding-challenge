import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
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
} from "@material-ui/core";
import p3Data from "../../data/p3Data.json";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minHeight: "100vh",
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
    table: {
      marginTop: 20,
    },
  })
);

interface Result {
  name?: any;
  a?: any;
  b?: any;
  c?: any;
  d?: any;
  e?: any;
}

interface DropDown {
  value: string;
}

const Merge: React.FC = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Result[]>([{ name: "" }]);
  const [dropDown, setDropDown] = useState<DropDown[]>([{ value: "" }]);

  const handleChange = (index: number, value: string) => {
    let dropDownCopy: DropDown[] = [...dropDown];
    let updateDropDown: DropDown[] = [];
    dropDownCopy.forEach((element, i) => {
      if (i !== index) {
        updateDropDown.push(element);
      } else {
        updateDropDown.push({ value });
      }

      if (dropDownCopy.length === i + 1) {
        setDropDown(updateDropDown);
      }
    });
  };

  const handleMerge = () => {
    setLoading(true);

    let merge: object[] = [];
    let array1 = [...p3Data.testSet1];
    let array2 = [...p3Data.testSet2];

    // Check duplicate name values, merge or sum the second field, add to new array then remove from origional array. We now have three arrays, one that contains all the merged & summed objects and the other two containing all objects with unique name field
    for (let i: number = array1.length - 1; i >= 0; i--) {
      for (let j: number = array2.length - 1; j >= 0; j--) {
        if (
          array1[i].name === array2[j].name &&
          Object.keys(array1[i])[1] === Object.keys(array2[j])[1]
        ) {
          merge.push({
            name: array2[j].name,
            [Object.keys(array1[i])[1]]:
              Object.values(array1[i])[1] + Object.values(array2[j])[1],
          });
          array1.splice(i, 1);
          array2.splice(j, 1);
          i--;
        } else if (
          array1[i].name === array2[j].name &&
          Object.keys(array1[i])[1] !== Object.keys(array2[j])[1]
        ) {
          merge.push({
            name: array2[j].name,
            [Object.keys(array1[i])[1]]: Object.values(array1[i])[1],
            [Object.keys(array2[j])[1]]: Object.values(array2[j])[1],
          });
          array1.splice(i, 1);
          array2.splice(j, 1);
          i--;
        }
      }

      if (i <= 0) {
        // Merge the three arrays into one
        const union: Result[] = [...merge, ...array1, ...array2];
        let dropDownValues: DropDown[] = [];
        union.forEach((element, j) => {
          dropDownValues.push({
            value: `${Object.keys(element)[1]}: ${Object.values(element)[1]}`,
          });
          if (j + 1 === union.length) {
            setDropDown(dropDownValues);
          }
        });
        setResult(union);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className={classes.root}>
        <Typography variant="h4" component="div" className={classes.text}>
          Challenge 3
        </Typography>
        <Typography
          variant="subtitle1"
          component="div"
          className={classes.text}
        >
          Merge two arrays and display the result in a table
        </Typography>
        {loading ? (
          <CircularProgress className={classes.spinner} />
        ) : (
          <Button
            variant="contained"
            className={classes.button}
            onClick={handleMerge}
          >
            Merge
          </Button>
        )}
        <TableContainer component={Paper} className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Fields</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.length
                ? result.map((result, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell component="th" scope="row">
                          {result?.name}
                        </TableCell>
                        <TableCell align="right">
                          <select
                            onChange={(e) => {
                              handleChange(i, e.target.value);
                            }}
                          >
                            {Object.keys(result).map((key, j) => {
                              if (key !== "name") {
                                return (
                                  <option value={dropDown[i].value} key={j}>
                                    {key}: {result[key as keyof Result]}
                                  </option>
                                );
                              }
                            })}
                          </select>
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

export default Merge;
