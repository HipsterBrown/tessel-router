var dgram = require('dgram'); 
var exec = require('child_process').execSync;
var tessel = require('tessel');
tessel.led[2].off();

var PORT = 33333;
var HOST = '192.168.1.101';
var MULTICAST_ADDRESS = '239.10.10.100';
/*
var os = require('os');
var mdns = require('mdns-js');

mdns.excludeInterface('0.0.0.0');

var PORT = 33333;
var HOST = '192.168.1.103';

var hostname = os.hostname();
var server = dgram.createSocket("udp4"); 
var browser = mdns.createBrowser('_tessel._tcp');

browser.once('ready', () => {
  browser.discover();
});
*/

/*
var dgram = require('dgram');
var message = new Buffer('Hello from another Tessel!');

var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
  if (err) throw err;
  console.log('UDP message sent to ' + HOST +':'+ PORT);
  client.close();
});
*/
var server = dgram.createSocket("udp4"); 

var news = [
  "Borussia Dortmund wins German championship",
  "Tornado warning for the Bay Area",
  "More rain for the weekend",
  "Android tablets take over the world",
  "iPad2 sold out",
  "Nation's rappers down to last two samples"
];

try {
  exec('route add -net 224.0.0.0/4 dev wlan0');
} catch (error) {
  console.error(error);
}

server.on('message', (message, remote) => {
  console.log('Message Received!');
  console.log(`From ${remote.address}:${remote.port}`);

  console.log(message.toString());
});

server.bind(PORT, function () {
  server.setBroadcast(true)
  server.setMulticastTTL(128);
  try {
    server.addMembership(MULTICAST_ADDRESS); 
  } catch (error) {
    console.error(error);
  }
  tessel.led[2].on();
});

setInterval(() => {broadcastNew(PORT, MULTICAST_ADDRESS)}, 3000);

function broadcastNew(port, host) {
  var message = new Buffer(news[Math.floor(Math.random()*news.length)]);
  server.send(message, 0, message.length, port, host);
  console.log("Sent " + message + " to the wire...");
  tessel.led[3].toggle();
  //server.close();
}

/*
browser.on('update', (discovered) => {
  if (!discovered.host.includes('hostname')) {
    broadcastNew(PORT, discovered.addresses[0]);
  }
});
*/
