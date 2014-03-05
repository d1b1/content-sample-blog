var express = require('express');
var request = require('request');
var argv    = require('optimist').argv;

var port = argv.port || process.env.PORT || 5000;
var app = express()

app.set("views", __dirname + "/views")
app.set("view options", { layout: false, pretty: true })
app.set("view engine", "jade")
app.use(express.bodyParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())

var domain = process.env.API_URL || 'http://tosheroon.herokuapp.com';

app.get('/', function(req, res) {
    var opts = {url: domain + '/blog/search', json: true}
	request(opts, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
        res.render('posts', { blogs: body })
	  }
	})
})

app.get('/post/:id', function(req, res) {
    var opts = { url: domain + '/blog/' + req.params.id, json: true}
	request(opts, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
        res.render('post', { blog: body })
	  }
	})
})

app.get('/post/:id/edit', function(req, res) {
    var opts = { url: domain + '/blog/' + req.params.id, json: true}
	request(opts, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
        res.render('form', { blog: body })
	  }
	})
})

app.post('/post/:id', function(req, res) {

  var data = req.body
  delete req.body._id

  var opts = {
  	url: domain + '/blog/' + req.params.id,
  	form: data
  }

  request.put(opts, function (e, r, body) {
    res.redirect('/')
  })

})

app.use(app.router);

var assets = {
    "style.css" : {
        type: "css",
        dir: "css",
        files: [
            "bootstrap.css",
            "bootstrap-responsive.css",
            "custom.css"
        ]
    },
    "javascript.js" : {
        type: "js",
        dir: "js",
        files: [
            "jquery.js",
            "jquery.cookie.js",
            "bootstrap-typeahead.js",
            "bootstrap-dropdown.js",
            "bootstrap-collapse.js",
            "bootstrap-tab.js",
            "bootstrap-affix.js",
            "bootstrap-modal.js",
            "bootstrap-carousel.js",
            "bootstrap-tooltip.js",
            "underscore.js"
        ]
    }
}

var assetManagerConfig = {
	env         : "production",
    rootRoute   : "/static",
    srcDir      : "./assets",
    buildDir    : "./builtAssets",
    process     : "false"
};

app.use(require("express-asset-manager")(assets, assetManagerConfig));

console.log(process.env.NODE_ENV)

app.configure('development', function() {
    app.use('/assets', express.static(__dirname + '/assets'))
});

// in production, use a reverse proxy instead
app.configure('production', function() {
    app.use('/assets', express.static(__dirname + '/builtAssets'))
});

app.listen(port)
console.log('Starting Sample Blog on ' + port)
console.log('Using ' + domain)