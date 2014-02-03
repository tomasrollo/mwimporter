/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.RecordstableView = Backbone.View.extend({

		template: JST['app/scripts/templates/recordstable.ejs'],

		events: {
			"click .btnAddRecord": "newRecord",
		},
		initialize: function() {
			_.bindAll(this, "addRecord");
			mwimporter.vent.on({
				'records:add': this.addRecord,
			});
			// render the table for the first time - it will not change after that
			this.$el.html(this.template());
		},
		render: function() {
			return this;
		},
		addRecord: function(record) {
			var rowView = new mwimporter.Views.RecordrowView({model: record});
			this.$el.find('tbody').append(rowView.render().el);
		},
		newRecord: function() {
			var record = new mwimporter.Models.RecordModel({});
			console.log("Adding a record, cid="+record.cid);
			mwimporter.vent.trigger('record:new', record);
		},
	});

	mwimporter.Views.RecordrowView = Backbone.View.extend({
		
		template: JST['app/scripts/templates/recordrow.ejs'],
		
		tagName: "tr",
		
		events: {
			"click .btnEditRecord": "editRecord",
			"click .btnDeleteRecord": "deleteRecord",
		},
		
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "destroy", this.remove);
			_.bindAll(this, "updateCategoryName");
			mwimporter.vent.on({
				'category:change': this.updateCategoryName,
				'account:change': this.updateTransfersName,
			});
		},
		render: function() {
			var recordData = this.model.toJSON();
			recordData.transfers = mwimporter.accounts.get(recordData.transfers) === undefined ? "ERROR" : mwimporter.accounts.get(recordData.transfers).get('name');
			recordData.category = mwimporter.categories.get(recordData.category) === undefined ? "ERROR" : mwimporter.categories.get(recordData.category).get('name');
			this.$el.html(this.template(recordData));
			return this;
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
	});

})();
