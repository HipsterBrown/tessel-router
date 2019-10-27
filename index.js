// Import the interface to Tessel hardware
var tessel = require('tessel');
var http = require('http');
var path = require('path');
var os = require('os');
var dgram = require('dgram');
var exec = require('child_process').execSync;

var app = require('express')();
var server = http.Server(app);
var io = require('socket.io')(server);

var buttons = {
  red: tessel.port.A.pin[5]
};

var leds = {
  red: tessel.port.B.pin[5]
};

var indexPath = path.join(__dirname, 'index.html');

app.get('/', (request, response) => {
  response.sendFile(indexPath);
});

try {
  exec('route add -net 224.0.0.0/4 dev wlan0');
} catch (error) {
  console.error(error);
}

tessel.led[2].off();

var PORT = 33333;
var MULTICAST_ADDRESS = '239.10.10.100';

var state = {
  red: true
};

var pub = dgram.createSocket('udp4');

pub.on('message', (message, remote) => {
  console.log('Message Received!');
  console.log(`From ${remote.address}:${remote.port}`);
  // tessel.led[3].toggle();

  var data = JSON.parse(message);
  console.log(data);
  if (data.led && data.device !== os.hostname()) {
    state[data.led] = data.value;
    leds[data.led].output(data.value);
    io.emit(data.action, data.led);
  }
});

pub.bind(PORT, () => {
  pub.setBroadcast(true);
  pub.setMulticastTTL(128);

  try {
    pub.addMembership(MULTICAST_ADDRESS);
  } catch (error) {
    console.error(error);
  }
});

Object.keys(buttons).forEach((color) => {
  var button = buttons[color];
  button.on('fall', () => {
    console.log(`${color} button pressed`);
    var led = leds[color];
    var value = state[color];

    state[color] = !value;
    led.output(!value);

    var data = JSON.stringify({
      "action": "toggle",
      "led": color,
      "device": os.hostname(),
      "value": !value
    });
    pub.send(new Buffer(data), 0, data.length, PORT, MULTICAST_ADDRESS);
  });
});

io.on('connection', (socket) => {
  socket.on('toggle', (color) => {
    console.log(color);

    var value = state[color];

    state[color] = !value;
    leds[color].output(!value);

    var data = JSON.stringify({
      "action": "toggle",
      "led": color,
      "device": os.hostname(),
      "value": !value
    });
    pub.send(new Buffer(data), 0, data.length, PORT, MULTICAST_ADDRESS);
  });
});

server.listen(80, () => { 
  tessel.led[2].on(); 
  console.log(`Server running at http://${os.hostname()}.local/`);
});
