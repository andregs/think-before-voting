'use strict';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize } from 'cerialize';
import { AuthHttp } from 'angular2-jwt';

import { Question } from './question.model';

@Injectable()
export class QuestionService {

	private API_URL = 'api/question';

	constructor(private http: AuthHttp) {
	}

	next(): Observable<Question> {
		return this.http.get(`${this.API_URL}/next`)
			.map((res: Response) => {
				const json = res.json();
				return Deserialize(json, Question);
			});
	}

}