/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.RecordeditView = Backbone.View.extend({

		template: JST['app/scripts/templates/recordedit.ejs'],

		initialize: function() {
			// render and initiate the edit record dialog from the template
			this.$el.append(this.template());
			$('#recordEditDialog').modal({
				keyboard: true,
				show: false
			});
			this.record = null;
			_.bindAll(this, "show");
			mwimporter.vent.on({
				'record:new': this.show,
				'record:edit': this.show,
				'categories:sync': this.refreshCategorySelect,
				'accounts:sync': this.refreshTransfersSelect,
			});
		},
		events: {
			"click .btnRecordEditDialogSave": "saveRecord",
			"click .btnRecordEditDialogCancel": "cancelRecordEdit"
		},
		show: function(record) {
			this.record = record;
			console.log('started to edit record cid='+record.cid);
			// populate the dialog with record data
			$('#recordTransfersSelect').val(record.get("transfers"));
			$('#recordEditDialog input.desc').val(record.get("desc"));
			$('#recordEditDialog input.payee').val(record.get("payee"));
			$('#recordCategorySelect').val(record.get("category"));
			$('#recordEditDialog input.date').val(record.get("date"));
			$('#recordEditDialog input.amount').val(record.get("amount"));
			//show the dialog
			$('#recordEditDialog').modal('show');
		},
		cancelRecordEdit: function(e) {
			this.record = null;
		},
		saveRecord: function(e) {
			console.log('Saving record cid='+this.record.cid);
			// populate the rule model back from the record edit dialog
			this.record.set({
				transfers: $('#recordTransfersSelect').val(),
				desc: $('#recordEditDialog input.desc').val(),
				payee: $('#recordEditDialog input.payee').val(),
				category: $('#recordCategorySelect').val(),
				date: $('#recordEditDialog input.date').val(),
				amount: $('#recordEditDialog input.amount').val(),
			});
			$('#recordEditDialog').modal('hide');
			if (!this.collection.contains(this.record)) this.collection.add(this.record); // add the record into the collection if it's a new record
		 	this.record.save();
		// 	console.log('Saved model cid='+this.record.cid);
			this.record = null;
		},
		refreshCategorySelect: function() {
			$('#recordCategorySelect').empty();
			mwimporter.categories.each(function(category) {
				$('#recordCategorySelect').append('<option value="'+category.id+'">'+category.get('name')+'</option>');
			});
		},
		refreshTransfersSelect: function() {
			$('#recordTransfersSelect').empty();
			mwimporter.accounts.each(function(account) {
				$('#recordTransfersSelect').append('<option value="'+account.id+'">'+account.get('name')+'</option>');
			});
		},
	});

})();
