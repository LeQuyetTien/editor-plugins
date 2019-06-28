/**
 * Example
 */

/*
// Create an Editor instance with a Chosen field and data
new $.fn.dataTable.Editor({
    "ajax": "php/todo.php",
    "table": "#example",
    "fields": [{
        "label": "Item:",
        "name": "item"
    }, {
        "label": "Priority:",
        "name": "priority",
        "type": "chosen",
        "options": [{
                "label": "1 (highest)",
                "value": "1"
            },
            {
                "label": "2",
                "value": "2"
            },
            {
                "label": "3",
                "value": "3"
            },
            {
                "label": "4",
                "value": "4"
            },
            {
                "label": "5 (lowest)",
                "value": "5"
            }
        ]
    }, {
        "label": "Status:",
        "name": "status",
        "type": "radio",
        "default": "Done",
        "options": [{
                "label": "To do",
                "value": "To do"
            },
            {
                "label": "Done",
                "value": "Done"
            }
        ]
    }]
});
// Add a Chosen field to Editor with Chosen options set
editor.add({
    "label": "State:",
    "name": "state",
    "type": "chosen",
    "opts": {
        "disable_search": true,
        "inherit_select_classes": true
    }
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


    _fieldTypes.chosen = {
        "_addOptions": function (conf, opts) {
            var elOpts = conf._input[0].options;

            elOpts.length = 0;

            if (opts) {
                DataTable.Editor.pairs(opts, conf.optionsPair, function (val, label, i) {
                    elOpts[i] = new Option(label, val);
                });
            }
        },

        create: function (conf) {
            conf._input = $('<select/>')
                .attr($.extend({
                    id: conf.id
                }, conf.attr || {}));

            _fieldTypes.chosen._addOptions(conf, conf.options || conf.ipOpts);

            // On open, need to have the instance update now that it is in the DOM
            this.on('open.chosen-' + conf.id, function () {
                conf._input.chosen($.extend({}, conf.opts, {
                    width: '100%'
                }));
            });

            return conf._input[0];
        },

        get: function (conf) {
            return conf._input.val();
        },

        set: function (conf, val) {
            conf._input.val(val).trigger('chosen:updated');
        },

        enable: function (conf) {
            conf._input.attr('disabled', false).trigger('chosen:updated');
            $(conf._input).removeClass('disabled');
        },

        disable: function (conf) {
            conf._input.attr('disabled', true).trigger('chosen:updated');
            $(conf._input).addClass('disabled');
        },

        update: function (conf, options) {
            _fieldTypes.chosen._addOptions(conf, options);
            conf._input.trigger('chosen:updated');
        }
    };


}));
