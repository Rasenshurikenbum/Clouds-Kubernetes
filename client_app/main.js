var http = require('http');
var express = require('express');
var qs = require('querystring');
var request = require('request-promise');

var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./css"));


var listeningPort = 80;
var ipAdress = '127.0.0.1';
var dbAppIP = process.env.DB_APP_IP;
var showDataAppIp = process.env.SHOW_DATA_APP_IP;

async function sendPostRequest(url, jsonObject) {
    const options = {
        url: url,
        method: "POST",
        json: true,
        body: jsonObject,
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


app.get('/', (req, res) => {
    res.render('form1_new');
});

app.post('/', async (req, res) => {
    var response = await sendPostRequest(`http://${dbAppIP}`, req.body);
    console.log(`response status code: ${response.statusCode}`);
    
    if (response.statusCode == 403)
        return res.send('403: Error!');
    
    dataString = qs.stringify(req.body);
    return res.redirect('/print?' + dataString);    
});

app.get('/print', (req, res) => {
    var dataParsed = req.query;
    dataParsed.dbAppIP = dbAppIP;
    dataParsed.showDataAppIp = showDataAppIp;

    res.render('form2', dataParsed);
});

http.createServer(app).listen(listeningPort, () => {
    console.log(`server running on: http://${ipAdress}:${listeningPort}`);
});