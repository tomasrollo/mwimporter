/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.CategoryeditView = Backbone.View.extend({

		template: JST['app/scripts/templates/categoryedit.ejs'],

		initialize: function() {
		// render and initiate the edit record dialog from the template
		this.$el.append(this.template());
		$('#categoryEditDialog').modal({
			keyboard: true,
			show: false
		});
		this.record = null;
		_.bindAll(this, "show");
		mwimporter.vent.on({
			'category:new': this.show,
			'category:edit': this.show
		});
		},
		events: {
			"click .btnCategoryEditDialogSave": "saveCategory",
			"click .btnCategoryEditDialogCancel": "cancelCategoryEdit"
		},
		show: function(category) {
			this.category = category;
			console.log('started to edit category cid='+category.cid);
			// populate the dialog with category data
			$('#categoryEditDialog input.name').val(category.get("name"));
			//show the dialog
			$('#categoryEditDialog').modal('show');
		},
		cancelCategoryEdit: function(e) {
			this.category = null;
		},
		saveCategory: function(e) {
			console.log('Saving category cid='+this.category.cid);
			// populate the rule model back from the category edit dialog
			this.category.set({
				name: $('#categoryEditDialog input.name').val()
			});
			$('#categoryEditDialog').modal('hide');
			if (!this.collection.contains(this.category)) this.collection.add(this.category); // add the category into the collection if it's a new category
		 	this.category.save();
		// 	console.log('Saved model cid='+this.category.cid);
			this.category = null;
		}
	});

})();
