'use strict';

import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { AuthHttp } from 'angular2-jwt';
import { Deserialize } from 'cerialize';

import { Location } from './location.model';

const API_URL = 'api/location';

/**
 * This service manages locations of the world.
 */
@Injectable()
export class LocationService {

	constructor(private http: AuthHttp) { }

	/**
	 * Searches for locations that matches the given parameters.
	 * 
	 * Level 0 = country, 1 = state, 2 = city.
	 */
	public search(level: 0 | 1 | 2, query: string): Observable<Location[]> {
		return this.http.get(`${API_URL}?lvl=${level}&qry=${query}`)
			.map((res: Response) => {
				const json = res.json();
				const locations: Location[] = Deserialize(json, Location);
				return locations;
			});
	};

}
