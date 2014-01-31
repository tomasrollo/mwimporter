/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.CategoriestableView = Backbone.View.extend({

		template: JST['app/scripts/templates/categoriestable.ejs'],

		events: {
			"click .btnAddCategory": "newCategory",
		},
		
		initialize: function() {
			_.bindAll(this, "addCategory");
			mwimporter.vent.on({
				'categories:add': this.addCategory,
			});
			// render the table for the first time - it will not change after that
			this.$el.html(this.template());
		},
		render: function() {
			return this;
		},
		addCategory: function(category) {
			var rowView = new mwimporter.Views.CategoryrowView({model: category});
			this.$el.find('tbody').append(rowView.render().el);
		},
		newCategory: function() {
			var category = new mwimporter.Models.CategoryModel({});
			console.log("Adding a category, cid="+category.cid);
			mwimporter.vent.trigger('category:new', category);
		},
	});

	mwimporter.Views.CategoryrowView = Backbone.View.extend({
		
		template: JST['app/scripts/templates/categoryrow.ejs'],
		
		tagName: "tr",
		
		events: {
			"click .btnEditCategory": "editCategory",
			"click .btnDeleteCategory": "deleteCategory",
		},
		
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "destroy", this.remove);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		editCategory: function() {
			this.model.edit();
		},
		deleteCategory: function() {
			console.log("Deleting category, cid="+this.model.cid);
			this.model.destroy();
		},
	});

})();
