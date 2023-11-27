//create web server
var http = require('http');
//create file system
var fs = require('fs');
//create url
var url = require('url');
//create querystring
var querystring = require('querystring');
//create path
var path = require('path');
//create mime
var mime = require('mime');
//create mysql
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'comments'
});

function send(res, statusCode, data) {
    res.writeHead(statusCode, {'content-type': 'text/plain;charset=utf-8'});
    res.end(data);
}

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {'content-type': 'application/json;charset=utf-8'});
    res.end(data);
}

function sendFile(res, filePath, fileContents) {
    res.writeHead(200, {'content-type': mime.lookup(path.basename(filePath))});
    res.end(fileContents);
}

function serveStatic(res, cache, absPath) {
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    } else {
        //check if file exists
        fs.exists(absPath, function (exists) {
            if (exists) {
                //read file
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send(res, 404, 'Not Found');
                    } else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            } else {
                send(res, 404, 'Not Found');
            }
        });
    }
}

var cache = {};

var server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var query = url.parse(req.url).query;
    var queryObj = querystring.parse(query);
    var absPath = './' + pathname;
    if (pathname === '/') {
        absPath = './index.html';
    }
    serveStatic(res, cache, absPath);
});

server.listen(3000, function () {
    console.log('Server is listening on port 3000');
});

var io = require('socket.io')(server);
var count = 0;
io.on('connection', function (socket) {
    count++;
    socket.on('event', function () {
        // handle event
    });
});
