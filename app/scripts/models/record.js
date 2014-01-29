/*global mwimporter, Backbone*/

mwimporter.Models = mwimporter.Models || {};

(function () {
	'use strict';

	mwimporter.Models.RecordModel = Backbone.Model.extend({

		url: '',

		initialize: function() {
		},

		defaults: {
			account: '',
			transfers: '',
			desc: '',
			payee: '',
			category: '',
			date: '',
			amount: ''
		},

		validate: function(attrs, options) {
		},

		parse: function(response, options)	{
			return response;
		}
	});

})();
