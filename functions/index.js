const express = require("express");
let cors = require("cors");
let fs = require("fs");
let bodyParser = require("body-parser");
let docker = require('dockerode');

const app = express();
app.use(cors({origin: true}));
app.use(bodyParser.json({limit: '100mb', extended: true}));

//TODO: Fix docker config;
let pyDocker = new docker({
   host: 'http://192.168.1.10', port: 3000
});

//TODO: Container id
let container = pyDocker.getContainer("");

app.listen(8080);
app.post("/pycode", (req, res) => {
   // pyDocker.
    console.log("Action-man with a plan")
});
