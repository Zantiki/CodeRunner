const express = require("express");
let cors = require("cors");
let fs = require("fs");
let bodyParser = require("body-parser");
let docker = require('dockerode');
let readable = require('stream').Readable;
var newStream = require('stream');

const app = express();
app.use(cors({origin: true}));
app.use(bodyParser.json());


let pyDocker = new docker({
   host: '127.0. 0.1', port: 2375
});

app.listen(8080);


async function execute(command, container) {
    console.log("Setting EXEC");
    const exec = await container.exec({
        Cmd: command,
        //Cmd: command,
        AttachStdout: true,
        AttachStderr: true
    });
    return new Promise(async (resolve, reject) => {
        console.log("Creating promise");
        await exec.start(async (err, stream) => {
            if (err) return reject();
            let message = '';
            console.log("listening for data");
            stream.on('data', chunk => {
                //message = chunk.toString();
                console.log(Object.keys(chunk));
                let buf = clean(chunk);
                message = buf.toString();
                stream.close = true;
                stream.destroy();
                resolve(message);

            });
           // stream.on('end', () => resolve(message));
        });
    });
}

function clean(buffer){
    let jBuffer = buffer.toJSON();
    let data = jBuffer.data.slice(8);
    return new Buffer(data);
}

app.post("/pycode", (req, res) => {
    // pyDocker.
    console.log(req.body.code);
    //let cmd = "import math \nprint(math.pi)";
    let cmd = req.body.code;
    pyDocker.createContainer({
        Image: 'python',
        Tty: true,
        Cmd: ['/bin/bash']
    }).then(function(container) {
        return container.start(function(err, data){
            //exec: ["python", "-c", "\"print('hello world')\""]
            return execute(["python", "-c", cmd], container)
                .then(message => {
                    console.log(message);
                    res.send({body: message})}
                );
        });
    }).then(container => {
        container.stop();
    })
        .then(container => {
            container.remove(function (err, data) {
                console.log(data);
            });
        });

});
