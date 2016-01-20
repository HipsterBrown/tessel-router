// Import the interface to Tessel hardware
var tessel = require('tessel');
var pin = tessel.port.A.pin[2];
var value = 1;
var http = require('http');
var fs = require('fs');
var url = require('url');
var blinkLoop;

var server = http.createServer(function (request, response) {
  var urlParts = url.parse(request.url, true);
  var onRegex = /on/;
  var offRegex = /off/;
  var blinkRegex = /blink/;
  var dlRegex = /download/;

  console.log(urlParts.pathname);

  if (urlParts.pathname.match(onRegex)) {
    toggleGemma(urlParts.pathname, request, response, false);
  } else if (urlParts.pathname.match(offRegex)) {
    toggleGemma(urlParts.pathname, request, response, true);
  } else if (urlParts.pathname.match(blinkRegex)) {
    blinkGemma(urlParts.pathname, request, response);
  } else if (urlParts.pathname.match(dlRegex)) {
    servePBW(urlParts.pathname, request, response);
  } else {
    showIndex(urlParts.pathname, request, response);
  }
});

server.listen(8080);

console.log('Server running at http://192.168.1.101:8080/');
tessel.led[2].toggle();

function showIndex (url, request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  fs.readFile(__dirname + '/index.html', function (err, content) {
    if (err) {
      throw err;
    }

    response.end(content);
  });
}

function toggleGemma (url, request, response, toggleOn) {
  // clear blink loop if blinking
  clearBlink();

  value = toggleOn ? 1 : 0;
  pin.output(value);
  console.log(value ? 'On' : 'Off');

  response.writeHead(200, {"Content-Type": "application/json"});
  response.end(JSON.stringify({isOn: !!value}));
}

function blinkGemma (url, request, response) {
  clearBlink();

  blinkLoop = setInterval(function () {
    value = value ? 0 : 1;
    pin.output(value);
    console.log(value ? 'On' : 'Off');
  }, 1000);

  response.writeHead(200, {"Content-Type": "application/json"});
  response.end(JSON.stringify({isOn: !!value}));
}

function servePBW (url, request, response) {
  fs.readFile(__dirname + '/Heart-Ware_Control.pbw', function (err, content) {
    if (err) {
      throw err;
    }

    response.setHeader('Content-disposition', 'attachment; filename=heart-ware-controller.pbw');
    response.end(content);
  });
}

function clearBlink () {
  if (blinkLoop) {
    clearInterval(blinkLoop);
    console.log('Blink cleared');
  }
}
