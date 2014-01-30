/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.RuleeditView = Backbone.View.extend({

		template: JST['app/scripts/templates/ruleedit.ejs'],

		initialize: function() {
			// render and initiate the edit rule dialog from the template
			this.$el.append(this.template()); // TODO: populate this with list of categories in the future and make it a dropdown box
			$('#ruleEditDialog').modal({
				keyboard: true,
				show: false
			});
			this.rule = null;
			_.bindAll(this, "show");
			mwimporter.vent.on({
				'rule:new': this.show,
				'rule:edit': this.show
			});
		},
		events: {
			"click .btnRuleEditDialogSave": "saveRule",
			"click .btnRuleEditDialogCancel": "cancelRuleEdit"
		},
		show: function(rule) {
			this.rule = rule;
			console.log('started to edit model cid='+rule.cid);
			// populate the dialog with rule data
			$('#ruleEditDialog input.accountNumber').val(rule.get("accountNumber"));
			$('#ruleEditDialog input.accountName').val(rule.get("accountName"));
			$('#ruleEditDialog input.vs').val(rule.get("vs"));
			$('#ruleEditDialog input.ks').val(rule.get("ks"));
			$('#ruleEditDialog input.ss').val(rule.get("ss"));
			$('#ruleEditDialog input.systemDesc').val(rule.get("systemDesc"));
			$('#ruleEditDialog input.payerDesc').val(rule.get("payerDesc"));
			$('#ruleEditDialog input.payeeDesc').val(rule.get("payeeDesc"));
			$('#ruleEditDialog input.avField1').val(rule.get("avField1"));
			$('#ruleEditDialog input.category').val(rule.get("category"));
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
				accountNumber: $('#ruleEditDialog input.accountNumber').val(),
				accountName: $('#ruleEditDialog input.accountName').val(),
				vs: $('#ruleEditDialog input.vs').val(),
				ks: $('#ruleEditDialog input.ks').val(),
				ss: $('#ruleEditDialog input.ss').val(),
				systemDesc: $('#ruleEditDialog input.systemDesc').val(),
				payerDesc: $('#ruleEditDialog input.payerDesc').val(),
				payeeDesc: $('#ruleEditDialog input.payeeDesc').val(),
				avField1: $('#ruleEditDialog input.avField1').val(),
				category: $('#ruleEditDialog input.category').val(),
				payee: $('#ruleEditDialog input.payee').val()
			});
			$('#ruleEditDialog').modal('hide');
			if (!this.collection.contains(this.rule)) this.collection.add(this.rule); // add the rule into the collection if it's a new rule
		 	this.rule.save();
		// 	console.log('Saved model cid='+this.rule.cid);
			this.rule = null;
		}
	});

})();
