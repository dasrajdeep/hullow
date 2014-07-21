var PeerServer = require('peer').PeerServer;
//var server = new PeerServer({port: 9000, path: '/'});
//var io = require('socket.io').listen(85);

var connected = {};

/*io.on('connection', function(socket) {
	console.log('socket.io client connected.');
	socket.emit('roster', connected);
	socket.on('register', function(data) {
		connected[data.id] = data.username;
		io.emit('join', {name:data.username, id:data.id});
	});
});

server.on('connection', function(id) {
    console.log('client connected with ID: ' + id);
});

server.on('disconnect', function(id) {
	delete connected[id];
	io.emit('leave', id);
    console.log('client disconnected with ID: ' + id);
});*/

module.exports = {};