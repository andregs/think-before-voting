'use strict';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate/ng2-translate';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/partition';
import 'rxjs/add/operator/retry';

import { SearchResults } from './search-results.model';
import { SearchService } from './search.service';

/** This component controls the search page. */
@Component({
	selector: 'tbv-search',
	templateUrl: 'client/search/search.component.html',
})
export class SearchComponent implements OnInit {

	searchForm: FormGroup;
	query: string;
	results: SearchResults;

	constructor(
		private searchService: SearchService,
		private fb: FormBuilder,
		private router: Router,
	) { }

	/**
	 * Configs the search form and registers a handler to watch the search field.
	 */
	ngOnInit() {
		this.searchForm = this.fb.group({
			'query': [this.query, Validators.compose([
				Validators.required,
				Validators.minLength(2),
			])]
		});
		this.watchQuery();
	}

	/** Provides autocomplete functionality for the 'query' field. */
	private watchQuery() {
		const [valid, invalid] = this.searchForm.get('query').valueChanges
			.partition(value => value && value.length > 1);

		valid.debounceTime(400).distinctUntilChanged()
			.flatMap(value => this.searchService.search(value))
			.retry()
			.subscribe(
				results => this.results = results,
				this.redirectOnError.bind(this)
			);

		invalid.subscribe(
				value => this.results = null,
				this.redirectOnError.bind(this)
		);
	}

	hasResults(): boolean {
		const r = this.results;
		return r && (r.users.length + r.parties.length + r.questions.length) > 0;
	}

	private redirectOnError(error: { status: any }) {
		this.router.navigate(['/error', error.status], { skipLocationChange: true });
	}


}
