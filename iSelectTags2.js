define([
        'jquery',
        'select2'
], function () {

    var iTags = function (element, options) {
        this.$element = $(element);
        options = options || { };
        if (options.url != '') {
            options.withAjax = true;
        }

        this.options = $.extend(true, this.options, options);
        this._init();
    };

    iTags.prototype.options = {
        tagsVar : 'Arr'
    };

    iTags.prototype._init = function () {
        this._buildElement();
        this._initSelect2();
    };

    iTags.prototype._buildElement = function () {
        var isHiddenInput = this.$element.is('input') && this.$element.prop('type') === 'hidden';
        
        if (!isHiddenInput) {
            var $replaceElement = this._buildInputElement();
            this.$element.replaceWith($replaceElement);
            this.$element = $replaceElement;
        }
    };

    iTags.prototype._buildInputElement = function () {

        var $input = $('<input></input>');

        $input.prop('type', 'hidden');

        $input.prop('id', this.$element.prop('id'));
        $input.prop('name', this.$element.prop('name'));
        $input.prop('class', this.$element.prop('class'));
        
        var value = this.$element.val(),
            valToSet = '';
        if ($.isArray(value)) {
            var i = 0,
                l = value.length;
            for (; i < l; i++) {
                var currentValue = value[i],
                    currentText = window.isNaN(window.parseInt(currentValue, 10)) ? currentValue : this.$element.find('option[value="' + currentValue + '"]').text();
                
                valToSet += i < l - 1 ? currentText + ' ,' : currentText;
            }
        } else {
            valToSet = value;
        }

        $input.attr('value', valToSet);

        return $input;
    };

    iTags.prototype._buildOptions = function() {
        var select2Opts = {
            tags : true,
            tokenSeparators: [",", " "]
        };

        return select2Opts;
    };

    iTags.prototype._initSelect2 = function () {

        var select2Opts = this._buildOptions();

        this._getTagsAndSelect2(select2Opts);
    };

    iTags.prototype._getTagsAndSelect2 = function (select2Opts) {
        
        if(this.options.withAjax === true) {
            $.ajax({
                url: this.options.url,
            }).done($.proxy(function (response) {
                this._applySelect2(response, select2Opts);
            },this));
        }else {
            this._applySelect2({ }, select2Opts);
        }

    };

    iTags.prototype._applySelect2 = function (data, select2Opts) {
       
        var tags = data[this.options.tagsVar];
        if(tags != null) {
            var mappedTags = tags.map(function(obj) {
                return obj.Val;
            });
            select2Opts.tags = mappedTags;
        }else {
            select2Opts.tags = [];
        }
        
        this.$element.select2(select2Opts);
    };

    //#region register plugin
    $.fn.iSelectTags2 = function (options) {
        var $elem = $(this);
        $elem.each(function (idx, el) {
            var $el = $(el),
                inst = null;
            inst = new iTags($el, options);
        });

        return $elem;
    };
    //#endregion
});