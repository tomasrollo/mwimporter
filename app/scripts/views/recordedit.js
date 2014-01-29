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
				'record:edit': this.show
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
			$('#recordEditDialog input.recordid').val(record.id !== undefined ? record.id : record.cid);
			$('#recordEditDialog input.account').val(record.get("account"));
			$('#recordEditDialog input.transfers').val(record.get("transfers"));
			$('#recordEditDialog input.desc').val(record.get("desc"));
			$('#recordEditDialog input.payee').val(record.get("payee"));
			$('#recordEditDialog input.category').val(record.get("category"));
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
				account: $('#recordEditDialog input.account').val(),
				transfers: $('#recordEditDialog input.transfers').val(),
				desc: $('#recordEditDialog input.desc').val(),
				payee: $('#recordEditDialog input.payee').val(),
				category: $('#recordEditDialog input.category').val(),
				date: $('#recordEditDialog input.date').val(),
				amount: $('#recordEditDialog input.amount').val(),
			});
			$('#recordEditDialog').modal('hide');
			this.collection.add(this.record); // this shall also trigger (re)render the row in the table
			// save the model to the server
			this.record.save();
			console.log('Saved record cid='+this.record.cid);
			this.record = null;
		}
	});

})();
