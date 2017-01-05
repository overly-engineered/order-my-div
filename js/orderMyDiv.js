;
(function($, window, document, undefined) {

    'use strict';

    var OMD = function(element, options) {

        if (!options) {
            options = {};
            options.globalID = '#' + element.attr('id');
        }

        this.settings = $.extend({}, OMD.Defaults, options);

        this.globalID = element;

        this.$element = $(element);

        //var tmp =  $(element).clone();

        this.$startingLayout = null;

        this.$selector = null;

        this.orderType = null;

        this._handlers = {};

        this._current = null;

        this._items = [];

        this._width = null;

        this._states = {
            current: {},
            tags: {}
        };


        this.initialize();
    }

    OMD.Defaults = {
        orderType: 'Numerical',
        width: window.innerWidth,
        itemElement: 'div',
        selectPosition: 'start',
        globalID: '#content',
        anim: true,
        orderBy: 'h2'
    };
    OMD.prototype.initialize = function() {
        //Create select box
        if (this.settings.orderType == 'Numerical') {
            //numerical
            var options = ['Default', 'Numerical Ascending', 'Numerical Descending'];
            var selector = document.createElement('select');
            this.$selector = $(selector);
            for (i = 0; i < options.length; i++) {
                var temp = document.createElement('option');
                temp.text = options[i];
                temp.value = i;
                this.$selector.append(temp);
            }
            if (this.settings.selectPosition == 'end') {
                this.$element.append(this.$selector);
            } else {
                this.$element.prepend(this.$selector);
            }
            this.settings.orderType = 'Numerical'
        } else {
            //alphabetical
            var options = ['Default', 'Alphabetical Ascending', 'Alphabetical Descending'];
            var selector = document.createElement('select');
            this.$selector = $(selector);
            for (var i = 0; i < options.length; i++) {
                var temp = document.createElement('option');
                temp.text = options[i];
                temp.value = i;
                this.$selector.append(temp);
            }
            if (this.settings.selectPosition == 'end') {
                this.$element.append(this.$selector);
            } else {
                this.$element.prepend(this.$selector);
            }
        }

        this.$startingLayout = $(this.$element.find('.item'));
        this.setPositions();
        this.addEventHandlers();
    };

    OMD.prototype.addEventHandlers = function() {

        this.$selector.on('change', $.proxy(this.reOrder, this));
    };
    OMD.prototype.setPositions = function() {
        var O = this;
        var styles = '';
        $($(this.globalID).find('.item')).each(function(i, e) {
            var top = $(e).offset().top - $(O.settings.globalID).offset().top;
            var left = $(e).offset().left - $(O.settings.globalID).offset().left;
            var width = $(e).width();
            var height = $(e).height();
            styles += O.settings.globalID + ' .item:nth-of-type(' + (i + 1) + '){top:' + top + 'px;left:' + left + 'px;width:' + width + 'px;height:' + height + 'px; }';
        });
        if (!O.settings.anim) {
            styles += O.settings.globalID + ' .item{transition:none!important;}';
        } else {
            styles += O.settings.globalID + ' .item{position:absolute;}';
        }
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';

        if (style.styleSheet) {
            style.styleSheet.cssText = styles;
        } else {
            style.appendChild(document.createTextNode(styles));
        }

        head.appendChild(style);
    }
    OMD.prototype.reOrder = function() {
        this.$element = $(this.globalID);
        var elementArray = [];
        $(this.$element).find('.item').each(function() {
            var CSSleft = $(this).css('left');
            var CSStop = $(this).css('top');
            $(this).attr('style', 'top :' + CSStop + '; left:' + CSSleft + ';');
            elementArray.push($(this));
        });

        switch (this.$selector[0].value) {
            case '1':
                this.ascdesc(true);
                break;
            case '2':
                this.ascdesc(false);
                break;
            default:
                this.defaultOrder();

        }
    };
    OMD.prototype.ascdesc = function(direction) {
        var O = this;
        var posReset = function() {
            O.$element.find('.item').each(function(i, elem) {
                $(elem).attr('style', '');
            });
        }
        var arr = this.$element.find('.item').length;
        for (var i = 0; i < arr; i++) {
            var $elem = $(this.$element.find('.item')[i]).find('h2');
            var $elemTwo = $(this.$element.find('.item')[i + 1]).find('h2');

            if (direction) {
                if (O.settings.orderType == 'Numerical') {
                    if (parseInt($elem.text()) > parseInt($elemTwo.text()) && i !== (arr - 1)) {
                        var toMove = $elem.parent().detach();
                        $(toMove).insertAfter($elemTwo.parent());
                        i = -1;
                    } else if (i == (arr - 1) && this.settings.anim) {
                        setTimeout(posReset, 50);
                    } else if(i == (arr - 1)){
                        posReset();
                    }
                } else {
                    if ($elem.text() > $elemTwo.text() && i !== (arr - 1)) {
                        var toMove = $elem.parent().detach();
                        $(toMove).insertAfter($elemTwo.parent());
                        i = -1;
                    } else if (i == (arr - 1) && this.settings.anim) {
                        setTimeout(posReset, 50);
                    } else if(i == (arr - 1)){
                        posReset();
                    }
                }
            } else {
                if (O.settings.orderType == 'Numerical') {
                    if (parseInt($elem.text()) < parseInt($elemTwo.text()) && i !== (arr - 1)) {
                        var toMove = $elem.parent().detach();
                        $(toMove).insertAfter($elemTwo.parent());
                        i = -1;
                    } else if (i == (arr - 1) && this.settings.anim) {
                        setTimeout(posReset, 50);
                    } else if(i == (arr - 1)){
                        posReset();
                    }
                } else {
                    if ($elem.text() < $elemTwo.text() && i !== (arr - 1)) {
                        var toMove = $elem.parent().detach();
                        $(toMove).insertAfter($elemTwo.parent());
                        i = -1;
                    } else if (i == (arr - 1) && this.settings.anim) {
                        setTimeout(posReset, 50);
                    } else if(i == (arr - 1)){
                        posReset();
                    }
                }
            }
        }
    };
    OMD.prototype.defaultOrder = function() {
        var O = this;
        var posReset = function() {
            O.$element.find('.item').each(function(i, elem) {
                $(elem).attr('style', '');
            });

        }
        for (var i = 0; i < this.$startingLayout.length; i++) {
            var target = this.$startingLayout[i].innerHTML;
            var current = this.$element.find('.item')[i];
            if (current.innerHTML !== target) {
                for (var j = 0; j < this.$startingLayout.length; j++) {
                    if (this.$startingLayout[j].innerHTML == current.innerHTML) {
                        var toMove = $(current).detach();
                        $(toMove).insertAfter(this.$element.find('.item')[j - 1]);
                        i = -1;
                    }
                }
            }
            if (i == (this.$startingLayout.length - 1) && this.settings.anim) {
                setTimeout(posReset, 50);
            } else if(i == (this.$startingLayout.length - 1)){
                posReset();
            }
        }
    };
    OMD.prototype.positionReset = function() {}
    $.fn.orderMyDiv = function(option) {
        new OMD(this, typeof option == 'object' && option);

    };
    $.fn.orderMyDiv.Constructor = OMD;
})(window.jQuery, window, document);
