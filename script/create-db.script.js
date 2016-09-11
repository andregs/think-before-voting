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

// populate DB with some dummy data because this app still is just a prototype

graph = gm._create('qaGraph', [
	{ from: ["user"], collection: "answer", to: ["question"] },
	{ from: ["question"], collection: "questioner", to: ["user"] },
]);

var users = internal.load('./script/users.json');
var andre = graph.user.save(users[0]);
var eneas = graph.user.save(users[1]);

var q1 = graph.question.save({
	title: "What's more important for you?",
	options: [
		"Quality improvement in public health.",
		"Fighting deforestation."
	],
	answers: 0
});
graph.questioner.save(q1._id, eneas._id, {});
graph.answer.save(eneas._id, q1._id, { chosen: 1, opinion: 'meu nome ENÉÉÉAS!' });
graph.answer.save(andre._id, q1._id, { chosen: 0, opinion: 'foo bar' });

graph = gm._create('socialGraph', [
	{ from: ["user"], collection: "follow", to: ["user"] },
]);

graph.follow.save(andre._id, eneas._id, {});

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
	{ from: ["user"], collection: "admin", to: ["party"] },
	{ from: ["user"], collection: "candidate", to: ["party"] },
]);

var parties = internal.load('./script/parties.json');
parties.forEach(p => graph.party.save(p));

var prona = graph.party.save({ _key: 'PRONA', name: 'Partido da Reedificação da Ordem Nacional', code: 80 });
graph.admin.save(eneas._id, prona._id, {});
graph.candidate.save(eneas._id, prona._id, { office: 'Presidente' });
