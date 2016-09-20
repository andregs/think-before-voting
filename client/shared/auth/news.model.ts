'use strict';

import { deserialize, deserializeAs } from 'cerialize';

export class News {

	// https://github.com/weichx/cerialize/issues/22
	@deserialize who: {_key: string, name: string};

	@deserialize action: 'ANSWERED' | 'FOLLOWED';
	@deserialize questions: number;
	@deserializeAs(Date) when: Date;

}
