'use strict';

import { autoserialize, autoserializeAs } from 'cerialize';
import _ from 'lodash';

import { Question } from '../ask/question.model';

/** Model class to represent an answer to a question. */
export class Answer {

	@autoserialize _key: string;
	@autoserialize _rev: string;
	@autoserializeAs(Question) question: Question;
	@autoserialize chosen: 0 | 1;
	@autoserialize opinion: string;

	/** Callback after the object is serialized. */
	public static OnSerialized(instance: Answer, json: any) {
		json.question = _.pick(instance.question, '_key', '_rev');
	}

}
