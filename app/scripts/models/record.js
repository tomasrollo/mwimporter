/*global mwimporter, Backbone*/

mwimporter.Models = mwimporter.Models || {};

(function () {
	'use strict';

	mwimporter.Models.RecordModel = Backbone.Model.extend({

		url: '',

		initialize: function() {
			this.on('all', mwimporter.vent.setupTrigger('record'));
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
