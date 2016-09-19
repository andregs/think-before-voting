'use strict';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Question } from './question.model';
import { QuestionService } from '../question.service';

/**
 * This guard ensures the requested question is available before the route is activated,
 * or redirects the user to an error page when it cannot be found.
 */
@Injectable()
export class QuestionResolveService implements Resolve<Question> {

	constructor(
		private service: QuestionService,
		private router: Router
	) { }

	resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
		const key = route.params['key'];
		return this.service.get(key)
			.catch((error: Response) => {
				this.router.navigate(['/error', error.status], { skipLocationChange: true });
				return Observable.of(false);
			});
	}
}
