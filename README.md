# Tessel Router

A sample project for the [Tessel 2](https://tessel.io) that walks through creating a custom access point and serving a web app to connected devices for controlling the Tessel's embedded LEDs. 

## Requirements

- Git
- Node.js (at least version 4.0.0)
- [t2-cli](https://www.npmjs.com/package/t2-cli)
- [Tessel 2](https://tessel.io)
- microUSB -> USB cord

## Setup

Start off by cloning this repo and `cd`ing into the created folder:

```bash
git clone https://github.com/HipsterBrown/tessel-router.git
cd tessel-router
```

Then install the `t2-cli` package globally, if it hasn't been yet:

```bash
npm install --global t2-cli
```

Once that is done, connect the Tessel 2 using the microUSB -> USB cord and search for it using `t2-cli`:

```bash
t2 list
```

The name of the Tessel should appear in the command line, which confirms that the Tessel 2 is connected via USB. Now we can create the custom access point using `t2-cli` called "TesselRouter" with the password "SuperSecret123":

```bash
t2 ap --ssid TesselRouter --password SuperSecret123
```

If a confirmation message appears in the command line, we should be able to see "TesselRouter" in the list of available Wifi networks from the computer's network settings. We don't need to connect to it just yet. First, we can start the Node.js server on the Tessel 2 by pushing this project code onto the device:

```bash
t2 run index.js
```

That command will take the `index.js` file and the `index.html` file (because it's listed in the `.tesselinclude` config file), send it via USB to the Tessel 2, which will automatically run the Node.js script (`index.js`). We should see a message like "Server running at http://192.168.1.101:8080/" once the server is ready.

From there, we can connect to the "TesselRouter" Wifi network and go to "http://192.168.1.101:8080/" in our preferred browser. If we click the buttons on the page, we should see the corresponding LEDs on the Tessel 2 toggle on or off. 


Feel free to fork the project and try extending the features to use various Tessel 2 modules.
