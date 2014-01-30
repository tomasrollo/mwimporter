/*global mwimporter, Backbone*/

mwimporter.Collections = mwimporter.Collections || {};

(function () {
	'use strict';

	mwimporter.Collections.CategoriesCollection = Backbone.Collection.extend({
		
		localStorage: new Backbone.LocalStorage('Categories'),
		
		model: mwimporter.Models.CategoryModel,

    url: '/categories',
    
		initialize: function() {
			this.on('all', mwimporter.vent.setupTrigger('categories'));
		},
		
		comparator: function(category) {
			return category.get("name");
		}
	});

})();
