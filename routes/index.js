var express = require('express');
var router = express.Router();

module.exports = function(p2p) {
	
	router.get('/', function(req, res) {
		res.render('index', { title: 'Test'});
	});

	router.get('/view/:name', function(req, res) {
		var view_name = req.params.name;
		res.render(view_name, {});
	});

	router.get('/users', function(req, res) {
		var users = p2p.connected_users;
		res.json(users);
	});
	
	return router;
};