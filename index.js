const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

const { spawn } = require("child_process");

const port = 3000;

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/visualiser.html"));
});

app.post("/config/:config", (req, res) => {
  const python_proc = spawn("python3", [
    "parser.py",
    "./configs/config_simple1.xml",
  ]);
  console.log(req.params);
  res.send(req.params);
  python_proc.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  python_proc.stderr.on("data", (data) => {
    console.log(data.toString());
  });
});
app.use("/", router);
app.use(express.static(__dirname + "/scripts"));
app.use(express.static(__dirname + "/data"));
app.listen(process.env.port || port);

console.log(`Started server on port: ${port}`);
