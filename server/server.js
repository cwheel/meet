'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const fs = require('fs');
const https = require('https');
const moment = require('moment');

const key = fs.readFileSync('keys/cert.key', 'utf8');
const cert = fs.readFileSync('keys/cert.pem', 'utf8');

let app = new express();

let server = https.createServer({key, cert}, app);

let io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(`[${moment().format('hh:mm:ss')}] Meta channnel client joined ${socket.conn.remoteAddress}`);

    socket.on('room', (room) => {
        socket.join(room);
    });

    socket.on('speechEvent', (event) => {
        io.sockets.in(event.room).emit('speakerChanged', event);
    });

    socket.on('invite', (invite) => {
        console.log(invite);
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(compression());

app.use('/', express.static(path.resolve(__dirname, '../dist')));

app.get('*', (req, res) => {
    res.redirect(`/#${req.path}`);
});

server.listen(3000);
