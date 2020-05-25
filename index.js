const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

const port = 3000;

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/visualiser.html"));
});

app.use("/", router);
app.use(express.static(__dirname + "/scripts"));
app.listen(process.env.port || port);

console.log(`Started server on port: ${port}`);
