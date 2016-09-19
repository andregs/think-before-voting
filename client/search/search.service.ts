'use strict';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize } from 'cerialize';
import { AuthHttp, } from 'angular2-jwt';

import { SearchResults } from './search-results.model';

const API_URL = 'api/search';

/**
 * This service provides the search feature.
 */
@Injectable()
export class SearchService {

	constructor(
		private http: AuthHttp
	) { }

	/**
	 * Searches for users, parties and questions that matches the `query` parameter.
	 */
	search(query: string): Observable<SearchResults> {
		return this.http.get(`${API_URL}/${query}`)
			.map((res: Response) => {
				const json = res.json();
				const results = Deserialize(json, SearchResults);
				return results;
			});
	};

}
