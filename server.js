var debug = require('debug')('hullow');
var app = require('./app');

app.set('port', process.env.PORT || 80);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});