const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const data = require("./data.json");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const checkValid = async (dataSet) => {
  let countValid = 0;
  let countTotal = 0;
  let countUnconfirmed = 0;
  let validData = [];

  for (const element of dataSet) {
    // Look up actual coordinates of each IP
    const url = `https://api.ring.nlnog.net/1.0/nodes/${element.id}`;

    try {
      const getNode = await axios({
        method: "get",
        url,
      });
      const checkLength = getNode.data.results.nodes.length ? true : false;

      if (checkLength) {
        const asnCheck =
          getNode.data.results.nodes[0].asn === element.asn ? true : false;
        const activeCheck =
          getNode.data.results.nodes[0].active === element.active
            ? true
            : false;
        const countrycodeCheck =
          getNode.data.results.nodes[0].countrycode === element.countrycode
            ? true
            : false;
        if (asnCheck && activeCheck && countrycodeCheck) {
          validData.push(getNode.data.results.nodes[0]);
          countValid++;
        }
      }
    } catch (error) {
      console.log(error);
      countUnconfirmed++;
    }

    countTotal++;
    console.log(countTotal);
  }
  if (countTotal === dataSet.length) {
    return { valid: countValid, unconfirmed: countUnconfirmed, validData };
  }
};

app.post("/", (req, res) => {
  console.log("request recieved");

  checkValid(req.body)
    .then((result) => {
      res.status(200).send({ data: result });
    })
    .catch((err) => {
      res.status(500).send({ data: err });
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//Handle unhandled promise rejections
process.on("unhandledRejection", async (err, promise) => {
  server.close(() => process.exit(1));
});
