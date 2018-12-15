var curl = require('curl');
var gitlabUser = require('../data/glhooks.model.js');
var gitlab = require('node-gitlab');

//Gitlab create hook
module.exports.createglHooks = function(req, res){
    var newUser = new gitlabUser({
        projectName : req.body.projectName,
        token: req.body.token,
        //projectID: req.body.projectID,
        jenkinsUrl: req.body.jenkinsUrl,
        jUsername: req.body.jUsername,
        jPassword: req.body.jPassword,
        jobName: req.body.jobName
    });
    var projectName = req.body.projectName;
    var token = req.body.token;
    // var url = "https://api.github.com/repos/"+username+"/"+repoName+"/hooks";
    var client = gitlab.create({
        api: 'https://gitlab.com/api/v4',
        privateToken: token
    });
    client.hooks.create({
        id : projectName, 
        url : "http://54.172.162.179:3000/api/avgit/getTrigger", 
        push_events : true
    }, function(err, glhook){
        if(err){
            res.json(err);
            console.log(err);
        }
        else{
            console.log(glhook);      
            newUser.save(function(err, response){
                if(err)
                    res.send(err);
                else{
                    res.json({"msg":"hook created successfully and glUser details added"}).status(200);
                }
            })
        }
    })
}

//Get trigger from gitlab

module.exports.getTrigger = function(req, res){
    console.log(req.body);
    var projectName = req.body.project_id;
    console.log("project ID:", projectName);
    gitlabUser.find({projectName: projectName},function(err, result){
        if(err){
            res.send(err).status(400);
        }
        else{
            console.log("Result of find:", result);
            var jobName = result[0].jobName;
            var jUsername = result[0].jUsername;
            var jPassword = result[0].jPassword;
            var jenkinsUrl = result[0].jenkinsUrl;
            var jobName = result[0].jobName;
            var baseUrl = 'http://'+jUsername+':'+jPassword+'@'+jenkinsUrl;;
            console.log("Base URL:", baseUrl);
            var jk = require('jenkins')({ baseUrl: baseUrl, crumbIssuer: true });
            jk.job.build(jobName, function(err, data){
                if(err){
                    console.log(err);
                    res.json(err).status(400);
                }
                else{
                    console.log('status', data);
                    res.json(data).status(200);
                }
            })
        }
    })
}
