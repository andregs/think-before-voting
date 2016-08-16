'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const model = {
	'andre': {
		me: true,
		username: 'andre',
		name: 'André Gomes',
		avatar: 'client/assets/anyone.png',
		location: 'Belo Horizonte, MG, Brazil',
		following: 17,
		followers: 12,
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
	},
	'eneas': {
		me: false,
		username: 'eneas',
		name: 'Enéas Carneiro',
		avatar: 'client/assets/anyone.png',
		location: 'São Paulo, SP, Brazil',
		followed: true,
		affinity: {
			match: 2,
			answers: 3,
			percent: function(){
				return this.match / this.answers * 100;
			},
			text: function () {
				if (this.percent() > 2 / 3 * 100) return 'PROFILE.AFFINITY.HIGH';
				if (this.percent() > 1 / 3 * 100) return 'PROFILE.AFFINITY.MODERATE';
				return 'PROFILE.AFFINITY.LOW';
			}
		},
		agree: [
			'Should Marijuana be legal?',
			'Should the rich pay a higher tax rate than the middle class?',
		],
		disagree: [
			'Should same sex marriage be legal?',
		],
	}
};

@Component({
	selector: 'tbv-profile',
	templateUrl: 'client/profile/profile.component.html',
	styleUrls: ['client/profile/profile.component.css'],
})
export class ProfileComponent implements OnInit {

	user: Object;

	constructor(
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.user = model[params['name']];
		});
	}

}
