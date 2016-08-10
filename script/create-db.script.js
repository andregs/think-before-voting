'use strict';

var username = process.env.ARANGODB_USERNAME;
var password = process.env.ARANGODB_PASSWORD;

db._createDatabase("think", {}, [{username: username, passwd: password}]);
db._useDatabase('think');

var gm = require('@arangodb/general-graph');
