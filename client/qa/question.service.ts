'use strict';

import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize, Serialize } from 'cerialize';
import { AuthHttp } from 'angular2-jwt';

import { Question } from './question.model';

const API_URL = 'api/question';

/** This service manages Questions & Answers. */
@Injectable()
export class QuestionService {

	constructor(
		private http: AuthHttp,
	) { }

	next(): Observable<Question> {
		return this.http.get(`${API_URL}/next`)
			.map((res: Response) => {
				const json = res.json();
				return Deserialize(json, Question);
			});
	}

	/** Requests a question by its key. */
	get(key: string): Observable<Question> {
		return this.http.get(`${API_URL}/${key}`)
			.map((res: Response) => {
				const json = res.json();
				const found = Deserialize(json, Question);
				return found;
			});
	}

	/** Saves (insert/update) the given question. */
	save(question: Question): Observable<Question> {
		const body = JSON.stringify(Serialize(question));
		const options = this.defaultOptions();
		const stream = question._rev ?
			this.http.patch(`${API_URL}/${question._key}`, body, options) :
			this.http.post(API_URL, body, options);

		return stream.map(response => {
			const saved = Deserialize(response.json(), Question);
			return saved;
		});
	}

	private defaultOptions() {
		const headers = new Headers({ 'Content-Type': 'application/json' });
		return new RequestOptions({ headers: headers });
	}

}