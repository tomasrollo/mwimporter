/*global mwimporter, Backbone*/

mwimporter.Collections = mwimporter.Collections || {};

(function () {
	'use strict';

	mwimporter.Collections.CategoriesCollection = Backbone.Collection.extend({
		
		localStorage: new Backbone.LocalStorage('Categories'),
		
		model: mwimporter.Models.CategoryModel,
		comparator: 'name',

		url: '/categories',
	
		initialize: function() {
			this.on('all', mwimporter.vent.setupTrigger('categories'));
		},
	});

})();
