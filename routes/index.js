const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const util = require("util");
const { spawn, spawnSync, exec, execSync } = require("child_process");
const config_dir = path.join(__dirname, "../configs");

let confs = [];

fs.readdir(config_dir, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  confs = files;
  console.log("loaded: Configs");
});

router.get("/", (req, res) => {
  res.render("visualiser", { configs: confs });
});

router.get("/comparison", (req, res) => {
  res.render("compare", { configs: confs });
});

router.post("/config", (req, res) => {
  console.log(req.body);
  let config = "./configs/" + req.body.conf;
  let algo = req.body.algo;
  const python_proc = spawn("python3", ["parser.py", config]);

  let buf = Buffer.from([0x36, 0x36, 0x20, 0x36, 0x36, 0x0a]);

  python_proc.stdout.on("data", (data) => {
    console.log(data.toString());
    if (Buffer.compare(buf, data) == 0) {
      let child = spawn("./ds-client", ["-a", algo]);

      child.on("close", () => {
        console.log("done");
        res.end(JSON.stringify({ loading: false }));
      });

      child.stdout.on("data", (data) => {
        console.log(data.toString());
      });
      child.stderr.on("data", (data) => {
        console.log(data.toString());
      });
    }
  });

  python_proc.stderr.on("data", (data) => {
    console.log(data.toString());
  });
});

module.exports = router;
