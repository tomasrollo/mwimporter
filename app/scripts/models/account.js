/*global mwimporter, Backbone*/

mwimporter.Models = mwimporter.Models || {};

(function () {
    'use strict';

    mwimporter.Models.AccountModel = Backbone.Model.extend({

        url: '',

        initialize: function() {
			this.on('all', mwimporter.vent.setupTrigger('account'));
        },

        defaults: {
			name: '',
			number: ''
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

})();
