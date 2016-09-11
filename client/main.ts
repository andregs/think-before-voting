'use strict';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { createAppModule } from './app.module';

export function main(config: any) {
	platformBrowserDynamic().bootstrapModule(createAppModule(config));
}
