/**
 * Example
 */

/*
new $.fn.dataTable.Editor({
    "ajax": "php/dates.php",
    "table": "#example",
    "fields": [{
        "label": "First name:",
        "name": "first_name"
    }, {
        "label": "Last name:",
        "name": "last_name"
    }, {
        "label": "Updated date:",
        "name": "updated_date",
        "type": "date",
        "opts": {
            showOn: 'focus',
            format: 'yyyy-mm-dd'
        }
    }, {
        "label": "Registered date:",
        "name": "registered_date",
        "type": "date",
        "opts": {
            format: 'D, d M yy'
        }
    }]
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

    _fieldTypes.date = {
        create: function (conf) {
            conf._input = $('<input/>')
                .attr($.extend({
                    id: conf.id,
                    type: 'text',
                    'class': 'datepicker'
                }, conf.attr || {}))
                .datepicker(conf.opts || {});

            this.on('close', function () {
                conf._input.datepicker('hide');
            });

            return conf._input[0];
        },

        get: function (conf) {
            return conf._input.val();
        },

        set: function (conf, val) {
            if (typeof val === 'object' && val && val.getMonth) {
                conf._input.val(val).datepicker('setDate', val);
            } else {
                conf._input.val(val).datepicker('update');
            }
        },

        enable: function (conf) {
            conf._input.prop('disabled', true);
        },

        disable: function (conf) {
            conf._input.prop('disabled', false);
        },

        // Non-standard Editor methods - custom to this plug-in
        node: function (conf) {
            return conf._input;
        },

        owns: function (conf, node) {
            // THe date control will have redrawn itself, creating new nodes by the
            // time this function runs if clicking on a date. So need to check based
            // on class if the date picker own the element clicked on
            var isCell = $(node).hasClass('day') || $(node).hasClass('month') || $(node).hasClass('year');
            return $(node).parents('div.datepicker').length || isCell ?
                true :
                false;
        }
    };

    // Add the date plug-in methods as methods for the Editor field so they can be
    // access using (for example) `editor.field('name').show();`.
    $.each([
        'remove',
        'show',
        'hide',
        'update',
        'setDate',
        'setUTCDate',
        'getDate',
        'getUTCDate',
        'setStartDate',
        'setEndDate',
        'setDaysOfWeekDisabled'
    ], function (i, val) {
        $.fn.dataTable.Editor.fieldTypes.date[val] = function () {
            var args = Array.prototype.slice.call(arguments);
            var conf = args.shift();

            args.unshift(val);
            conf._input.datepicker.apply(conf._input, args);
        };
    });


}));
