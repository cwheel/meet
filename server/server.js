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
const SummaryTool = require('node-summary');
const btoa = require('btoa');

const key = fs.readFileSync('keys/cert.key', 'utf8');
const cert = fs.readFileSync('keys/cert.pem', 'utf8');

let app = new express();
let pmClient = new postmark.Client(process.env.POSTMARK_KEY);

let server = https.createServer({key, cert}, app);

let io = require('socket.io')(server);

let transcripts = {};

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

    		transcripts[event.room].push(event);
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
