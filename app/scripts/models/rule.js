/*global mwimporter, Backbone*/

mwimporter.Models = mwimporter.Models || {};

(function () {
	'use strict';

	mwimporter.Models.RuleModel = Backbone.Model.extend({

		url: '',
		// comparator: 'priority',
	
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

		initialize: function() {
			// this.on('all', mwimporter.debug("rule"));
			this.on('all', mwimporter.vent.setupTrigger('rule'));
			_.bindAll(this, "removeCategory");
			mwimporter.vent.on({
				'category:remove': this.removeCategory,
			});
		},

		validate: function(attrs, options) {
		},

		parse: function(response, options)	{
			return response;
		},
		edit: function() {
			mwimporter.vent.trigger('rule:edit', this);
		},
		removeCategory: function(category) {
			if (this.get('category') == category.id) this.set('category', '');
		}
	});

})();
