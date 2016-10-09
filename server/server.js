'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const fs = require('fs');
const https = require('https');
const moment = require('moment');
const postmark = require('postmark');
const mustache = require('mustache');
var request = require('request');

const key = fs.readFileSync('keys/cert.key', 'utf8');
const cert = fs.readFileSync('keys/cert.pem', 'utf8');

let app = new express();
let pmClient = new postmark.Client(process.env.POSTMARK_KEY);

let server = https.createServer({key, cert}, app);

let io = require('socket.io')(server);

let transcripts = {};
let knowledge = {};

io.on('connection', (socket) => {
    console.log(`[${moment().format('hh:mm:ss')}] Meta channnel client joined ${socket.conn.remoteAddress}`);

    socket.on('room', (room) => {
        socket.join(room);
    });

    socket.on('speechEvent', (event) => {
        io.sockets.in(event.room).emit('speakerChanged', event);
    });

    socket.on('transcribeEvent', (event) => {
    	console.log(event);
    	if (event.text != '') {
    		if (!(event.room in transcripts)) {
    			transcripts[event.room] = [];
    		}
    		addToKnowledge(event.text, event.room)
    		transcripts[event.room].push(event);
        	io.sockets.in(event.room).emit('speakerChanged', event);
    	}
    });

    socket.on('invite', (invite) => {
        let templ = fs.readFileSync('emails/invite.html', 'utf8');
        let link = `${process.env.APPLICATION_URL}/r/${invite.room}/${encodeURIComponent(invite.name)}`;

        let email = mustache.render(templ, {invitee: invite.name, inviter: invite.inviter, link: link});

        pmClient.sendEmail({
            From: 'meet@scelos.com',
            To: invite.email,
            Subject: `${invite.inviter} has invited you to a meeting`,
            HtmlBody: email
        });
    });
});

let addToKnowledge = (string, room) => {
	if (!(room in knowledge)) {
		knowledge[room] = {
			length: 0,
			currentWords: 0,
			currentStrings: [
			""
			],
			currentKnowledge: [
			]
		};
	}

	let roomKnowledge = knowledge[room];
	let wordCount = roomKnowledge.currentWords;
	let currentStr;
	if (roomKnowledge.currentWords == 0) {
		currentStr = "";
	} else {
		currentStr = roomKnowledge.currentStrings[roomKnowledge.length];
	}

	for (var val of string) {
		if (val == ' ') {
			wordCount += 1;
		}
		currentStr = currentStr + val;
	}
	currentStr = currentStr + ".  ";

	if (wordCount > 30) {
		// Send off the Data

		roomKnowledge.currentWords = 0;
		roomKnowledge.currentStrings[roomKnowledge.length] = currentStr;
		roomKnowledge.length += 1;
		roomKnowledge.currentStrings.push("");
		console.log("push to new")
		console.log(roomKnowledge.currentStrings);
	} else {
		roomKnowledge.currentWords = wordCount;
		roomKnowledge.currentStrings[roomKnowledge.length] = currentStr;
	}
}

let knowledgeData = (knowledgeString) => {
	request('http://www.google.com', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body) // Show the HTML for the Google homepage.
		}
	})
}

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
