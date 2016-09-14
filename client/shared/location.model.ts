'use strict';

import { autoserialize } from 'cerialize';

/**
 * Model class to represent a location of the world.
 */
export class Location {

	@autoserialize _key: string;
	@autoserialize _rev: string;
	@autoserialize name: string;

	get _id(): string {
		return this._key ? `location/${this._key}` : undefined;
	}

	toString() {
		return this.name;
	}

}
