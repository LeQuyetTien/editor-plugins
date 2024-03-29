/**
 * This plug-in displays user input data passed through a masking filter - i.e.
 * it reformats the user input into an attractive format. This can be useful for
 * telephone numbers, credit card numbers, e-mail address, car registration
 * numbers and many more. It is also used to help ensure that the user inputs
 * expected data (for example in the case of credit cards, only number
 * characters would be accepted).
 *
 * This plug-in makes use of the [jQuery Mask plug-
 * in](http://igorescobar.github.io/jQuery-Mask-Plugin/) from [Igor
 * Escobar](http://www.igorescobar.com/) which is MIT licensed.
 *
 * The mask plug-in used is primarily configured by the `mask` option that is
 * documented below. The `placeholder` and `maskOptions` are also available and
 * expose the full range of options available for the masking software.
 *
 * @name Masked inputs
 * @summary Display user input in a given format
 * @requires [jQuery Mask plug-in](http://igorescobar.github.io/jQuery-Mask-Plugin/)
 *
 * @depjs //cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.0/jquery.mask.js
 * 
 * @opt `e-type string` **`mask`**: The mask to apply. The default special
 *   characters are:
 *
 *   * `0` - Numeric character
 *   * `9` - Optional numeric character
 *   * `#` - Recursive numeric character
 *   * `A` - Letter or number
 *   * `S` - Letter only
 * 
 * @opt `e-type string` **`placeholder`**: The placeholder to show in the input.
 *   This can be useful to let the user know what format is expected in the
 *   input.
 * @opt `e-type object` **`maskOptions`**: Options passed directly to the jQuery
 *   mask plug-in. Please refer to the plug-ins documentation for the full range
 *   of options.
 *
 * @example
 *     
 * new $.fn.dataTable.Editor( {
 *   "ajax": "php/dates.php",
 *   "table": "#staff",
 *   "fields": [ {
 *      label: "Extension:",
 *      name: "extn",
 *      type: "mask",
 *      mask: "00000"
 *    }, {
 *      label: "Start date:",
 *      name: "start_date",
 *      type: "mask",
 *      mask: "0000/00/00",
 *      placeholder: "YYYY/MM/DD"
 *    }, {
 *      label: "Salary:",
 *      name: "salary",
 *      type: "mask",
 *      mask: "#,##0",
 *      maskOptions: {
 *        reverse: true,
 *        placeholder: ""
 *      }
 *    }
 *   ]
 * } );
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


_fieldTypes.mask = {
	create: function ( conf ) {
		conf._input = $('<input/>').attr( $.extend( {
			id: DataTable.Editor.safeId( conf.id ),
			type: 'text'
		}, conf.attr || {} ) );

		conf._input.mask( conf.mask, $.extend( {
			placeholder: conf.placeholder || conf.mask.replace(/[09#AS]/g, '_')
		}, conf.maskOptions ) );

		return conf._input[0];
	},

	get: function ( conf ) {
		return conf._input.val();
	},

	set: function ( conf, val ) {
		conf._input
			.val( val )
			.trigger( 'change' )
			.trigger( 'input.mask' )
			.trigger( 'keyup.mask' );
	},

	enable: function ( conf ) {
		conf._input.prop( 'disabled', false );
	},

	disable: function ( conf ) {
		conf._input.prop( 'disabled', true );
	},

	canReturnSubmit: function ( conf, node ) {
		return true;
	}
};

}));
