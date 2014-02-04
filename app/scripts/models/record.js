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
			date: '',
			account: '',
			transfers: '',
			// desc start
			desc: '',
			payee_account: '',
			payee_account_name: '',
			vs: '',
			ks: '',
			ss: '',
			desc_system: '',
			desc_payer: '',
			desc_payee: '',
			av: '',
			// desc end
			payee: '',
			category: '',
			amount: '',
		},

		validate: function(attrs, options) {
		},

		parse: function(response, options)	{
			return response;
		},
		
		edit: function() {
			mwimporter.vent.trigger('record:edit', this);
		}
	});

})();
