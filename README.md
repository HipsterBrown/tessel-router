# Tessel Router with Gemma Control

A sample project for the [Tessel 2](https://tessel.io) that walks through creating a custom access point and serving a web app to connected devices for controlling an [Adafruit Gemma](https://learn.adafruit.com/introducing-gemma/introduction). 

## Requirements

- Git
- Node.js (at least version 4.0.0)
- [t2-cli](https://www.npmjs.com/package/t2-cli)
- [Tessel 2](https://tessel.io)
- 2 microUSB -> USB cords
- [hookip wire](https://www.adafruit.com/products/290)
- [wire strippers](https://www.adafruit.com/products/527)
- [Adafruit Gemma](https://learn.adafruit.com/introducing-gemma/introduction)

## Setup The Gemma

Follow the ["Setting up with Arduino IDE" tutorial](https://learn.adafruit.com/introducing-gemma/setting-up-with-arduino-ide#adafruit-gemma-black-gemma) and upload the following code to the Gemma:

```
#define SWITCH 0
#define LED 1
 
// the setup routine runs once when you press reset:
void setup() {
  // initialize the LED pin as an output.
  pinMode(LED, OUTPUT);
  // initialize the SWITCH pin as an input.
  pinMode(SWITCH, INPUT);
  // ...with a pullup
  digitalWrite(SWITCH, HIGH);
}
 
// the loop routine runs over and over again forever:
void loop() {
  if (! digitalRead(SWITCH)) {  // if the button is pressed
    digitalWrite(LED, HIGH);    // light up the LED
  } else {
    digitalWrite(LED, LOW);     // otherwise, turn it off
  }
}
```

For the hardware setup, start by attach one of hte microUSB->USB cords to the Gemma's microUSB port.

Then cut two pieces of hookup wire from the spool, if there are two different colors available that's even better, and strip the ends using the wire strippers. Take a look at this [Adafruit Flora tutorial](https://learn.adafruit.com/flora-pixel-brooch/connect-first-signal-wire) for steps on how to connect one wire to the GND hole and the other wire to the D0 hole on the Gemma:

![Gemma pinout spec](https://learn.adafruit.com/system/assets/assets/000/025/643/medium800/gemma.png?1432753698)

Check out [this page](https://learn.adafruit.com/introducing-gemma/pinouts) for more info on the Gemma's pins and other connections.

## Setup the Tessel

Start with the hardware setup before connecting the Tessel to power. Plug the USB side of the microUSB->USB cord connected to the Gemma into one of Tessel's USB ports. Then connect the end of the GND wire to the GND pin on Tessel's port A (the one closest to the USB ports) and connect the end of the D0 wire to the pin labeled "2" (the fourth pin after GND) on port A as well. The D0->pin 2 connection will be how Tessel communicates with the Gemma. There is more info on that communication protocol [here](https://tessel.io/docs/hardwareAPI#ports-and-pins) under the "Digital Pins" section.

For the software side, start off by cloning this repo and `cd`ing into the created folder:

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

From there, we can connect to the "TesselRouter" Wifi network and go to "http://192.168.1.101:8080/" in our preferred browser. If we click/tap the buttons on the page, we should see the red light on the Gemma toggle on/off or blink. Using this same program, we could attach some [sequin LEDs](https://www.adafruit.com/product/1757) or [RGB Neopixels](https://www.adafruit.com/products/1260) to the Gemma's D1 pin and control those as well. 

Feel free to fork the project and try extending the features to use various Tessel 2 modules.
