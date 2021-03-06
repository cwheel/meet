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
const SummaryTool = require('node-summary');
const btoa = require('btoa');

const key = fs.readFileSync('keys/cert.key', 'utf8');
const cert = fs.readFileSync('keys/cert.pem', 'utf8');

let app = new express();
let pmClient = new postmark.Client(process.env.POSTMARK_KEY);

let server = https.createServer({key, cert}, app);

let io = require('socket.io')(server);

let transcripts = {};
let knowledge = {};

function upper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

io.on('connection', (socket) => {
    console.log(`[${moment().format('hh:mm:ss')}] Meta channnel client joined ${socket.conn.remoteAddress}`);

    socket.on('room', (room) => {
        socket.join(room);
    });

    socket.on('speechEvent', (event) => {
        io.sockets.in(event.room).emit('speakerChanged', event);
    });

    socket.on('transcribeEvent', (event) => {
    	if (event.text != '') {
    		if (!(event.room in transcripts)) {
    			transcripts[event.room] = [];
    		}


            addToKnowledge(event.text, event.room)
            transcripts[event.room].push(event);
            io.sockets.in(event.room).emit('speakerChanged', event);
    	}
    });

    socket.on('leaveConference', (person) => {
        let events = transcripts[person.room];

        let results = '';
        for (let i = 0; i < events.length; i++) {
            results += `<b>${upper(events[i].nick)}</b>: ${upper(events[i].text)}<br>`;
        }

        let para = '';
        for (let i = 0; i < events.length; i++) {
            para += `${upper(events[i].text)}.`;
        }

        SummaryTool.summarize('Meeting Minutes', para, (err, summary) => {
            let templ = fs.readFileSync('emails/report.html', 'utf8');
            let email = mustache.render(templ, {name: person.nick, results, summary});

            pmClient.sendEmail({
                From: 'meet@scelos.com',
                To: person.email,
                Subject: `Your meeting results`,
                HtmlBody: email
            });
        });
    });

    socket.on('invite', (invite) => {
        let templ = fs.readFileSync('emails/invite.html', 'utf8');
        let link = `${process.env.APPLICATION_URL}/r/${invite.room}/${encodeURIComponent(invite.name)}/${btoa(invite.email)}`;

        let email = mustache.render(templ, {invitee: invite.name, inviter: invite.inviter, link: link});

        pmClient.sendEmail({
            From: 'meet@scelos.com',
            To: invite.email,
            Subject: `${invite.inviter} has invited you to a meeting`,
            HtmlBody: email
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
		knowledgeData(currentStr);
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
	console.log("Hello")
	let JSONbody = {
			  "document":{
			    "type":"PLAIN_TEXT",
			    "content":"oh there we go.  okay so where is the make sure the other one goes through when it works properly.  SKC was very thorough and make sure that the Prairie whatever reason it never said that but you can think so Google."
			  },
			  "encodingType":"UTF8"
			};
	request({
		url : "https://language.googleapis.com/v1beta1/documents:analyzeEntities",
		method: 'POST',
	    json: true,   // <--Very important!!!
    	body: JSONbody,
		headers : {
			'Authorization' : 'Bearer ' + process.env.NLP_API_KEY,
			'Content-Type' : 'application/json',
		}
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body) // Show the HTML for the Google homepage.
		}
	});
}

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
