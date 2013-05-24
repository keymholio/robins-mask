(function ($) {

    "use strict"; // jshint ;_;

    /*global $, window: false, location: false, document: false, setTimeout: false */

    /* Mask CLASS DEFINITION
    * ==================== */

    var Mask = function (element, options) {
        this.element = $(element);
        this.mask = this.element.data("maskInput");
        this.current_value = this.element.val();
        this.init_mask = "";
        this.placeholder = "_";
        this.definitions = {'9': "[0-9]", 'a': "[A-Za-z]", '~': "[A-Za-z0-9]"};
        if (this.element.data('maskInputDef')) {
            this.definitions = $.extend({}, this.definitions, this.element.data('maskInputDef'));
        }
    };

    Mask.prototype = {

        constructor: Mask,

        init: function (force) {
            var obj = this,
                mask = this.mask,
                placeholder = this.placeholder;

            // force makes sure the placeholders are added even if
            // the element is not empty
            force = typeof force === "undefined" ? false : true;

            if (this.element.val() === "" || force) {
                //check if the character needs a placeholder
                $.each(this.definitions, function (key, expr) {
                    // escape regex characters
                    key = obj.escape_regex(key);
                    expr = new RegExp(key, "g");
                    mask = mask.replace(expr, placeholder);
                });
                this.element.val(mask);
                this.init_mask = mask;
                this.caret(this.element.val().indexOf(this.placeholder));
            }
        },

        type: function (e) {
            this.init();
            var key = String.fromCharCode(e.which);

            if (!e.ctrlKey && !e.altKey && !e.metaKey && e.keyCode !== 9) {
                e.preventDefault();
                if (this.caret().begin !== this.caret().end) {
                    this.clear_range(this.caret().begin, this.caret().end);
                }
                this.insert(key);
            }
        },

        insert: function (key, pos) {
            var index,
                char_type,
                current_char,
                caret_pos,
                spots_left = this.element.val() === "" ? 1 : this.element.val().split(this.placeholder).length - 1;

            // find the next spot with a mask
            for (index = this.caret().begin; index < this.mask.length; index += 1) {
                if (this.definitions[this.mask[index]]) { break; }
            }
            char_type = new RegExp(this.definitions[this.mask[index]]);
            // match found
            if (key.match(char_type) && spots_left > 0) {
                // save the current char to re-insert later
                current_char = this.element.val()[index];
                // insert new character
                this.element.val(this.set_char_at(this.element.val(), index, key));
                // save caret position
                caret_pos = pos ? pos : index + 1;
                // update caret position
                this.caret(index + 1);
                // if we need to re-insert the char we're replacing
                if (current_char && current_char.match(char_type)) {
                    this.insert(current_char, caret_pos);
                } else if (pos) {
                    // reset the character to the original position
                    // if we had to re-insert
                    this.caret(pos);
                }
            }
        },

        insert_range: function (blur) {
            var obj = this,
                string = this.element.val();
            this.init(true);
            $.each(string, function (index, char) {
                obj.insert(char);
            });
            if (blur) {
                this.element.blur();
            }
        },

        remove: function (e) {
            var delete_key = e.which === 8 || e.which === 46 || e.which === 127 ? true : false;

            if (delete_key) {
                e.preventDefault();
                // removing one character
                if (this.caret().begin === this.caret().end) {
                    if (e.which === 46) {
                        this.clear(this.caret().end, "right");
                    } else {
                        this.clear(this.caret().end - 1, "left");
                    }
                } else {
                    this.clear_range(this.caret().begin, this.caret().end);
                }
            }
        },

        paste: function (e) {
            var obj = this;
            this.element.val(this.unmask());
            setTimeout(function () {
                //pasted_text = obj.element.val();
                obj.insert_range();
            }, 100);
        },

        unmask: function () {
            var obj = this,
                unmasked_val = "";
            if (this.element.val() === "") {
                unmasked_val = this.element.val();
            } else {
                if (this.mask === "number") {
                    unmasked_val = this.element.val().replace(/,/g, "");
                } else {
                    $.each(this.init_mask, function (index, char) {
                        if (char === obj.placeholder && obj.element.val()[index] !== obj.placeholder) {
                            unmasked_val += obj.element.val()[index];
                        }
                    });
                }
            }
            return unmasked_val;
        },

        clear_range: function (start, end) {
            //removing a group of characters
            var char_count = end - start,
                i;
            for (i = 0; i < char_count; i += 1) {
                this.clear(end - i - 1);
            }
        },

        clear: function (caret_pos, direction) {
            var index;
            // find the next spot with a mask
            for (index = caret_pos; index >= 0;) {
                if (this.definitions[this.mask[index]]) {
                    this.element.val(this.set_char_at(this.element.val(), index, this.placeholder));
                    this.element.val(this.unmask());
                    this.insert_range();
                    this.caret(index);
                    break;
                }
                if (direction === "right" && index < this.element.val().length - 1) {
                    index += 1;
                } else if (direction === "right" && index === this.element.val().length) {
                    break;
                } else {
                    index -= 1;
                }
            }
        },

        // Helper function to set make strings mutable
        // this.set_char_at("fat", 0, "c") // changes "fat" to "cat"
        set_char_at: function (str, index, chr) {
            if (index > str.length - 1) { return str; }
            return str.substr(0, index) + chr + str.substr(index + 1);
        },

        // Helper function for caret position
        // you can do stuff like this
        // this.element.caret(); //get the begin/end caret position
        // this.element.caret().begin;
        // this.element.caret().end;
        // this.element.caret(5); //set the caret position by index
        // this.element.caret(1, 5); //select a range
        caret: function (begin, end) {
            var range,
                zero = 0;

            if (this.element.length === 0 || this.element.is(":hidden")) {
                return;
            }

            if (typeof begin === 'number') {
                end = (typeof end === 'number') ? end : begin;
                if (this.element.get(0).setSelectionRange) {
                    this.element.get(0).setSelectionRange(begin, end);
                } else if (this.element.get(0).createTextRange) {
                    range = this.element.get(0).createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', begin);
                    range.select();
                }
            } else {
                if (this.element.get(0).setSelectionRange) {
                    begin = this.element.get(0).selectionStart;
                    end = this.element.get(0).selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    begin = zero - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return { begin: begin, end: end };
            }
        },

        escape_regex: function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },

        // adding commas to numbers
        format_number: function () {
            var number = this.element.val().replace(/,/g, ""),
                x,
                x1,
                x2,
                rgx = /(\d+)(\d{3})/;
            number += '';
            x = number.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            this.element.val(x1 + x2);
        },

        reset_number: function (e) {
            var caret_pos = this.caret().begin;
            this.element.val(this.unmask());
            this.caret(caret_pos);
        }
    };


    /* Mask PLUGIN DEFINITION
    * ===================== */

    $.fn.mask = function (option, key) {
        var data;

        this.each(function () {
            var $this = $(this);
            data = $this.data('mask');
            if (!data) { $this.data('mask', (data = new Mask(this))); }
        });

        if (option === "unmask") {
            return data.unmask();
        } else if (option === "get_value") {
            return data.current_value;
        } else if (option === "set_value") {
            data.current_value = $(this).val();
        } else if (option === "insert_range") {
            data[option](true);
        } else {
            return this.each(function () {
                if (typeof option === 'string' && (option === "type" || option === "remove" || option === "paste")) {
                    data[option](key);
                } else if (typeof option === 'string') {
                    data[option]();
                }
            });
        }
    };

    $.fn.mask.Constructor = Mask;


    /* Mask DATA-API
     * ============ */

    $(function () {

        $('body').on("click.mask", "[data-mask-input]:not([data-mask-input=number])", function () {
            $(this).mask('init');
        });

        $('body').on("paste.mask", "[data-mask-input]:not([data-mask-input=number])", function (e) {
            $(this).mask('paste', e);
        });

        $('body').on("blur.mask", "[data-mask-input]:not([data-mask-input=number])", function () {
            if ($(this).mask('unmask') === "") {
                $(this).val("");
            }

            if ($(this).val() !== $(this).mask('get_value')) {
                $(this).change();
                $(this).mask('set_value');
            }
        });

        $('body').on("keypress.mask", "[data-mask-input]:not([data-mask-input=number])", function (e) {
            $(this).mask('type', e);
        });

        $('body').on("keydown.mask", "[data-mask-input]:not([data-mask-input=number])", function (e) {
            $(this).mask('remove', e);
        });

        //on load stuff
        $("[data-mask-input]").each(function () {
            if ($(this).val() !== "" && $(this).val() !== "optional") {
                if ($(this).attr("data-mask-input") === "number") {
                    $(this).mask('format_number');
                } else {
                    $(this).mask('insert_range');
                }
            }
        });

        $('body').on("click.mask", "[data-mask-input=number]", function () {
            $(this).mask('reset_number');
        });

        $('body').on("blur.mask", "[data-mask-input=number]", function () {
            $(this).mask('format_number');
        });

        $('form').submit(function () {
            $("[data-mask-input]:not([data-mask-keep])").each(function () {
                if ($(this).val() !== "") {
                    $(this).val($(this).mask('unmask'));
                }
            });
        });

    });
}(window.jQuery));