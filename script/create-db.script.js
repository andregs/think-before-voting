'use strict';

var config = require('../app-config');
var username = config.arangodb.username;
var password = config.arangodb.password;

db._createDatabase("think", {}, [{ username: username, passwd: password }]);
db._useDatabase('think');

var internal = require('internal');
var _ = require('underscore');
var gm = require('@arangodb/general-graph');

var graph;

graph = gm._create('userGraph', [
	{ from: ['user'], collection: 'livesIn', to: ['location'] },
]);

var admin = graph.user.save({
	"_key": "admin",
	"email": "admin@example.com",
	"name": "Admin da Silva",
	"admin": true
});

graph = gm._create('qaGraph', [
	{ from: ["user"], collection: "answer", to: ["question"] },
	{ from: ["question"], collection: "questioner", to: ["user"] },
]);

graph = gm._create('socialGraph', [
	{ from: ["user"], collection: "follow", to: ["user"] },
]);

// data from http://www.tse.jus.br/eleicoes/estatisticas/repositorio-de-dados-eleitorais

graph = gm._create('worldGraph', [
	{ from: ["location"], collection: "include", to: ["location"] },
]);
var country = graph.location.save({ _key: 'BR', name: 'Brasil' });
var states = internal.load('./script/states.json');
var cities = internal.load('./script/cities.json');

states.forEach(s => {
	var state = graph.location.save(s);
	graph.include.save(country._id, state._id, {});

	var stateCities = _.filter(cities, c => c.uf === state._key);
	stateCities.forEach(c => {
		var city = graph.location.save({ name: c.name });
		graph.include.save(state._id, city._id, {});
	});
});

graph = gm._create('partyGraph', [
	{ from: ["party"], collection: "member", to: ["user"] },
	{ from: ["user"], collection: "candidate", to: ["location"] },
]);

var parties = internal.load('./script/parties.json');
parties.forEach(p => {
	var party = graph.party.save(p);
	graph.member.save(party._id, admin._id, { admin: true });
});
