/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.RulestableView = Backbone.View.extend({

		template: JST['app/scripts/templates/rulestable.ejs'],
		rowTemplate: JST['app/scripts/templates/rulerow.ejs'],

		initialize: function() {
			_.bindAll(this, "renderRuleRow");
			mwimporter.vent.on({
				'rules:add': this.renderRuleRow,
				'rules:change': this.renderRuleRow,
			});
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
		renderRuleRow: function(rule) {
			var params = rule.toJSON();
			this.removeRuleRow(rule);
			this.$el.find('tbody').append(this.rowTemplate(params));
		},
		removeRuleRow: function(rule) {
			var id = (rule.id !== undefined ? rule.id : rule.cid);
			this.$el.find('input[value='+id+']').parents('tr').remove();
		},
		events: {
			"click .btnEditRule": "editRule",
			"click .btnDeleteRule": "deleteRule",
			"click .btnAddRule": "newRule",
			"click .btnLoadRules": "loadRules"
		},
		editRule: function(e) {
			var id = $(e.currentTarget).parents('tr').find('input.ruleid').val();
			var rule = this.collection.get(id);
			mwimporter.vent.trigger('rule:edit', rule);
		},
		newRule: function(e) {
			var rule = new mwimporter.Models.RuleModel({});
			console.log("Adding a rule, cid="+rule.cid);
			mwimporter.vent.trigger('rule:new', rule);
		},
		deleteRule: function(e) {
			var id = $(e.currentTarget).parents('tr').find('input.ruleid').val();
			var rule = this.collection.get(id);
			console.log("Deleting rule, cid="+rule.cid);
			rule.destroy();
			this.collection.remove(rule);
			this.removeRuleRow(rule);
		},
		loadRules: function() {
			this.collection.fetch({update: true});
		},
	});

})();
