var express = require('express');
var router = express.Router();

module.exports = function() {
	
	router.get('/', function(req, res) {
		res.render('index', { title: 'Hullow'});
	});

	router.get('/view/:name', function(req, res) {
		var view_name = req.params.name;
		res.render(view_name, {});
	});
	
	return router;
};