'use strict';

import {NgModule} from '@angular/core';
import {MdButtonModule} from '@angular2-material/button/button';
import {MdRadioModule} from '@angular2-material/radio/radio';
import {MdSidenavModule} from '@angular2-material/sidenav/sidenav';
import {MdListModule} from '@angular2-material/list/list';
import {MdGridListModule} from '@angular2-material/grid-list/grid-list';
import {MdCardModule} from '@angular2-material/card/card';
import {MdIconModule} from '@angular2-material/icon/icon';
import {MdProgressBarModule} from '@angular2-material/progress-bar/progress-bar';
import {MdInputModule} from '@angular2-material/input/input';
import {MdTabsModule} from '@angular2-material/tabs/tabs';
import {MdToolbarModule} from '@angular2-material/toolbar/toolbar';
import {MdTooltipModule} from '@angular2-material/tooltip/tooltip';
import {MdRippleModule} from '@angular2-material/core/ripple/ripple';
import {PortalModule} from '@angular2-material/core/portal/portal-directives';
import {OverlayModule} from '@angular2-material/core/overlay/overlay-directives';
import {MdMenuModule} from '@angular2-material/menu/menu';
import {RtlModule} from '@angular2-material/core/rtl/dir';
import {MdLiveAnnouncer} from '@angular2-material/core/a11y/live-announcer';

// this module is necessary only because it's not yet available in npm.

const MATERIAL_MODULES = [
	MdButtonModule,
	MdCardModule,
	MdGridListModule,
	MdIconModule,
	MdInputModule,
	MdListModule,
	MdMenuModule,
	MdProgressBarModule,
	MdRadioModule,
	MdRippleModule,
	MdSidenavModule,
	MdTabsModule,
	MdToolbarModule,
	MdTooltipModule,
	OverlayModule,
	PortalModule,
	RtlModule,
];

@NgModule({
	imports: MATERIAL_MODULES,
	exports: MATERIAL_MODULES,
	providers: [MdLiveAnnouncer]
})
export class MaterialModule { }