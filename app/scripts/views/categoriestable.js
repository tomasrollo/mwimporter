/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.CategoriestableView = Backbone.View.extend({

		template: JST['app/scripts/templates/categoriestable.ejs'],
		rowTemplate: JST['app/scripts/templates/categoryrow.ejs'],

		initialize: function() {
			_.bindAll(this, "renderCategoryRow");
			mwimporter.vent.on({
			'categories:add': this.renderCategoryRow,
			'categories:change': this.renderCategoryRow,
			});
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
		renderCategoryRow: function(category) {
			console.log("rendering category row for category id="+(category.id !== undefined ? category.id : category.cid));
			var params = category.toJSON();
			this.removeCategoryRow(category);
			this.$el.find('tbody').append(this.rowTemplate(params));
		},
		removeCategoryRow: function(category) {
			var id = (category.id !== undefined ? category.id : category.cid);
			this.$el.find('input[value='+id+']').parents('tr').remove();
		},
		events: {
			"click .btnEditCategory": "editCategory",
			"click .btnDeleteCategory": "deleteCategory",
			"click .btnLoadCategories": "loadCategories"
		},
		editCategory: function(e) {
			var id = $(e.currentTarget).parents('tr').find('input.categoryid').val();
			var category = this.collection.get(id);
			mwimporter.vent.trigger('category:edit', category);
		},
		deleteCategory: function(e) {
			var id = $(e.currentTarget).parents('tr').find('input.categoryid').val();
			var category = this.collection.get(id);
			console.log("Deleting category, cid="+category.cid);
			category.destroy();
			this.collection.remove(category);
			this.removeCategoryRow(category);
		},
		loadCategories: function() {
			this.collection.fetch({update: true});
		},
	});

})();
