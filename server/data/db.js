var mongoose = require('mongoose');
//var dburl = 'mongodb://localhost:27017/opsera';
var dburl = 'mongodb://sarv:sarv123@ds145923.mlab.com:45923/opseradb';

mongoose.connect(dburl);

mongoose.connection.on('connected', function(){
    console.log("Mongoose Connected to " + dburl);
});
mongoose.connection.on('disconnected', function(){
    console.log("Mongoose Disconnected");
});
mongoose.connection.on('error', function(err){
    console.log("Mongoose Connection Error: " + err);
});

process.on('SIGINT', function(){
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected through app termination");
        process.exit(0);
    });
});

process.on('SIGTERM', function(){
    mongoose.connection.close(function(){
        console.log('Mongoose disconnected through app termination (SIGTERM)');
        process.exit(0);
    });
});


process.once('SIGUSR2', function(){
    mongoose.connection.close(function(){
        console.log('Mongoose disconnected through app termination (SIGUSR2)');
        process.kill(process.pid, 'SIGUSR2');
    });
});

require('./hooks.model.js');
