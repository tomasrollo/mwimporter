/*global mwimporter, Backbone*/

mwimporter.Collections = mwimporter.Collections || {};

(function () {
	'use strict';

	mwimporter.Collections.RulesCollection = Backbone.Collection.extend({

		localstorage: new Backbone.LocalStorage('Rules'),
		
		model: mwimporter.Models.RuleModel,

		initialize: function() {
			// this.on('all', mwimporter.debug("mwimporter.Rules"));
			this.on('all', mwimporter.vent.setupTrigger('rules'));
		}
	});

})();
