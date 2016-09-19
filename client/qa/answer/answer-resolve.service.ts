'use strict';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Answer } from './answer.model';
import { QuestionService } from '../question.service';

/**
 * This guard ensures the answer to the requested question is available before 
 * the route is activated, or redirects the user to an error page.
 */
@Injectable()
export class AnswerResolveService implements Resolve<Answer> {

	constructor(
		private service: QuestionService,
		private router: Router
	) { }

	resolve(route: ActivatedRouteSnapshot): Observable<any> {
		const key = route.params['key'];
		return this.service.getAnswer(key)
			.catch((error: Response) => {
				this.router.navigate(['/error', error.status], { skipLocationChange: true });
				return Observable.of(false);
			});
	}
}
