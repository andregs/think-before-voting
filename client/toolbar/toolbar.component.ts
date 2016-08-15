'use strict';

import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'tbv-toolbar',
	templateUrl: 'client/toolbar/toolbar.component.html',
	styleUrls: ['client/toolbar/toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {

	opened = false;

	@Output()
	toggleNav = new EventEmitter<boolean>();

	constructor() {}

	ngOnInit() {}

	toggle() {
		this.opened = !this.opened;
		this.toggleNav.emit(this.opened);
	}

}
