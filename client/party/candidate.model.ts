'use strict';

import { autoserialize, autoserializeAs } from 'cerialize';

import { Location } from '../shared/location.model';

export type Office = 'Presidente'
	| 'Vice-Presidente'
	| 'Governador'
	| 'Vice-Governador'
	| 'Senador'
	| 'Deputado Federal'
	| 'Deputado Estadual'
	| 'Prefeito'
	| 'Vereador';

/**
 * Model class to represent a candidate of a party.
 */
export class Candidate {

	@autoserialize _key: string;
	@autoserialize office: Office;
	@autoserializeAs(Location) location: Location;

	constructor(office: Office, location: Location) {
		this.office = office;
		this.location = location;
	}

}
