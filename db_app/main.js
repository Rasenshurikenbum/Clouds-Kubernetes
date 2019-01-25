var scoresRepositoryClass = require('./ScoresRepository.js');
var mysql = require('mysql');

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

var listeningPort = 3000;
var ipAdress = '127.0.0.1';


app.post('/', async (req, res) => {
    var score = req.body;
    
    try {
        
        await scoresRepository.insert(score);
    }
    catch (err) {
        res.status(403).send();
    }
    finally {
        res.status(201).send();
    }
});

app.get('/', async (req, res) => {
    try {
        var scores = await scoresRepository.retrieveAll();

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(scores));
    }
    catch (err) {
        res.status(403).send();
    }
    finally {
        res.status(200).send();
    }
});

http.createServer(app).listen(listeningPort, () => {
    console.log(`server running on: http://${ipAdress}:${listeningPort}`);
});


var host = process.env.HOST;
var user = process.env.USER;
var password = process.env.PASSWORD;
var db = process.env.DBNAME;

var conn = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: db
});

try {
    var scoresRepository = new scoresRepositoryClass(conn);
}
catch (err) {
    console.log(err);
}