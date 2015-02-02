'use strict';

// Configuring the Articles module
angular.module('cotises').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cotises', 'cotises', 'dropdown', '/cotises(/create)?');
		Menus.addSubMenuItem('topbar', 'cotises', 'List Cotises', 'cotises');
		Menus.addSubMenuItem('topbar', 'cotises', 'New Cotise', 'cotises/create');
	}
]);