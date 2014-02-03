/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

(function () {
	'use strict';

	mwimporter.Views.FilecontrolView = Backbone.View.extend({

		template: JST['app/scripts/templates/filecontrol.ejs'],

		initialize: function() {
		},
		events: {
			"click .btnLoadIriFile": "loadIriFile",
			"click .btnLoadTomasFile": "loadTomasFile",
			"click .btnProcessFiles": "processFiles",
			"click .btnApplyRules": "applyRules",
			"click .btnDownloadResultFile": "downloadResultFile",
			"click .btnClearRecords": "clearRecords",
		},
		parseCSV: function(data) {
			var headers = [
				"Datum splatnosti",
				"Datum odepsani z jine banky",
				"Protiucet a kod banky",
				"Nazev protiuctu",
				"Castka",
				"VS",
				"KS",
				"SS",
				"Identifikace transakce",
				"Systemovy popis",
				"Popis prikazce",
				"Popis pro prijemce",
				"AV pole 1",
				"AV pole 2",
				"AV pole 3",
				"AV pole 4"
			];
			var transactions = [];
			var rows = data.split('\r\n');
			if (rows[0] != "MojeBanka, export transakcni historie;") throw "wrong file format";
			console.log(rows.slice(0,5));
			_.map(rows.slice(17), function(row) {
				var fields = row.split(';').slice(0,-1);
				console.log(fields);
				if (headers.length != fields.length) throw "headers.length != fields.length: "+headers.length+" != "+fields.length;
				transactions.push(_.object(headers, fields));
			});
			if (transactions.length > 0) console.log(transactions);
			return transactions;
		},
		loadIriFile: function() {
			var statusEl = this.$el.find(".iriFileStatus");
			var csvPath = this.$el.find("#iricsvurl").first().val();
			console.log("Loading file "+csvPath);
			statusEl.text('Loading file '+csvPath).removeClass().addClass('text-info');
			var self = this;
			$.get(csvPath).done(function(data) {
				try {
					mwimporter.iriTransactions = self.parseCSV(data);
					statusEl.text('Success!').removeClass().addClass('text-success');
				} catch(err) {
					console.error(err);
					statusEl.text('Error parsing file: '+err).removeClass().addClass('text-error');
				}
			}).fail(function(err) {
				console.error("$.get failed: "+err.toString());
				statusEl.text('Error getting file: '+err.toString()).removeClass().addClass('text-error');
			});
		},
		loadTomasFile: function() {
			var statusEl = this.$el.find(".tomasFileStatus");
			var csvPath = this.$el.find("#tomascsvurl").first().val();
			console.log("Loading file "+csvPath);
			statusEl.text('Loading file '+csvPath).removeClass().addClass('text-info');
			var self = this;
			$.get(csvPath).done(function(data) {
				try {
					mwimporter.tomasTransactions = self.parseCSV(data);
					statusEl.text('Success!').removeClass().addClass('text-success');
				} catch(err) {
					console.error(err);
					statusEl.text('Error parsing file: '+err).removeClass().addClass('text-error');
				}
			}).fail(function(err) {
				console.error("$.get failed: "+err.toString());
				statusEl.text('Error getting file: '+err.toString()).removeClass().addClass('text-error');
			});
		},
		processFiles: function() {},
		applyRules: function() {},
		downloadResultFile: function() {},
		clearRecords: function() {},
	});

})();
