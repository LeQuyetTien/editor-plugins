/**
 * Use the [International Telephone Input](https://intl-tel-input.com/) telephone input control in Editor.
 * 
 * @name Formatted telephone numbers
 * @summary An input that will fromat international telephone numbers
 * @requires [libphonenumber](https://github.com/jackocnr/intl-tel-input#utilities-script)
 * 
 * @example
 *  new $.fn.dataTable.Editor({
 *  	ajax: 'php/dates.php',
 *  	table: '#example',
 *  	fields: [
 *  		{
 *  			label: 'First name:',
 *  			name: 'first_name',
 *  		},
 *  		{
 *  			label: 'Last name:',
 *  			name: 'last_name',
 *  		},
 *  		{
 *  			label: 'Phone:',
 *  			name: 'tel',
 *  			type: 'telephone',
 *  		},
 *  	],
 *  });
 */
 
 (function( factory ){
    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define( ['jquery', 'datatables', 'datatables-editor'], factory );
    }
    else if ( typeof exports === 'object' ) {
        // Node / CommonJS
        module.exports = function ($, dt) {
            if ( ! $ ) { $ = require('jquery'); }
            factory( $, dt || $.fn.dataTable || require('datatables') );
        };
    }
    else if ( jQuery ) {
        // Browser standard
        factory( jQuery, jQuery.fn.dataTable );
    }
}(function( $, DataTable ) {
'use strict';
 
 
if ( ! DataTable.ext.editorFields ) {
    DataTable.ext.editorFields = {};
}
 
var _fieldTypes = DataTable.Editor ?
    DataTable.Editor.fieldTypes :
    DataTable.ext.editorFields;
 
 
_fieldTypes.telephone = {
    create: function (conf) {
        conf._input = $('<input>');
 
        this.one('open', function () {
            var options = $.extend({
                dropdownContainer: document.body
            }, conf.opts);
 
            conf._tel = conf._input.intlTelInput(options);
 
            if (conf._initSet) {
                conf._tel.intlTelInput('setNumber', conf._initSet);
            }
        });
 
        return conf._input[0];
    },
 
    get: function (conf) {
        return conf._tel.intlTelInput('getNumber', intlTelInputUtils.numberFormat.INTERNATIONAL);
    },
 
    set: function (conf, val) {
        if (!conf._tel) {
            conf._initSet = val;
        }
        else {
            conf._tel.intlTelInput('setCountry', conf.opts.initialCountry || '');
            conf._tel.intlTelInput('setNumber', val);
        }
    },
 
    enable: function ( conf ) {},
 
    disable: function ( conf ) {},
 
    destroy: function (conf) {
        this.off( 'open' );
    }
};
 
 
}));
