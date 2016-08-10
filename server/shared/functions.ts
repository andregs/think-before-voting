'use strict';

import { Response } from 'express';

export function sendError(error, response: Response) {
	let {code, errorNum, message, name} = error;
	response
		.status(code)
		.json({ errorNum, message, name });
}
