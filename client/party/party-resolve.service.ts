'use strict';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Party } from './party.model';
import { PartyService } from './party.service';

/**
 * This guard ensures the requested party is available before the route is activated,
 * or redirects the user to an error page when the party cannot be found.
 */
@Injectable()
export class PartyResolveService implements Resolve<Party> {

	constructor(
		private service: PartyService,
		private router: Router
	) { }

	resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
		const key = route.params['key'];
		return this.service.find(key)
			.catch((error: Response) => {
				this.router.navigate(['/error', error.status], { skipLocationChange: true });
				return Observable.of(false);
			});
	}
}
