/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.StatusView = Backbone.View.extend({

		template: JST['app/scripts/templates/status.ejs'],
		
		initialize: function() {
			_.bindAll(this, "renderStartStatus", "renderFinishStatus");
			mwimporter.vent.on({
				'rules:request': this.renderStartStatus,
				'rules:sync': this.renderFinishStatus,
			});
	
		},
		renderStartStatus: function() {
			this.$el.text('sync started').removeClass().addClass('text-warning');
		},
		renderFinishStatus: function() {
			this.$el.text('sync finished').removeClass().addClass('text-success');
		},
	});

})();
