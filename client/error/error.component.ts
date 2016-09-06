'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This component displays an error page.
 * It depends on an error code passed via URL like '/error/404'
 */
@Component({
	selector: 'tbv-error',
	templateUrl: 'client/error/error.component.html',
})
export class ErrorComponent implements OnInit {

	code: number;

	constructor(
		private route: ActivatedRoute
	) { }

	/** Chooses which error will be shown. Default is 500. */
	ngOnInit() {
		this.route.params.subscribe(
			params => {
				const errorCode = params['code'] || '404';
				this.code = ['401', '404'].includes(errorCode) ? errorCode : 500;
			},
			error => console.error(`This shouldn't happen`, error)
		);
	}

}
