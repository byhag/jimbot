var FeedParser = require('feedparser');
var request = require('request');
var cool = require('cool-ascii-faces');
var director = require('director');
var http = require('http');
var https = require('https');

router = new director.http.Router({
  '/': {
    post: respond,
    get: ping
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function(chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

var botID = "bb9f5f058f16d79509891cf2b1";

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      jokeRegex = /[jJ]imothy[,| ]+tell me a joke/,
      hiRegex = /[hH](ey|i) [jJ]imothy$/;

  if(request.text && jokeRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage('I would if I knew any');
    this.res.end();
  } else if (request.text && hiRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage('Hi there');
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(botResponse) {
  var botResponse, options, body, botReq;


  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = https.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


function ping() {
  this.res.writeHead(200);
  this.res.end("Hi there");
}

