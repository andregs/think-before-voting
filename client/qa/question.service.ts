'use strict';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize, Serialize } from 'cerialize';
import { AuthHttp } from 'angular2-jwt';

import { Question } from './ask/question.model';
import { Answer } from './answer/answer.model';

const QUESTION_URL = 'api/question';
const ANSWER_URL = 'api/answer';

/** This service manages Questions & Answers. */
@Injectable()
export class QuestionService {

	private strategy: 'random';

	constructor(
		private http: AuthHttp,
		private router: Router,
	) {
		console.log('building question service');
		this.strategy = 'random';
	}

	/** Requests a question by its key. */
	get(key: string): Observable<Question> {
		return this.http.get(`${QUESTION_URL}/${key}`)
			.map((res: Response) => {
				const json = res.json();
				const found = Deserialize(json, Question);
				return found;
			});
	}

	/**
	 * Requests the authenticated user's answer to the given question.
	 * If the user has not answered yet then returns a blank Answer.
	 */
	getAnswer(questionKey: string): Observable<Answer> {
		return this.http.get(`${ANSWER_URL}/${questionKey}`)
			.map((res: Response) => {
				const json = res.json();
				const found = Deserialize(json, Answer);
				return found;
			});
	}

	/** Saves (insert/update) the given question. */
	save(question: Question): Observable<Question> {
		const body = JSON.stringify(Serialize(question));
		const options = this.defaultOptions();
		const stream = question._rev ?
			this.http.patch(`${QUESTION_URL}/${question._key}`, body, options) :
			this.http.post(QUESTION_URL, body, options);

		return stream.map(response => {
			const saved = Deserialize(response.json(), Question);
			return saved;
		});
	}

	/** Saves (insert/update) the given answer. */
	saveAnswer(answer: Answer): Observable<Answer> {
		const body = JSON.stringify(Serialize(answer));
		const options = this.defaultOptions();
		const stream = answer._rev ?
			this.http.patch(`${ANSWER_URL}/${answer._key}`, body, options) :
			this.http.post(`${ANSWER_URL}/${answer.question._key}`, body, options);

		return stream.map(response => {
			const saved = Deserialize(response.json(), Answer);
			return saved;
		});
	}

	/** 
	 * Requests the next unanswered question according to the selected strategy.
	 * Pass a `skip` param to filter that question out.
	 */
	next(skip?: Question): Observable<Question> {
		let url = QUESTION_URL + '/random';
		if (skip) url += '?skip=' + skip._key;
		return this.http.get(url)
			.map((res: Response) => {
				const json = res.json();
				return Deserialize(json, Question) as Question;
			});
	}

	private defaultOptions() {
		const headers = new Headers({ 'Content-Type': 'application/json' });
		return new RequestOptions({ headers: headers });
	}

}