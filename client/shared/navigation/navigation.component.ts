'use strict';

import { Component, ViewChild, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { MdSidenav } from '@angular2-material/sidenav';
import { NavItemComponent } from './nav-item.component';

@Component({
	selector: 'tbv-navigation',
	templateUrl: 'client/shared/navigation/navigation.component.html',
	styleUrls: ['client/shared/navigation/navigation.component.css'],
})
export class NavigationComponent implements AfterContentInit {

	@ViewChild('sidenav') sidenav: MdSidenav;
	@ContentChildren(NavItemComponent) items: QueryList<NavItemComponent>;

	ngAfterContentInit() {
		this.items.forEach(navItem =>
			navItem.navigate.subscribe(() => this.sidenav.close())
		);
	}

	toggle() {
		this.sidenav.toggle();
	}

}
