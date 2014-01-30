/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.RecordstableView = Backbone.View.extend({

		template: JST['app/scripts/templates/recordstable.ejs'],
		rowTemplate: JST['app/scripts/templates/recordrow.ejs'],

		initialize: function() {
			_.bindAll(this, "renderRecordRow");
			mwimporter.vent.on({
				'records:add': this.renderRecordRow,
				'records:change': this.renderRecordRow,
			});
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
		renderRecordRow: function(record) {
			var params = record.toJSON();
			this.removeRecordRow(record);
			this.$el.find('tbody').append(this.rowTemplate(params));
		},
		removeRecordRow: function(record) {
			var id = (record.id !== undefined ? record.id : record.cid);
			this.$el.find('input[value='+id+']').parents('tr').remove();
		},
		events: {
			"click .btnEditRecord": "editRecord",
			"click .btnDeleteRecord": "deleteRecord",
			"click .btnLoadRecords": "loadRecords"
		},
		editRecord: function(e) {
			var id = $(e.currentTarget).parents('tr').find('input.recordid').val();
			var record = this.collection.get(id);
			mwimporter.vent.trigger('record:edit', record);
		},
		deleteRecord: function(e) {
			var id = $(e.currentTarget).parents('tr').find('input.recordid').val();
			var record = this.collection.get(id);
			console.log("Deleting record, cid="+record.cid);
			record.destroy();
			this.collection.remove(record);
			this.removeRecordRow(record);
		},
		loadRecords: function() {
			this.collection.fetch({update: true});
		},
	});

})();
