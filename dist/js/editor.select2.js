/**
 * Example
 */

/*
Create an Editor instance with a Select2 field and data
new $.fn.dataTable.Editor({
    "ajax": "php/todo.php",
    "table": "#example",
    "fields": [{
        "label": "Item:",
        "name": "item"
    }, {
        "label": "Priority:",
        "name": "priority",
        "type": "select2",
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

    _fieldTypes.select2 = {
        _addOptions: function (conf, opts) {
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
                    id: DataTable.Editor.safeId(conf.id)
                }, conf.attr || {}));

            var options = $.extend({
                width: '100%'
            }, conf.opts);

            _fieldTypes.select2._addOptions(conf, conf.options || conf.ipOpts);
            conf._input.select2(options);

            var open;
            conf._input
                .on('select2:open', function () {
                    open = true;
                })
                .on('select2:close', function () {
                    open = false;
                });

            // On open, need to have the instance update now that it is in the DOM
            this.one('open.select2-' + DataTable.Editor.safeId(conf.id), function () {
                conf._input.select2(options);

                if (open) {
                    conf._input.select2('open');
                }
            });

            return conf._input[0];
        },

        get: function (conf) {
            var val = conf._input.val();
            val = conf._input.prop('multiple') && val === null ? [] :
                val;

            return conf.separator ?
                val.join(conf.separator) :
                val;
        },

        set: function (conf, val) {
            if (conf.separator && !$.isArray(val)) {
                val = val.split(conf.separator);
            }

            // Clear out any existing tags
            if (conf.opts && conf.opts.tags) {
                conf._input.val([]);
            }

            // The value isn't present in the current options list, so we need to add it
            // in order to be able to select it. Note that this makes the set action async!
            // It doesn't appear to be possible to add an option to select2, then change
            // its label and update the display
            var needAjax = false;

            if (conf.opts && conf.opts.ajax) {
                if ($.isArray(val)) {
                    for (var i = 0, ien = val.length; i < ien; i++) {
                        if (conf._input.find('option[value="' + val[i] + '"]').length === 0) {
                            needAjax = true;
                            break;
                        }
                    }
                } else {
                    if (conf._input.find('option[value="' + val + '"]').length === 0) {
                        needAjax = true;
                    }
                }
            }

            if (needAjax && val) {
                $.ajax($.extend({
                    beforeSend: function (jqXhr, settings) {
                        // Add an initial data request to the server, but don't
                        // override `data` since the dev might be using that
                        var initData = 'initialValue=true&value=' +
                            JSON.stringify(val);

                        if (typeof conf.opts.ajax.url === 'function') {
                            settings.url = conf.opts.ajax.url();
                        }

                        if (settings.type === 'GET') {
                            settings.url += settings.url.indexOf('?') === -1 ?
                                '?' + initData :
                                '&' + initData;
                        } else {
                            settings.data = settings.data ?
                                settings.data + '&' + initData :
                                initData;
                        }
                    },
                    success: function (json) {
                        var addOption = function (option) {
                            if (conf._input.find('option[value="' + option.id + '"]').length === 0) {
                                $('<option/>')
                                    .attr('value', option.id)
                                    .text(option.text)
                                    .appendTo(conf._input);
                            }
                        }

                        if ($.isArray(json)) {
                            for (var i = 0, ien = json.length; i < ien; i++) {
                                addOption(json[i]);
                            }
                        } else if (json.results && $.isArray(json.results)) {
                            for (var i = 0, ien = json.results.length; i < ien; i++) {
                                addOption(json.results[i]);
                            }
                        } else {
                            addOption(json);
                        }

                        conf._input
                            .val(val)
                            .trigger('change', {
                                editor: true
                            });
                    }
                }, conf.opts.ajax));
            } else {
                conf._input
                    .val(val)
                    .trigger('change', {
                        editor: true
                    });
            }
        },

        enable: function (conf) {
            $(conf._input).removeAttr('disabled');
        },

        disable: function (conf) {
            $(conf._input).attr('disabled', 'disabled');
        },

        // Non-standard Editor methods - custom to this plug-in
        inst: function (conf) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();

            return conf._input.select2.apply(conf._input, args);
        },

        update: function (conf, data) {
            var val = _fieldTypes.select2.get(conf);

            _fieldTypes.select2._addOptions(conf, data);

            // Restore null value if it was, to let the placeholder show
            if (val === null) {
                _fieldTypes.select2.set(conf, null);
            }

            $(conf._input).trigger('change', {
                editor: true
            });
        },

        focus: function (conf) {
            if (conf._input.is(':visible') && conf.onFocus === 'focus') {
                conf._input.select2('open');
            }
        },

        owns: function (conf, node) {
            if ($(node).closest('.select2-container').length || $(node).closest('.select2').length || $(node).hasClass('select2-selection__choice__remove')) {
                return true;
            }
            return false;
        }
    };


}));
