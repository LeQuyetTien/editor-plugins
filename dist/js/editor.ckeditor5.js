/**
 * Example
 */

/*
new $.fn.dataTable.Editor({
    "ajax": "/api/customers",
    "table": "#customers",
    "fields": [{
            "label": "Info:",
            "name": "info",
            "type": "ckeditorClassic"
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

    var types = [{
            fieldType: 'ckeditorClassic',
            inst: 'ClassicEditor'
        },
        {
            fieldType: 'ckeditorBalloon',
            inst: 'BalloonEditor'
        },
        {
            fieldType: 'ckeditorInline',
            inst: 'InlineEditor'
        }
    ];

    $.each(types, function (i, type) {
        var fieldType = type.fieldType;
        var ckType = window[type.inst];

        _fieldTypes[fieldType] = {
            create: function (conf) {
                var that = this;
                var id = DataTable.Editor.safeId(conf.id);

                conf._input = $('<div id="' + id + '"></div>');
                ckType.create(conf._input[0], conf.opts)
                    .then(function (editor) {
                        conf._ckeditor = editor;
                    });

                return conf._input;
            },

            get: function (conf) {
                return conf._ckeditor.getData();
            },

            set: function (conf, val) {
                conf._ckeditor.setData(val);
            },

            enable: function (conf) {}, // not supported in CKEditor

            disable: function (conf) {}, // not supported in CKEditor

            destroy: function (conf) {
                conf._ckeditor.destroy();
            },

            inst: function (conf) {
                return conf._ckeditor;
            }
        };
    });


}));
