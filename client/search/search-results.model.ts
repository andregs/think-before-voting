'use strict';

import { deserializeAs } from 'cerialize';

import { User } from '../shared/auth/user.model';
import { Party } from '../party/party.model';
import { Question } from '../qa/ask/question.model';

export class SearchResults {

	@deserializeAs(User) users: User[];
	@deserializeAs(Party) parties: Party[];
	@deserializeAs(Question) questions: Question[];

}
