'use strict';

var username = process.env.ARANGODB_USERNAME;
var password = process.env.ARANGODB_PASSWORD;

db._createDatabase("think", {}, [{ username: username, passwd: password }]);
db._useDatabase('think');

var gm = require('@arangodb/general-graph');

var graph;

graph = gm._create('qaGraph', [
	{ from: ["user"], collection: "answer", to: ["question"] },
	{ from: ["question"], collection: "questioner", to: ["user"] },
]);

var andre = graph.user.save({
	username: 'andre',
	email: 'andregs@gmail.com',
	name: 'André Gomes',
	location: 'Belo Horizonte, MG, Brasil',
	following: 1,
	followers: 0,
	news: [
		{ type: 'ANSWERED', who: 'Justin Trudeau', questions: 3 },
		{ type: 'FOLLOWER', who: 'Ilya Brotzky' },
		{ type: 'ANSWERED', who: 'Enéas Carneiro', questions: 6 },
	],
	answers: [
		'Should Marijuana be legal?',
		'Should the rich pay a higher tax rate than the middle class?',
		'Should same sex marriage be legal?',
	],
});
var eneas = graph.user.save({
	username: 'eneas',
	email: 'eneas@prona.com.br',
	name: 'Enéas Carneiro',
	location: 'São Paulo, SP, Brasil',
	followed: true,
	affinity: {
		match: 2,
		answers: 3,
	},
	agree: [
		'Should Marijuana be legal?',
		'Should the rich pay a higher tax rate than the middle class?',
	],
	disagree: [
		'Should same sex marriage be legal?',
	],
});

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

graph = gm._create('worldGraph', [
	{ from: ["location"], collection: "include", to: ["location"] },
]);

var br = graph.location.save({ name: 'Brasil', type: 'country', abbreviation: 'BR' });
var sp = graph.location.save({ name: 'São Paulo', type: 'state', abbreviation: 'SP' });
var sbc = graph.location.save({ name: 'São Bernardo do Campo', type: 'city' });
var sa = graph.location.save({ name: 'Santo André', type: 'city' });
var mg = graph.location.save({ name: 'Minas Gerais', type: 'state', abbreviation: 'MG' });
var bh = graph.location.save({ name: 'Belo Horizonte', type: 'city' });
var moc = graph.location.save({ name: 'Montes Claros', type: 'city' });
var ca = graph.location.save({ name: 'Canada', type: 'country', abbreviation: 'CA' });
var bc = graph.location.save({ name: 'British Columbia', type: 'province', abbreviation: 'BC' });
var va = graph.location.save({ name: 'Vancouver', type: 'city' });
var vi = graph.location.save({ name: 'Victoria', type: 'city' });
var on = graph.location.save({ name: 'Ontario', type: 'province', abbreviation: 'ON' });
var to = graph.location.save({ name: 'Toronto', type: 'city' });
var ot = graph.location.save({ name: 'Ottawa', type: 'city' });

graph.include.save(br._id, sp._id, {});
graph.include.save(sp._id, sbc._id, {});
graph.include.save(sp._id, sa._id, {});
graph.include.save(br._id, mg._id, {});
graph.include.save(mg._id, bh._id, {});
graph.include.save(mg._id, moc._id, {});
graph.include.save(ca._id, bc._id, {});
graph.include.save(bc._id, va._id, {});
graph.include.save(bc._id, vi._id, {});
graph.include.save(ca._id, on._id, {});
graph.include.save(on._id, to._id, {});
graph.include.save(on._id, ot._id, {});

graph = gm._create('partyGraph', [
	{ from: ["party"], collection: "cover", to: ["location"] },
	{ from: ["user"], collection: "admin", to: ["party"] },
	{ from: ["user"], collection: "candidate", to: ["party"] },
]);

var pt = graph.party.save({ name: 'Partido dos Trabalhadores', abbreviation: 'PT' });
var prona = graph.party.save({ name: 'Partido da Reedificação da Ordem Nacional', abbreviation: 'PRONA' });

graph.cover.save(pt._id, br._id, {});
graph.cover.save(prona._id, br._id, {});
graph.admin.save(andre._id, pt._id, {});
graph.admin.save(andre._id, prona._id, {});
graph.admin.save(eneas._id, prona._id, {});
graph.candidate.save(eneas._id, prona._id, { office: 'president' });
