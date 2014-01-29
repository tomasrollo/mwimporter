/*global mwimporter, Backbone*/

mwimporter.Models = mwimporter.Models || {};

(function () {
	'use strict';

	mwimporter.Models.RuleModel = Backbone.Model.extend({

		url: '',

		initialize: function() {
		},

		defaults: {
			accountNumber: '',
			accountName: '',
			vs: '',
			ks: '',
			ss: '',
			systemDesc: '',
			payerDesc: '',
			payeeDesc: '',
			avField1: '',
			category: '',
			payee: ''
		},

		validate: function(attrs, options) {
		},

		parse: function(response, options)	{
			return response;
		}
	});

})();
