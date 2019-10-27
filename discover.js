var mdns = require('mdns-js');

mdns.excludeInterface('0.0.0.0');

var browser = mdns.createBrowser('_tessel._tcp');

browser.once('ready', () => {
  browser.discover();
});

browser.on('update', (discovered) => {
  console.log(discovered);
});
