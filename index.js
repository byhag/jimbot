require('dotenv').config();
var request = require('request');
var cool = require('cool-ascii-faces');
var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var S = require('string');
var url = require('url');

var app = express();

var botID = process.env.BOT_ID;

var wolframID = process.env.WOLFRAM_ID;

app.get('/', function(req, res) {
  console.log('serving index');
  res.sendFile('index.html',{root: __dirname});
});

app.post('/', function(req, res) {
  req.chunks = [];
  req.on('data', function(chunk) {
    console.log(chunk.toString());
    req.chunks.push(chunk.toString());
    respond(chunk.toString(), res);
  });
});

app.get('/quote', function(req, res) {
  quoteResponse(req, res);
});

// server = http.createServer(function (req, res) {
//   req.chunks = [];
//   req.on('data', function(chunk) {
//     console.log(chunk.toString());
//     req.chunks.push(chunk.toString());
//   });
// });

port = Number(process.env.PORT || 5000);
app.listen(port);

// router = new director.http.Router({
//   '/groupme': {
//     post: respond,
//     get: ping 
//   },
//   '/facebook': {
//     post: handleUser,
//     get: challenge
//   },
//   '/quote': {
//     get: quoteResponse
//   }
// });

function handleUser() {
  console.log(this.req.chunks);
  this.res.writeHead(200);
  this.res.end('success');
}

function challenge() {
  var q = url.parse(this.req.url,false).query;
  this.res.writeHead(200);
  var params = q.split('&');
  var challenge = params[1].split('=')[1];
  console.log(params);
  this.res.end(challenge);
}


var galileoCount = 0;

// var rhapsody = "Is this the real life?\n" + 
// "Is this just fantasy?\n" + 
// "Caught in a landslide\n" +
// "No escape from reality\n" + 
// "Open your eyes\n" + 
// "Look up to the skies and see\n" + 
// "I'm just a poor boy\n" + 
// "I need no sympathy\n" +
// "Because I'm easy come, easy go\n" + 
// "Little high, little low\n" +
// "Any way the wind blows doesn't really matter to me\n" + 
// "ToOO meeee\n" +
// "Mama, just killed a man\n" + 
// "Put a gun against his head\n" +
// "Pulled my trigger, now he's dead\n" +
// "Mama, life had just begun\n" +
// "But now I've gone and thrown it all away\n" +
// "Mama, ooh, didn't mean to make you cry\n" +
// "If I'm not back again this time tomorrow\n" +
// "Carry on, carry on\n" + 
// "As if nothing really matters\n" +
// "Too late, my time has come\n" +
// "Sends shivers down my spine\n" +
// "Body's aching all the time\n" +
// "Goodbye, everybody, I've got to go\n" +
// "Gotta leave you all behind and face the truth\n" +
// "Mama, ooh, I don't want to die\n" +
// I sometimes wish I'd never been born at all
// var bridge = [];
// bridge[0] = "I see a little silhouetto of a man";
// Scaramouche, Scaramouche, will you do the Fandango
// Thunderbolt and lightning, very, very fright'ning me
// (Galileo) Galileo, (Galileo) Galileo, Galileo figaro magnifico
// (I'm just a poor boy, nobody loves me)
// He's just a poor boy from a poor family
// Spare him his life from this monstrosity
// Easy come, easy go, will you let me go?
// Bismillah! No, we will not let you go
// (Let him go) Bismillah! We will not let you go
// (Let him go) Bismillah! We will not let you go
// (Let me go) Will not let you go
// (Let me go) Will not let you go
// (Let me go) Ah, no, no, no, no, no, no, no
// (Oh mamma mia, mamma mia) Mama mia, let me go
// Beelzebub has a devil put aside for me, for me, for me
// So you think you can stone me and spit in my eye?
// So you think you can love me and leave me to die?
// Oh, baby, can't do this to me, baby!
// Just gotta get out, just gotta get right outta here!
// Nothing really matters, anyone can see
// Nothing really matters
// Nothing really matters to me
// Any way the wind blows"



function quoteResponse(req, res) {
  res.writeHead(200);
  quote();
  res.end();
}

