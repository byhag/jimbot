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
    console.log(chunk.toString());
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
  var request = JSON.parse(this.req.chunks[0]);
  var jokeRegex = /[jJ](imbo(t|)|immy|im)(,| )+tell me a joke/,
      hiRegex = /[hH](ey|i) [jJ](imbo(t|)|immy|im)(| )$/,
      faceRegex = /[jJ](imbo(t|)|immy|im)(,| )+make a face/;

  console.log(request);
  if(request.text && jokeRegex.test(request.text)) {
    this.res.writeHead(200);
    joke();
    this.res.end();
  } else if (request.text && hiRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage('Hi there');
    this.res.end();
  } else if (request.text && faceRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(cool());
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function joke() {
  var options = {
    hostname: 'tambal.azurewebsites.net',
    path: '/joke/random',
    method: 'GET'
  }

  var jokeReq = https.request(options, function(res) {
    if(res.statusCode == 200) {
      //good
    } else {
      console.log('bad status code ' + res.statusCode);
    }
    var str;
    res.on('data', function(d) {
      console.log(typeof(d));
      
      str += d;
    });

    res.on('end', function() {
      // var obj = JSON.parse(str);
      postMessage(str);
    })
  });

  jokeReq.on('error', function(err) {
    console.log('error getting joke ' + JSON.stringify(err));
  });
  jokeReq.on('timeout', function(err) {
    console.log('timeout getting joke ' + JSON.stringify(err));
  });
  jokeReq.end();
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

