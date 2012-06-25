var express = require('express');
var routes = require('./routes');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));

//var privateKey = fs.readFileSync('privatekey.pem').toString();
//var certificate = fs.readFileSync('certificate.pem').toString();

var app = module.exports = express.createServer();//{key: privateKey, cert: certificate});
//var io = require('socket.io').listen(app);

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.session({ secret: "keyboard cat",
			store: express.session.MemoryStore({ reapInterval: 60000 })
		}));
	app.use(express.csrf());
	app.use(app.router);
	app.use(express.static(__dirname + "/public"));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

app.dynamicHelpers({
	token: function(request, response) {
		return request.session._csrf;
	}
});

// routing
app.get('/', routes.index);

app.get('/login', routes.loginGet);
app.post('/login', routes.loginPost);
app.get('/register', routes.registerGet);
app.post('/register', routes.registerPost);
app.get('/logout', routes.logout);

exports.server = app

// listening
app.listen(process.env.DEPLOY_PORT || config.server.port, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// socket.io listener
/*io.sockets.on('connection', function (socket) {
	socket.on('sendupdate', function (data) {
		io.sockets.emit('updatedisplay', socket.username, data);
	});
});*/
