/*global mwimporter, Backbone*/

mwimporter.Collections = mwimporter.Collections || {};

(function () {
    'use strict';

    mwimporter.Collections.AccountsCollection = Backbone.Collection.extend({

		localStorage: new Backbone.LocalStorage('Accounts'),
		
        model: mwimporter.Models.AccountModel,
        comparator: 'name',
        
		url: '/accounts',
		
		initialize: function() {
			this.on('all', mwimporter.vent.setupTrigger('accounts'));
		},
    });

})();