function respond(req, res) {
  var request = JSON.parse(req);
  var jimbotRegex = /j(imbo(t|)|immy|im)/i;
  var jokeRegex = /(|tell me a )joke/i,
      hiRegex = /(h(ey|i|ello)|yo)/i,
      faceRegex = /(|make a )face/i,
      quoteRegex = /(what's the quote of the day(\?|)|(|give me a |gimme a )quote)/i,
      thanksRegex = /thank(s| you)/i,
      tellMeAboutRegex = /tell me about /i,
      song1Regex = /is this the real life(|\?)/i,
      song2Regex = /caught in a landslide/i,
      song3Regex = /open your eyes/i,
      song4Regex = /i'm just a poor boy/i,
      song5Regex = /because i'm easy come(,|) easy go/i,
      song6Regex = /anyway the wind blows(,|) doesn't really matter to me/i;

  var name = request.name.split(' ');

  // so he doesn't respond to himself
  if (name[0] === 'Jimbot') {
    console.log('Ignoring myself');
    res.writeHead(200);
    res.end(); 
    return;
  }
  console.log("botID: " + botID);
  console.log("wolframID: " + wolframID);
  console.log(request);
  if (request.text && jimbotRegex.test(request.text)) {
    if(jokeRegex.test(request.text)) {
      res.writeHead(200);
      joke();
      res.end();
    } else if (tellMeAboutRegex.test(request.text)) {
      res.writeHead(200);
      var person = S(request.text).strip('Tell me about ','tell me about ',', ',
      'Jimbot ','jimbot ','Jimbo ','jimbo ','Jimmy ','jimmy ','Jim ','jim ',
      ' Jimbot',' jimbot',' Jimbo',' jimbo',' Jimmy',' jimmy',' Jim',' jim').split(' ');
      console.log(person);  
      tellMeAbout(person);
      res.end();
    } else if (hiRegex.test(request.text)) {
      res.writeHead(200);
      hello();
      res.end();
    } else if (thanksRegex.test(request.text)) {
      res.writeHead(200);
      postMessage('No problemo, ' + name[0]);
      res.end();
    } else if (faceRegex.test(request.text)) {
      res.writeHead(200);
      postMessage(cool());
      res.end();
    } else if (quoteRegex.test(request.text)) {
      res.writeHead(200);
      quote();
      res.end();
    // } else if (defaultRegex.test(request.text)) {
    //   res.writeHead(200);
    //   postMessage('I am Jimbot');
    //   res.end();
    } else {
      res.writeHead(200);
      postMessage('I am Jimbot');
      res.end();
    }
  } else if (song1Regex.test(request.text)) {
    res.writeHead(200);
    setTimeout(function() {
      postMessage('Is this just fantasy?');
    }, 3000);
    res.end();
  } else if (song2Regex.test(request.text)) {
    res.writeHead(200);
    setTimeout(function() {
      postMessage('No escape from reality');
    }, 3000);
    res.end();
  } else if (song3Regex.test(request.text)) {
    res.writeHead(200);
    setTimeout(function() {
      postMessage('Look up to the skies and see');
    }, 3000);
    res.end();
  } else if (song4Regex.test(request.text)) {
    res.writeHead(200);
    setTimeout(function() {
      postMessage('I need no sympathy');
    }, 3000);
    res.end();
  } else if (song5Regex.test(request.text)) {
    res.writeHead(200);
    setTimeout(function() {
      postMessage('Little high, little low');
    }, 3000);
    res.end();
  } else if (song6Regex.test(request.text)) {
    res.writeHead(200);
    setTimeout(function() {
      postMessage('Tooo meee');
    }, 3000);
    res.end();
  } else {
    console.log("don't care");
    res.writeHead(200);
    res.end();
  }

}

function joke() {
  var options = {
    hostname: 'api.icndb.com',
    path: '/jokes/random?firstName=' + name[0] + '&lastName=' + name[1] + '&exclude=[explicit]',
    method: 'GET'
  }


  var jokeReq = http.request(options, function(res) {
    if(res.statusCode == 200) {
      //good
    } else {
      console.log('bad status code ' + res.statusCode);
    }
    var str = '';
    res.on('data', function(d) {
      str += d;
    });

    res.on('end', function() {
      var obj = JSON.parse(str);
      postMessage(obj.value.joke);
    });
  });

  jokeReq.on('error', function(err) {
    console.log('error getting joke ' + JSON.stringify(err));
  });
  jokeReq.on('timeout', function(err) {
    console.log('timeout getting joke ' + JSON.stringify(err));
  });
  jokeReq.end();
}

function hello() {
  var choice = Math.floor(Math.random() * 4);
  var response;
  switch (choice) {
    case 0:
      response = 'Hi there';
      break;
    case 1:
      response = 'Hi';
      break;
    case 2:
      response = 'Hello';
      break;
    case 3:
      response = 'Hey';
      break;
  }
  postMessage(response);
}

function tellMeAbout(name) {
  var options = {
    hostname: 'api.icndb.com',
    path: '/jokes/random?firstName=' + name[0] + '&lastName=' + name[1] + '&exclude=[explicit]',
    method: 'GET'
  }


  var tellMeAboutReq = http.request(options, function(res) {
    if(res.statusCode == 200) {
      //good
    } else {
      console.log('bad status code ' + res.statusCode);
    }
    var str = '';
    res.on('data', function(d) {
      str += d;
    });

    res.on('end', function() {
      var obj = JSON.parse(str);
      postMessage(obj.value.joke);
    });
  });

  tellMeAboutReq.on('error', function(err) {
    console.log('error getting joke ' + JSON.stringify(err));
  });
  tellMeAboutReq.on('timeout', function(err) {
    console.log('timeout getting joke ' + JSON.stringify(err));
  });
  tellMeAboutReq.end();
}

function quote() {
  var options = {
    hostname: 'www.brainyquote.com',
    path: '/link/quotebr.js',
    method: 'GET'
  }
  
  console.log('making quote request');

  var quoteReq = https.request(options, function(res) {
    if(res.statusCode == 200) {
      //good
    } else {
      console.log('bad status code ' + res.statusCode);
    }
    var str = '';
    res.on('data', function(d) {
      str += d;
    });

    res.on('end', function() {
      var arr = str.split("\n");
      var quote = S(arr[2]).between('br.writeln("','<br>");').s;
      var author = S(arr[3]).between('">','</a>').s;
      postMessage(quote + '\n - ' + author);
    });
  });

  quoteReq.on('error', function(err) {
    console.log('error getting joke ' + JSON.stringify(err));
  });
  quoteReq.on('timeout', function(err) {
    console.log('timeout getting joke ' + JSON.stringify(err));
  });
  quoteReq.end();
}

function postMessage(botResponse) {
  console.log('Response is ' + botResponse);
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
  this.res.end('I am Jimbot');
}

