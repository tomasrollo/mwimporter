/*global mwimporter, Backbone, JST*/

mwimporter.Views = mwimporter.Views || {};

var DATUM_SPLATNOSTI = "Datum splatnosti";
var DATUM_ODEPSANI = "Datum odepsání z jiné banky";
var PROTIUCET_CISLO = "Protiúčet a\xA0kód banky";
var PROTIUCET_NAZEV = "Název protiúčtu";
var CASTKA = "Částka";
var VS = "VS";
var KS = "KS";
var SS = "SS";
var ID_TRANSAKCE = "Identifikace transakce";
var POPIS_SYSTEM = "Systémový popis";
var POPIS_PRIKAZCE = "Popis příkazce";
var POPIS_PRIJEMCE = "Popis pro příjemce";
var AV1 = "AV pole 1";
var AV2 = "AV pole 2";
var AV3 = "AV pole 3";
var AV4 = "AV pole 4";

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
		loadIriFile: function() { this.loadFile('Iri KB'); },
		loadTomasFile: function() { this.loadFile('Tomas KB'); },
		parseCSV: function(data) {
			var rows = data.split('\r\n');
			if (rows[0] != '"MojeBanka, export transakční historie";') throw "wrong file format";
			// console.log(rows.slice(0,16));
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
			if (who != 'Tomas KB' && who != 'Iri KB') {
				console.error("who must be Iri KB or Tomas KB");
				return;
			}
			var statusEl = this.$el.find("."+(who == 'Iri KB' ? 'iri' : 'tomas')+"FileStatus");
			var csvPath = this.$el.find("#"+(who == 'Iri KB' ? 'iri' : 'tomas')+"csvurl").first().val();
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
			if (mwimporter.fileDetails['Iri KB'] === undefined || mwimporter.fileDetails['Tomas KB'] === undefined) {
				alert("Please load both files"); // TODO add better error handling
				return;
			}
			
			var noAccount = mwimporter.accounts.findWhere({name: ''});
			if (!noAccount) throw 'default no-account does not exist';
			var ownAccount;
			
			var detectTransfer = function(payee) {
				if (payee == '') {
					// console.log('no payee provided, returning noAccount');
					return noAccount.id; // default empty transfer account for payees not found
				}
				var payeeAccount = mwimporter.accounts.findWhere({number: payee});
				if (!payeeAccount) {
					// console.log('payeeAccount not found, returning noAccount');
					return noAccount.id; // default empty transfer account for payees not found
				}
				var ownAccountName = ownAccount.get('name');
				var payeeAccountName = payeeAccount.get('name');
				// console.log(ownAccountName+' '+payeeAccountName);
				if (
					(ownAccountName == 'Iri KB' && payeeAccountName == 'Tomas KB')
					|| (ownAccountName == 'Iri KB' && payeeAccountName == 'ING')
					|| (ownAccountName == 'Tomas KB' && payeeAccountName == 'Iri KB')
					|| (ownAccountName == 'Tomas KB' && payeeAccountName == 'ING')
					|| (ownAccountName == 'ING' && payeeAccountName == 'Iri KB')
					|| (ownAccountName == 'ING' && payeeAccountName == 'Tomas KB')
				) {
					// console.log('found match, returning payeeAccount');
					return payeeAccount.id;
				}
				// console.log('no match found, returning noAccount by default');
				return noAccount.id;
			};
			
			
			var self = this;
			_(['Iri KB','Tomas KB']).each(function(who) {
				console.log('Mapping '+who+' transactions to records');
				
				ownAccount = mwimporter.accounts.findWhere({name: who});
				if (!ownAccount) throw 'no account number defined for '+who;
				
				_(mwimporter.fileDetails[who].transactions).each(function(t) {
					mwimporter.records.create({
						date: t[DATUM_SPLATNOSTI],
						account: who,
						transfers: detectTransfer(t[PROTIUCET_CISLO]),
						// desc start
						payee_account: t[PROTIUCET_CISLO],
						payee_account_name: t[PROTIUCET_NAZEV],
						vs: t[VS],
						ks: t[KS],
						ss: t[SS],
						desc_system: t[POPIS_SYSTEM],
						desc_payer: t[POPIS_PRIKAZCE],
						desc_payee: t[POPIS_PRIJEMCE],
						av: $.trim($.trim(t[AV1])+' '+$.trim(t[AV2])+' '+$.trim(t[AV3])+' '+$.trim(t[AV4])),
						// desc end
						amount: t[CASTKA],
					});
				});
			});
			mwimporter.oldFileDetails = mwimporter.fileDetails;
			delete mwimporter.fileDetails;
		},
		applyRules: function() {
			mwimporter.rules.each(function(rule) {
				// TODO - support regular expressions
				// see which fields to match
				var category = rule.get('category');
				var payee = rule.get('payee');
				var fields = _.chain(rule.attributes).map(function(value, key) {
					if (value !== '' && key !== 'category' && key !== 'payee' && key !== 'id') {
						return {name: key, value: value};
					}
				}).filter(function(result) { return result !== undefined; }).value();
				// console.log(fields);
				mwimporter.records.each(function(record) {
					var checked = _(fields).all(function(field) {
						var recordValue = record.get(field.name);
						if (recordValue === undefined) throw "cannot get attribute "+field.name+' of record id='+record.id;
						if (_(['ss','ks','vs']).contains(field.name)) { // exact match for SS, VS and KS
							return (field.value == recordValue);
						}
						// for the rest do 'contains' check
						return recordValue.toLowerCase().indexOf(field.value.toLowerCase()) !== -1;
					});
					if (checked) {
						if (category !== '') record.set('category', category); // set record category only if it's filled in the rule - some rules might set only a payee
						if (payee !== '') record.set('payee', payee); // ditto for payee
						record.save();
					}
				});
			});
		},
		downloadResultFile: function() {
			var tpl = _.template('"<%=account %>","<%=transfers %>","<%=desc %>","<%=payee %>","<%=category %>","<%=date %>","<%=amount %>"');
			var csv = mwimporter.records.chain().filter(function(r) {
				var record = r.toJSON();
				record.transfers = mwimporter.accounts.get(record.transfers).get('name');
				return record.transfers == ''
				|| (record.account == 'Tomas KB' && record.transfers != '')
				|| (record.account = 'Iri KB' && record.transfers == 'ING');
			}).map(function(r) {
				var record = r.toJSON();
				record.transfers = mwimporter.accounts.get(record.transfers).get('name');
				record.amount = Math.round(parseFloat(record.amount.replace(',','.')));
				record.desc = [record.desc, record.desc_payee, record.desc_payer, record.desc_system, record.ks, record.ss, record.vs, record.av].join(' ').trim().slice(0,253);
				
				if (DEBUG_RESULT) {
					if (record.account == 'Tomas KB') record.account = 'Test Account 1';
					if (record.account == 'Iri KB') record.account = 'Test Account 2';
					if (record.transfers == 'Tomas KB') record.transfers = 'Test Account 1';
					if (record.transfers == 'Iri KB') record.transfers = 'Test Account 2';
				}
				
				return tpl(record);
			}).value();
			document.location='data:text/csv,'+encodeURIComponent('"account","transfers","desc","payee","category","date","amount"\n'+csv.join('\n'));
		},
		clearRecords: function() {
			for (var i = mwimporter.records.length - 1; i >= 0; i--) mwimporter.records.at(i).destroy();
		},
	});

})();
