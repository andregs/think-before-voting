'use strict';

import { autoserialize } from 'cerialize';

/**
 * Model class to represent a location of the world.
 */
export class Location {

	@autoserialize _key: string;
	@autoserialize _rev: string;
	@autoserialize name: string;

	constructor(_key: string) {
		this._key = _key;
	}

	toString() {
		return this.name;
	}

}
