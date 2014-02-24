/*global mwimporter, $*/
window.mwimporter = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	progressBarEl: null,
	
	showPB: function() {
		if (!this.progressBarEl) return;
		this.progressBarEl.modal('show');
	},
	hidePB: function() {
		if (!this.progressBarEl) return;
		this.progressBarEl.modal('hide');
	},
	CZKformatter: null,
	formatCZK: function(amount) {
		if (!this.CZKformatter) throw "CZKformatter not initialized!";
		return this.CZKformatter.format(amount)+' CZK';
	},
	
	init: function () {
		'use strict';
		console.log('Hello from mwimporter!');
		
		this.CZKformatter = Intl.NumberFormat('cs-cz');
		
		// instantiate all the collections
		this.accounts = new this.Collections.AccountsCollection();
		this.rules = new this.Collections.RulesCollection();
		this.categories = new this.Collections.CategoriesCollection();
		this.records = new this.Collections.RecordsCollection();
		
		// instantiate all the views
		this.rulestableView = new this.Views.RulestableView({
			collection: this.rules,
			el: '#rulesPane'
		});
		this.categoriestableView = new this.Views.CategoriestableView({
			collection: this.categories,
			el: '#categoriesPane'
		});
		this.recordstableView = new this.Views.RecordstableView({
			collection: this.records,
			el: '#recordsPane'
		});
		this.ruleEditDialog = new this.Views.RuleeditView({
			collection: this.rules,
			el: 'body'
		});
		this.categoryEditDialog = new this.Views.CategoryeditView({
			collection: this.categories,
			el: 'body'
		});
		this.recordEditDialog = new this.Views.RecordeditView({
			collection: this.records,
			el: 'body'
		});
		this.fileControlView = new this.Views.FilecontrolView({
			el: '#filesPane'
		});
	
		// let's load all the collections
		this.accounts.fetch();
		this.categories.fetch();
		this.rules.fetch();
		this.records.fetch();
	
		// let's render all the relevant views for the first time
		this.rulestableView.render();
		this.categoriestableView.render();
		this.recordstableView.render();
		
		// and collapse by default - TODO resolve
		$('#categoriesPanel').collapse('hide');
		$('#categoriesPanel').collapse('hide');
		$('#rulesPanel').collapse('hide');
		$('#rulesPanel').collapse('hide');
		
		mwimporter.fileDetails = {};
		
		mwimporter.progressBarEl = $('#progressbarDialog');
		mwimporter.progressBarEl.modal({backdrop: 'static', keyboard: false, show: false});
	}
};

var DEBUG_VENT = true;
var DEBUG_RESULT = false;

window.mwimporter.debug = function(name) {
	return function() {
		if (DEBUG_VENT) console.log(name+' '+arguments[0], Array.prototype.slice.apply(arguments, [1]));
	};
};

window.mwimporter.vent = _.extend({}, Backbone.Events);
window.mwimporter.vent.on('all', window.mwimporter.debug("mwimporter.vent")); // log all events by default
window.mwimporter.vent.setupTrigger = function(name) {
	return function(eventName) {
		window.mwimporter.vent.trigger.apply(window.mwimporter.vent, _.flatten([name+':'+eventName, Array.prototype.slice.apply(arguments, [1])]));
	};
};

$(document).ready(function () {
	'use strict';
	mwimporter.init();
});
