//module imports
var express = require('express');
var bodyParser = require('body-parser');
const gpio = require('onoff').Gpio;

//configuration import
var config = require('./utils/config');

//destructuring config
const { port } = config;

//Setting up Gpio pin
var pin = new gpio(config.pin, 'out');

//creating new express app
var app = express();

app.set('view engine', 'ejs');

//Setting up bodyParser
var urlEncodedParser = bodyParser.urlencoded({extended: false});

//Variable to know if GPIO is blinking
var blinking = false;

//setting static routes
app.use('/assets', express.static('assets'));
app.use('/controllers', express.static('controllers'));

//routing
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/on', (req, res) => {
    pin.write(1);
    res.render('index');
});

app.get('/off', (req, res) => {
    pin.write(0);
    res.render('index');
});

app.post('/', urlEncodedParser, (req, res) => {
    let {interval} = req.body;
    console.log(interval);
    if (interval != '' && interval > 150) {
        blinking = true;
        blink = setInterval(() => {
            if (pin.readSync() == 0) {
                pin.writeSync(1);
            }
            else { 
                pin.writeSync(0);
            }
        }, req.body.interval);
    }
    res.render('index');
});

app.get('/stop', (req, res) => {
    if (blinking) {
        clearInterval(blink);
        blinking = false;
    }
    res.render('index');
});

app.listen(port);
console.log(`The server is listening on port ${port}`);