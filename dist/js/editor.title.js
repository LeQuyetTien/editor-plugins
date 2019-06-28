/**
 * Example
 */

/*
new $.fn.dataTable.Editor({
    "ajax": "php/dates.php",
    "table": "#staff",
    "fields": [{
            "label": "Personal information",
            "name": "pinfo",
            "type": "title"
        },
        // additional fields...
    ]
});
*/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables', 'datatables-editor'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        module.exports = function ($, dt) {
            if (!$) {
                $ = require('jquery');
            }
            factory($, dt || $.fn.dataTable || require('datatables'));
        };
    } else if (jQuery) {
        // Browser standard
        factory(jQuery, jQuery.fn.dataTable);
    }
}(function ($, DataTable) {
    'use strict';


    if (!DataTable.ext.editorFields) {
        DataTable.ext.editorFields = {};
    }

    var _fieldTypes = DataTable.Editor ?
        DataTable.Editor.fieldTypes :
        DataTable.ext.editorFields;


    _fieldTypes.title = {
        create: function (field) {
            return $('<div/>')[0];
        },
        get: function (field) {
            return '';
        },
        set: function (field, val) {}
    };


}));
