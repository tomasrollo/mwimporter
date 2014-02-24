/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.RecordstableView = Backbone.View.extend({

		template: JST['app/scripts/templates/recordstable.ejs'],
		
		rowViews: [],

		events: {
			"click .btnAddRecord": "newRecord",
			"click .btnUpdateSelectedRecordsCategory": "updateSelectedRecordsCategory",
			"click .btnDeleteSelectedRecords": "deleteSelectedRecords",
			'click th input[type="checkbox"]': "toggleAllCheckboxes",
		},
		initialize: function() {
			_.bindAll(this, "addRecord", "emptyTable");
			mwimporter.vent.on({
				'records:add': this.addRecord,
				'records:reset': this.emptyTable,
				'categories:sync': this.refreshCategorySelect,
				'files:processed': this.updateRecordTableSummary,
			});
			// render the table for the first time - it will not change after that
			this.$el.html(this.template());
			$('#recordsTable th > input[type="text"]').each(function() {
				$(this).multifilter({
					target: $('#recordsTable'),
				});
			});
		},
		render: function() {
			return this;
		},
		addRecord: function(record) {
			var rowView = new mwimporter.Views.RecordrowView({model: record});
			this.rowViews.push(rowView);
			this.$el.find('tbody').append(rowView.render().el);
		},
		newRecord: function() {
			var record = new mwimporter.Models.RecordModel({});
			console.log("Adding a record, cid="+record.cid);
			mwimporter.vent.trigger('record:new', record);
		},
		emptyTable: function() {
			_(this.rowViews).each(function(rowView) { rowView.stopListening(); });
			this.rowViews.length = 0;
			this.$el.html(this.template());
		},
		toggleAllCheckboxes: function() {
			var status = this.$el.find('th input[type="checkbox"]').is(':checked');
			// console.log('toggling all record checkboxes, status is '+status);
			_(this.rowViews).each(function(rowView) {
				if (rowView.isVisible()) rowView.toggleCheckbox(status);
			});
		},
		deleteSelectedRecords: function() {
			_(this.rowViews).each(function(rowView) {
				rowView.deleteIfSelected();
			});
		},
		updateSelectedRecordsCategory: function() {
			var category = $('#recordCategorySelect2').val()
			_(this.rowViews).each(function(rowView) {
				rowView.updateCategoryIfSelected(category);
			});
		},
		refreshCategorySelect: function() {
			$('#recordCategorySelect2').empty();
			console.log('refreshing recordCategorySelect2');
			mwimporter.categories.each(function(category) {
				$('#recordCategorySelect2').append('<option value="'+category.id+'">'+category.get('name')+'</option>');
			});
		},
		updateRecordTableSummary: function(fileDetails) {
			console.log('running updateRecordTableSummary');
			if (fileDetails['Iri KB'] === undefined) throw "fileDetails['Iri KB'] is undefined!";
			if (fileDetails['Tomas KB'] === undefined) throw "fileDetails['Tomas KB'] is undefined!";
			var received = 0;
			var sent = 0;
			mwimporter.records.each(function(record) {
				var amount = parseFloat(record.get('amount').replace(',','.'));
				if (amount < 0) sent += amount;
				else received += amount;
			});

			console.log('received='+received);
			console.log('sent='+sent);
			
			var diffR = Math.abs(received) - Math.abs(parseFloat(fileDetails['Iri KB'].received.replace(',','.'))) - Math.abs(parseFloat(fileDetails['Tomas KB'].received.replace(',','.')));
			var diffS = Math.abs(sent) - Math.abs(parseFloat(fileDetails['Iri KB'].sent.replace(',','.'))) - Math.abs(parseFloat(fileDetails['Tomas KB'].sent.replace(',','.')));
			
			diffR = Math.round(diffR);
			diffS = Math.round(diffS);
			$('.recordsTableSummaryIncome').text(""+mwimporter.formatCZK(Math.round(received))+" difference: "+mwimporter.formatCZK(diffR));
			$('.recordsTableSummaryExpense').text(""+mwimporter.formatCZK(Math.round(sent))+" difference: "+mwimporter.formatCZK(diffS));
			$('.recordsTableSummaryIncome').removeClass().addClass(Math.abs(diffR) < 1 ? 'text-success' : 'text-error');
			$('.recordsTableSummaryExpense').removeClass().addClass(Math.abs(diffS) < 1 ? 'text-success' : 'text-error');
		},
	});

	mwimporter.Views.RecordrowView = Backbone.View.extend({
		
		template: JST['app/scripts/templates/recordrow.ejs'],
		
		tagName: "tr",
		$checkbox: null,
		
		events: {
			"click .btnEditRecord": "editRecord",
			"click .btnDeleteRecord": "deleteRecord",
		},
		
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "destroy", this.destroy);
			_.bindAll(this, "updateCategoryName", "updateTransfersName");
			mwimporter.vent.on({
				'category:change': this.updateCategoryName,
				'account:change': this.updateTransfersName,
			});
		},
		render: function() {
			var recordData = this.model.toJSON();
			recordData.transfers = mwimporter.accounts.get(recordData.transfers) === undefined ? "ERROR" : mwimporter.accounts.get(recordData.transfers).get('name');
			recordData.category = mwimporter.categories.get(recordData.category) === undefined ? "NOT ASSIGNED" : mwimporter.categories.get(recordData.category).get('name');
			this.$el.html(this.template(recordData));
			this.$checkbox = this.$el.find('input[type="checkbox"]');
			return this;
		},
		destroy: function() {
			// this.trigger(); // TODO - fix this to let the parent recordstableview know I'm being destroyed
			this.remove();
		},
		editRecord: function() {
			this.model.edit();
		},
		deleteRecord: function() {
			console.log("Deleting record, cid="+this.model.cid);
			this.model.destroy();
		},
		updateCategoryName: function(category) {
			if (this.model.get('category') == category.id) this.$el.find(".recordRowCategory").html(category.get('name'));
		},
		updateTransfersName: function(account) {
			if (this.model.get('account') == account.id) this.$el.find(".recordRowTransfers").html(account.get('name'));
		},
		toggleCheckbox: function(status) {
			// console.log("Toggling checkbox to "+status);
			if (status === undefined) throw "Error, status parameter is undefined";
			this.$checkbox.prop('checked', status);
		},
		deleteIfSelected: function() {
			if (this.$checkbox.is(':checked')) {
				this.deleteRecord();
			}
		},
		updateCategoryIfSelected: function(category) {
			if (category === undefined) throw "Error, category parameter is undefined";
			if (this.$checkbox.is(':checked')) {
				console.log('setting category to record id='+this.model.id+' to category id='+category);
				this.model.set('category', category);
				this.model.save();
			}
		},
		isVisible: function() {
			return this.$el.is(':visible');
		},
	});

})();
