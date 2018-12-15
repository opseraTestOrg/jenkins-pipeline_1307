var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gitlabUserSchema = new mongoose.Schema({
    
    token: {type: String, required: true},
    projectName: {type: String, required: true},
    jenkinsUrl: {type: String, required: true},
    jUsername: {type: String, required: true},
    jPassword: {type: String, required: true},
    jobName: {type: String, required: true}
}); 

module.exports = mongoose.model('gitlabUserSchema', gitlabUserSchema);
