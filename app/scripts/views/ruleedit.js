/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.RuleeditView = Backbone.View.extend({

		template: JST['app/scripts/templates/ruleedit.ejs'],

		initialize: function() {
			// render and initiate the edit rule dialog from the template
			this.$el.append(this.template());
			$('#ruleEditDialog').modal({
				keyboard: true,
				show: false
			});
			this.rule = null;
			_.bindAll(this, "show");
			mwimporter.vent.on({
				'rule:new': this.show,
				'rule:edit': this.show,
				'categories:sync': this.refreshCategorySelect,
			});
		},
		events: {
			"click .btnRuleEditDialogSave": "saveRule",
			"click .btnRuleEditDialogCancel": "cancelRuleEdit",
			"keypress #ruleEditDialog input": "createOnEnter",
		},
		show: function(rule) {
			this.rule = rule;
			console.log('started to edit model cid='+rule.cid);
			// populate the dialog with rule data
			$('#ruleEditDialog input.payee_account').val(rule.get("payee_account"));
			$('#ruleEditDialog input.payee_account_name').val(rule.get("payee_account_name"));
			$('#ruleEditDialog input.vs').val(rule.get("vs"));
			$('#ruleEditDialog input.ks').val(rule.get("ks"));
			$('#ruleEditDialog input.ss').val(rule.get("ss"));
			$('#ruleEditDialog input.desc_system').val(rule.get("desc_system"));
			$('#ruleEditDialog input.desc_payer').val(rule.get("desc_payer"));
			$('#ruleEditDialog input.desc_payee').val(rule.get("desc_payee"));
			$('#ruleEditDialog input.av').val(rule.get("av"));
			$('#ruleCategorySelect').val(rule.get("category"));
			$('#ruleEditDialog input.payee').val(rule.get("payee"));
			//show the dialog
			$('#ruleEditDialog').modal('show');
		},
		cancelRuleEdit: function(e) {
			this.rule = null;
		},
		saveRule: function(e) {
			console.log('Saving model cid='+this.rule.cid);
			// populate the rule model back from the rule edit dialog
			this.rule.set({
				payee_account: $('#ruleEditDialog input.payee_account').val(),
				payee_account_name: $('#ruleEditDialog input.payee_account_name').val(),
				vs: $('#ruleEditDialog input.vs').val(),
				ks: $('#ruleEditDialog input.ks').val(),
				ss: $('#ruleEditDialog input.ss').val(),
				desc_system: $('#ruleEditDialog input.desc_system').val(),
				desc_payer: $('#ruleEditDialog input.desc_payer').val(),
				desc_payee: $('#ruleEditDialog input.desc_payee').val(),
				av: $('#ruleEditDialog input.av').val(),
				category: $('#ruleCategorySelect').val(),
				payee: $('#ruleEditDialog input.payee').val()
			});
			$('#ruleEditDialog').modal('hide');
			if (!this.collection.contains(this.rule)) this.collection.add(this.rule); // add the rule into the collection if it's a new rule
			this.rule.save();
		// 	console.log('Saved model cid='+this.rule.cid);
			this.rule = null;
		},
		refreshCategorySelect: function() {
			$('#ruleCategorySelect').empty();
			mwimporter.categories.each(function(category) {
				$('#ruleCategorySelect').append('<option value="'+category.id+'">'+category.get('name')+'</option>');
			});
		},
		createOnEnter: function(e) {
			if (e.keyCode != 13) return; // only react to ENTER
			this.saveRule();
		},
	});

})();
