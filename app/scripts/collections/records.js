/*global mwimporter, Backbone*/

mwimporter.Collections = mwimporter.Collections || {};

(function () {
	'use strict';

	mwimporter.Collections.RecordsCollection = Backbone.Collection.extend({
		
		localstorage: new Backbone.LocalStorage('Records'),

		model: mwimporter.Models.RecordModel,
		
		initialize: function() {
			// this.on('all', mwimporter.debug("mwimporter.Records"));
			this.on('all', mwimporter.vent.setupTrigger('records'));
		}

	});

})();
