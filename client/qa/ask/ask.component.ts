'use strict';

import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { QuestionService } from '../question.service';
import { Question } from './question.model';

/** This component manages the ask question page. */
@Component({
	selector: 'tbv-ask',
	templateUrl: 'client/qa/ask/ask.component.html',
	// styleUrls: ['client/qa/ask/ask.component.css'],
})
export class AskComponent implements OnInit {

	question: Question;

	constructor(
		private questionService: QuestionService,
		private translate: TranslateService,
		private router: Router,
		private route: ActivatedRoute,
	) { }

	/**
	 * Loads the model from the resolve guard or creates a new one.
	 * @see {@link QuestionResolveService}
	 */
	ngOnInit() {
		this.route.data.forEach((data: { model: Question }) => {
			this.question = data.model || new Question();
		});
	}

	/** Gets the question title or a default message. */
	getTitle(): string {
		return this.question.title || this.translate.instant('QUESTION.NEW');
	}

	/** Toggles visibility of the error message for the given field. */
	showError(field: NgModel) {
		return field.valid ? "hidden" : "inherit";
	}

	/** Form event handler. */
	onSubmit(): void {
		this.questionService.save(this.question).subscribe(
			question => this.router.navigate(['/qa/answer', question._key]),
			this.redirectOnError.bind(this)
		);
	}

	private redirectOnError(error: { status: any }) {
		this.router.navigate(['/error', error.status], { skipLocationChange: true });
	}

}
