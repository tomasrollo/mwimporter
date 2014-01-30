/*global mwimporter, Backbone*/

mwimporter.Models = mwimporter.Models || {};

(function () {
	'use strict';

	mwimporter.Models.CategoryModel = Backbone.Model.extend({

		url: '',

		initialize: function() {
			//this.on('all', mwimporter.debug("mwimporter.Category"));
		},

		defaults: {
			name: ''
		},

		validate: function(attrs, options) {
		},

		parse: function(response, options)	{
			return response;
		}
	});

})();
