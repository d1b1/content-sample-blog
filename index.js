var express = require('express');
var request = require('request');
var argv    = require('optimist').argv;

var port = argv.port || process.env.PORT || 5000;
var app = express()

app.set("views", __dirname + "/views");
app.set("view options", { layout: false, pretty: true });
app.set("view engine", "jade");

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
    process     : "true"
};

app.use(require("express-asset-manager")(assets, assetManagerConfig));

app.configure('development', function() {
    app.use('/assets', express.static(__dirname + '/assets'))
});

// in production, use a reverse proxy instead
app.configure('production', function() {
    app.use('/assets', express.static(__dirname + '/builtAssets'))
});

app.listen(port)
console.log('Starting Sample Blog on ' + port)