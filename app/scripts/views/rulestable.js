/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.RulestableView = Backbone.View.extend({

		template: JST['app/scripts/templates/rulestable.ejs'],

		events: {
			"click .btnAddRule": "newRule",
		},
		
		initialize: function() {
			_.bindAll(this, "addRule");
			mwimporter.vent.on({
				'rules:add': this.addRule,
			});
			// render the table for the first time - it will not change after that
			this.$el.html(this.template());
		},
		render: function() {
			return this;
		},
		addRule: function(rule) {
			var rowView = new mwimporter.Views.RulerowView({model: rule});
			this.$el.find('tbody').append(rowView.render().el);
		},
		newRule: function() {
			var rule = new mwimporter.Models.RuleModel({});
			console.log("Adding a rule, cid="+rule.cid);
			mwimporter.vent.trigger('rule:new', rule);
		},
	});
	
	mwimporter.Views.RulerowView = Backbone.View.extend({
		
		template: JST['app/scripts/templates/rulerow.ejs'],
		
		tagName: "tr",
		
		events: {
			"click .btnEditRule": "editRule",
			"click .btnDeleteRule": "deleteRule",
		},
		
		initialize: function() {
		// 	mwimporter.vent.on({
		// 		'rules:add': this.addRule,
		// 	});
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "destroy", this.remove);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		editRule: function() {
			this.model.edit();
		},
		deleteRule: function() {
			console.log("Deleting rule, cid="+this.model.cid);
			this.model.destroy();
		// 	this.collection.remove(rule);
		},
	});

})();
