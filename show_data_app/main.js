var http = require('http');
var express = require('express');
var request = require('request-promise');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


var listeningPort = 80;
var ipAdress = '127.0.0.1';
var dbAppIP = process.env.DB_APP_IP;

async function sendGetRequest(url) {
    const options = {
        url: url,
        method: "GET",
        resolveWithFullResponse: true
    };

    try {
        const response = await request(options);
        return Promise.resolve(response);
    }
    catch (error) {
        return Promise.reject(error);
    }
};


app.get('/', async (req, res) => {
    var response = await sendGetRequest(`http://${dbAppIP}`);
    console.log(`response status code: ${response.statusCode}`);

    if (response.statusCode == 403)
        return res.send('403: Error!');
    
    var dataParsed = JSON.parse(response.body);
    res.render('form1', { rows: dataParsed });
});

http.createServer(app).listen(listeningPort, () => {
    console.log(`server running on: http://${ipAdress}:${listeningPort}`);
});