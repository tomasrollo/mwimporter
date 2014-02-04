/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

DATUM_SPLATNOSTI = "Datum splatnosti";
DATUM_ODEPSANI = "Datum odepsání z jiné banky";
PROTIUCET_CISLO = "Protiúčet a kód banky";
PROTIUCET_NAZEV = "Název protiúčtu";
CASTKA = "Částka";
VS = "VS";
KS = "KS";
SS = "SS";
ID_TRANSAKCE = "Identifikace transakce";
POPIS_SYSTEM = "Systémový popis";
POPIS_PRIKAZCE = "Popis příkazce";
POPIS_PRIJEMCE = "Popis pro příjemce";
AV1 = "AV pole 1";
AV2 = "AV pole 2";
AV3 = "AV pole 3";
AV4 = "AV pole 4";

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
		loadIriFile: function() { this.loadFile('iri'); },
		loadTomasFile: function() { this.loadFile('tomas'); },
		parseCSV: function(data) {
			var rows = data.split('\r\n');
			if (rows[0] != '"MojeBanka, export transakční historie";') throw "wrong file format";
			console.log(rows.slice(0,16));
			var csvOptions = {separator: ';'};
			var fileDetails = {
				startBalance: $.csv.toArray(rows[12], csvOptions)[1],
				endBalance: $.csv.toArray(rows[15], csvOptions)[1],
				received: $.csv.toArray(rows[14], csvOptions)[1],
				sent: $.csv.toArray(rows[13], csvOptions)[1],
				transactions: $.csv.toObjects(rows.slice(17).join('\n'), csvOptions),
			};
			return fileDetails;
		},
		loadFile: function(who) {
			if (who != 'tomas' && who != 'iri') {
				console.error("who must be iri or tomas");
				return;
			}
			var statusEl = this.$el.find("."+who+"FileStatus");
			var csvPath = this.$el.find("#"+who+"csvurl").first().val();
			console.log("Loading file "+csvPath);
			statusEl.text('Loading file '+csvPath).removeClass().addClass('text-info');
			var self = this;
			$.ajax({
				url: csvPath,
				beforeSend: function(xhr) {
					xhr.overrideMimeType("text/plain; charset=windows-1250");
				}
			})
			.done(function(data) {
					try {
						mwimporter.fileDetails[who] = self.parseCSV(data);
						statusEl.text('Success!').removeClass().addClass('text-success');
					} catch(err) {
						console.error(err);
						statusEl.text('Error parsing file: '+err).removeClass().addClass('text-error');
					}
			})
			.fail(function(err) {
					console.error("$.ajax failed: "+err.toString());
					statusEl.text('Error getting file: '+err.toString()).removeClass().addClass('text-error');
			});
		},
		processFiles: function() {
			
		},
		applyRules: function() {},
		downloadResultFile: function() {},
		clearRecords: function() {},
	});

})();
