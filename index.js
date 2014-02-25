var express = require('express');
var request = require('request');
var argv    = require('optimist').argv;

var port = argv.port || process.env.PORT || 5000;
var app = express()

// app.set("port", port);
app.set("views", __dirname + "/views");
app.set("view options", { layout: false, pretty: true });
app.set("view engine", "jade");
app.use('/assets', express.static(__dirname + '/assets'))

app.get('/', function(req, res) {
    var opts = {url: 'http://tosheroon.herokuapp.com/blog/search', json:true}
	request(opts, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
        res.render('posts', { blogs: body })
	  }
	})
})

app.get('/post/:id', function(req, res) {
    var opts = { url: 'http://tosheroon.herokuapp.com/blog/' + req.params.id, json:true}
	request(opts, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
        res.render('post', { blog: body })
	  }
	})
})

app.listen(port)
console.log('Starting Sample Blog on ' + port)