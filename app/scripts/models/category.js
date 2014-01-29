/*global mwimporter, Backbone*/

mwimporter.Models = mwimporter.Models || {};

(function () {
	'use strict';

	mwimporter.Models.CategoryModel = Backbone.Model.extend({

		url: '',
		// url: function() {
		//	 return this.collection.url + "/" + (this.id !== undefined ? this.id : '');
		// },

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
