/*global mwimporter, Backbone*/

mwimporter.Collections = mwimporter.Collections || {};

(function () {
	'use strict';

	mwimporter.Collections.RecordsCollection = Backbone.Collection.extend({
		
		localStorage: new Backbone.LocalStorage('Records'),

		model: mwimporter.Models.RecordModel,
		
		url: '/records',
		
		initialize: function() {
			this.on('all', mwimporter.vent.setupTrigger('records'));
		}

	});

})();
