var PORT = 33333;
var HOST = '192.168.1.103';
var MULTICAST_ADDRESS = '239.10.10.100';

var dgram = require('dgram');
var exec = require('child_process').execSync;
var tessel = require('tessel');
tessel.led[2].off();

var client = dgram.createSocket('udp4');


/*
server.on('listening', function () {
  var address = server.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
  console.log(remote.address + ':' + remote.port +' - ' + message);
});

server.bind(PORT, HOST);

var PORT = 8088;
var HOST = '192.168.1.101';
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
*/

try {
exec('route add -net 224.0.0.0/4 dev wlan0');
} catch (error) {
  console.error(error);
}

client.on('listening', function () {
  var address = client.address();
  console.log('UDP Client listening on ' + address.address + ":" + address.port);
  tessel.led[2].on();
  client.setBroadcast(true)
  client.setMulticastTTL(128); 
  client.addMembership(MULTICAST_ADDRESS);
});

client.on('message', function (message, remote) {   
  console.log('A: Epic Command Received. Preparing Relay.');
  console.log('B: From: ' + remote.address + ':' + remote.port +' - ' + message);
  tessel.led[3].toggle();
});

client.bind(PORT);
