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
			}
		},
		isVisible: function() {
			return this.$el.is(':visible');
		},
	});

})();
