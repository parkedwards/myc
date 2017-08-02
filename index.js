const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config();
const RtmClient = require('@slack/client').RtmClient;

const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const { RTM: { AUTHENTICATED, RTM_CONNECTION_OPENED } } = CLIENT_EVENTS;
const { MESSAGE, REACTION_ADDED } = RTM_EVENTS;

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }), bodyParser.json());
app.use('*', cors()); // enable pre-flight CORS

const bot_token = process.env.SLACK_BOT_TOKEN || '';

const rtm = new RtmClient(bot_token);

let channel;

rtm.on(AUTHENTICATED, rtmStartData => {
  rtmStartData.channels.forEach(chan => {
    if (chan.is_member && chan.name === 'general') {
      channel = chan.id;
    }
  });
  console.log(
    `Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`,
  );
});

// rtm.on(RTM_CONNECTION_OPENED, () => {
//   console.log('========================');
//   console.log(channel);
//   rtm.sendMessage('whats prroppppppppppin!', channel);
// });

rtm.on(MESSAGE, message => {
  console.log(message);
});

rtm.on(REACTION_ADDED, reaction => {
  console.log(reaction);
});

rtm.start();

app.post('/test', (req, res, next) => {
  console.log('ayyyyyyyy');
  return res.status(200).json('heyo!');
})

app.all('*', (req, res) => res.status(404).end('Page Not Found'));

app.listen(PORT, () => {
  console.log(`MYC-bot is up and running on port ${PORT}`);
});
