var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apiUserSchema = new mongoose.Schema({

    username: {type: String, required: true},
    token: {type: String, required: true},
    repoName: {type: String, required: true},
    jenkinsUrl: {type: String, required: true},
    jUsername: {type: String, required: true},
    jPassword: {type: String, required: true},
    jobName: {type: String, required: true}
}); 

module.exports = mongoose.model('apiUser', apiUserSchema);
