'use strict';

(function iife(/*global*/) {
	// map tells the System loader where to look for things
	var map = {
		'app':								'client/app.js',
		'@angular':						'node_modules/@angular',
		'@angular2-material':	'node_modules/@angular2-material',
		'ng2-material':				'node_modules/ng2-material',
		'cerialize':					'node_modules/cerialize/dist/serialize.js',
		"angular2-jwt":				"node_modules/angular2-jwt/angular2-jwt.js",
		'lodash':							'node_modules/lodash',
		'rxjs':								'node_modules/rxjs',
		'ng2-translate':			'node_modules/ng2-translate',
	};
	// packages tells the System loader how to load when no filename and/or no extension
	var packages = {
		'lodash': { main: 'index.js' },
		'rxjs': { main: 'bundles/Rx.min.js', defaultExtension: 'js' },
		'ng2-translate': { main: 'bundles/ng2-translate.js', defaultExtension: 'js' },
	};
	var ngPackageNames = [
		'common',
		'compiler',
		'core',
		'forms',
		'http',
		'platform-browser',
		'platform-browser-dynamic',
		'router',
		'upgrade'
	];
	// Add package entries for angular packages
	ngPackageNames.forEach(function (pkgName) {
		packages['@angular/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
	});
	var materialPkgs = [
		'core',
		'button',
		'button-toggle',
		'card',
		'checkbox',
		'grid-list',
		'icon',
		'input',
		'list',
		'menu',
		'progress-bar',
		'progress-circle',
		'radio',
		'sidenav',
		'slide-toggle',
		'slider',
		'tabs',
		'toolbar',
		'tooltip',
	];
	materialPkgs.forEach(function (pkg) {
		packages['@angular2-material/' + pkg] = { format: 'cjs', main: '/' + pkg + '.umd.js' };
	});
	var paths = {
	};
	var config = {
		map: map,
		packages: packages,
		paths: paths
	};
	System.config(config);
})(this);
