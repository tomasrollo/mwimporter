/*global mwimporter, Backbone*/

mwimporter.Models = mwimporter.Models || {};

(function () {
	'use strict';

	mwimporter.Models.CategoryModel = Backbone.Model.extend({

		url: '',

		initialize: function() {
			this.on('all', mwimporter.vent.setupTrigger('category'));
		},

		defaults: {
			name: ''
		},

		validate: function(attrs, options) {
		},

		parse: function(response, options)	{
			return response;
		},
		
		edit: function() {
			mwimporter.vent.trigger('category:edit', this);
		}
	});

})();
