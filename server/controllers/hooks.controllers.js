var request = require('request');
var https = require('https');
var curl = require('curl');
var apiUser = require('../data/hooks.model.js');


module.exports.createHooks = function(req, res){
    var newUser = new apiUser({
        username:req.body.username,
        token: req.body.token,
        repoName: req.body.repoName,
        jenkinsUrl: req.body.jenkinsUrl,
        jUsername: req.body.jUsername,
        jPassword: req.body.jPassword,
        jobName: req.body.jobName
    });
    var username = req.body.username;
    var repoName = req.body.repoName;
    var tokenid = 'token '+ req.body.token;
    var url = "https://api.github.com/repos/"+username+"/"+repoName+"/hooks";
    console.log("final url:", url);
    var body = {
        "name": "web",
        "active": true,
        "events": ["push"],
        "config": {
            'url': "http://54.172.162.179:3000/api/avgit/getInit", 
            'content_type': "json"
        }
    }
    var options = {
        headers: {
            'Authorization': tokenid,
            'user-agent': 'vdops'
        }
    }
    curl.postJSON(url, body, options, function(err, result){
        if(err)
            res.json(err);
        else{
            console.log(result);      
            newUser.save(function(err, response){
                if(err)
                    res.send(err);
                else{
                    res.json({"msg":"hook created successfully and apiUser details added"}).status(200);
                }
            })
        }
    })
}

module.exports.getInit = function(req, res){
    //console.log("printing reqest body: ", req);
    //console.log("printing reqest body: ", req.body.repository);
    var username = req.body.repository.owner.name;
    var repoName = req.body.repository.name;
    console.log("username and reponame:", username,repoName);
    apiUser.find({$and: [{username: username}, {repoName: repoName}]},function(err, result){
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
    
    //res.json(req);
    
};

module.exports.createObject = function(req, res){
    var url = "http://3.16.13.201:5601/api/saved_objects/search/myDocker";
    //var body = "{\"id\":\"myDocker\",\"type\":\"search\",\"updated_at\":\"2018-11-24T19:11:12.415Z\",\"version\":3,\"attributes\":{\"title\":\"containerID\",\"description\":\"\",\"hits\":0,\"columns\":[\"_source\"],\"sort\":[\"@timestamp\",\"desc\"],\"version\":1,\"kibanaSavedObjectMeta\":{\"searchSourceJSON\":\"{\\\"index\\\":\\\"metricbeat-*\\\",\\\"highlightAll\\\":true,\\\"version\\\":true,\\\"query\\\":{\\\"query\\\":\\\"\\\",\\\"language\\\":\\\"lucene\\\"},\\\"filter\\\":[{\\\"meta\\\":{\\\"index\\\":\\\"metricbeat-*\\\",\\\"type\\\":\\\"phrases\\\",\\\"key\\\":\\\"docker.container.id\\\",\\\"value\\\":\\\"bda45daacab4e723ebdf15b5df1704f5781e46f6f38eaf33433ba36fc0ec1fd0, c8c216f6686e7cc4a9d6123e26205996d5f7c13497a3108c6e22662d7789d3f9\\\",\\\"params\\\":[\\\"bda45daacab4e723ebdf15b5df1704f5781e46f6f38eaf33433ba36fc0ec1fd0\\\",\\\"c8c216f6686e7cc4a9d6123e26205996d5f7c13497a3108c6e22662d7789d3f9\\\"],\\\"negate\\\":false,\\\"disabled\\\":false,\\\"alias\\\":null},\\\"query\\\":{\\\"bool\\\":{\\\"should\\\":[{\\\"match_phrase\\\":{\\\"docker.container.id\\\":\\\"bda45daacab4e723ebdf15b5df1704f5781e46f6f38eaf33433ba36fc0ec1fd0\\\"}},{\\\"match_phrase\\\":{\\\"docker.container.id\\\":\\\"c8c216f6686e7cc4a9d6123e26205996d5f7c13497a3108c6e22662d7789d3f9\\\"}}],\\\"minimum_should_match\\\":1}},\\\"$state\\\":{\\\"store\\\":\\\"appState\\\"}}]}\"}}}";
    var body = {"attributes":{"title":"containerID","description":"","hits":0,"columns":["_source"],"sort":["@timestamp","desc"],"version":1,"kibanaSavedObjectMeta":{"searchSourceJSON":"{\"index\":\"metricbeat-*\",\"highlightAll\":true,\"version\":true,\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"meta\":{\"index\":\"metricbeat-*\",\"type\":\"phrases\",\"key\":\"docker.container.id\",\"value\":\"bda45daacab4e723ebdf15b5df1704f5781e46f6f38eaf33433ba36fc0ec1fd0, c8c216f6686e7cc4a9d6123e26205996d5f7c13497a3108c6e22662d7789d3f9\",\"params\":[\"bda45daacab4e723ebdf15b5df1704f5781e46f6f38eaf33433ba36fc0ec1fd0\",\"c8c216f6686e7cc4a9d6123e26205996d5f7c13497a3108c6e22662d7789d3f9\"],\"negate\":false,\"disabled\":false,\"alias\":null},\"query\":{\"bool\":{\"should\":[{\"match_phrase\":{\"docker.container.id\":\"bda45daacab4e723ebdf15b5df1704f5781e46f6f38eaf33433ba36fc0ec1fd0\"}},{\"match_phrase\":{\"docker.container.id\":\"c8c216f6686e7cc4a9d6123e26205996d5f7c13497a3108c6e22662d7789d3f9\"}}],\"minimum_should_match\":1}},\"$state\":{\"store\":\"appState\"}}]}"}}};
    var options = {
        headers: {
            'kbn-xsrf' : true,
            'Content-Type': 'application/json'
        }
    };
    /*curl.get(url, options, function(err, result){
        if(err)
            res.send(err);
        else
            res.json(result);        
    } )*/
    curl.postJSON(url,body, options, function(err, result){
        if(err)
            res.send(err);
        else
            res.send(result);
    })
}


