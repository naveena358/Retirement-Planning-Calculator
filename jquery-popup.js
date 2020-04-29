(function($) {
    $.hunterPopup = function(box, options) {
        var box = $(box);
        var defaults = {
            title: 'More Information',
            placement: 'left',
            width: '100%',
            height: '100%',
            content: $('<div><h3>More Information</h3></div>'),
            event: closePopup
        };
        var obj = $.extend(defaults, options);

        var template = $('<div class="Hunter-pop-up" id="Hunter-pop-up"><a class="close"><i class="glyphicon glyphicon-remove"></i></a><div class="arrow"></div><h3 class="title"></h3><div id="Hunter_pop_wrap" class="Hunter-wrap"></div></div>');
        var title = $('.title', template);
        var pop_wrap = $('#Hunter_pop_wrap', template);

        $(document).click(function() {
            template.remove();
        });

        box.click(function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('.Hunter-pop-up').remove();
            var _this = $(this);
            var offset = _this.offset();
            var top = offset.top + _this.outerHeight() + 15;
            if(obj.placement == 'left') {
                template.css({
                    'left': offset.left-20,
                    'top': top
                });

            }  else if(obj.placement == 'left_px') {
                template.css({
                    'left': offset.left-200,
                    'top': top
                });

            } else if(obj.placement == 'left_px_1') {
                template.css({
                    'left': offset.left-250,
                    'top': top
                });

            }

            else {
                template.addClass("Hunter-pop-up-right");
                template.css({
                    'left': offset.left - obj.width + _this.width() / 2,
                    'top': top
                });
            }

            buildPopup();
            $('body').append(template);
            $('.Hunter-pop-up').click(function(event) {
                event.stopPropagation();
            });

            obj.event();

        });

        function buildPopup() {
            buildPopupContent();
            closePopup();
        };

        function buildPopupContent() {
            title.text(obj.title);

            var _content = obj.content;
            _content.show();
            pop_wrap.children().remove();
            pop_wrap.append(_content);
            pop_wrap.width(obj.width);
            pop_wrap.height(obj.height);
        };

        function closePopup() {
            template.on('click', '.close', function(event) {
                event.preventDefault();
                event.stopPropagation();
                template.remove();
            });
        }
    };

    $.fn.extend({
        hunterPopup: function(options) {
            options = $.extend({}, options);
            this.each(function() {
                new $.hunterPopup(this, options);
            });
            return this;
        }

    });
})(jQuery);
