require('./server/data/db.js');
var express = require('express'); 
var app = express();
var path = require('path');
var routes = require('./server/routes/api.js');
var bodyParser = require('body-parser');

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'dist')));
//app.use(express.static(path.join(__dirname, './asset/uploads')));

//app.use('/images', express.static('./asset'));
//BodyParser middleware - We only need strings and arrays from form body 
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit : '50mb' }));

app.use('/api', routes);

var server = app.listen(app.get('port'), function(){
    var port = server.address().port;
    console.log("api on port" + port);
});
