(function($){
    $.fn.tougo = function(options){
        var defaults = {
            width: $(window).width() - 200,
            height: $(window).height() - 200
        };
        var options = $.extend(defaults, options);
        obj = $(this);
        obj.append('<div id="backcolor" style="z-index:-1; float:left;margin-left:10px;margin-top:10px;padding-bottom:10px;padding:10px;background-color:gray;width:100; height:' + defaults.height + '";></div>');
        obj.append('<canvas id="canvas" style="z-index:99; float:left;padding:10px;margin-top:10px;padding-bottom:10px;margin-left:10px; border:1px solid;" width="' + defaults.width + '" height="' + defaults.height + '"></canvas>');
		
		$(this).css('width', defaults.width+200);
		$(this).css('height', defaults.height);
		$(this).css('margin','0px auto');
		$(this).css('padding', '10px');
		
		$("#backcolor").append('<a href="#" id= "btn1" onclick="zin();">+</a>');
        $("#backcolor").append('<a href="#" id= "btn2" onclick="zout();">-</a>');
        $("#backcolor").append('<a href="#" id= "btn3" onclick="pan();">PAN</a>');
		$("#backcolor").append('<a href="#" id= "btn4" onclick="select();">SELECT</a>');

        $('a[id^="btn"]').each(function(){
                $(this).css('display', 'block');
                $(this).css('color', 'white');
                $(this).css('text-decoration', 'none');
                $(this).css('width', '60');
                $(this).css('background-color', '#f60');
                $(this).css('border', '3px outset #000');
            $(this).hover(function(){
                $(this).css('display', 'block');
                $(this).css('color', 'red');
                $(this).css('text-decoration', 'none');
                $(this).css('width', '60');
                $(this).css('background-color', '#ff0');
                $(this).css('border', '3px outset #000');
            }, function(){
                $(this).css('display', 'block');
                $(this).css('color', 'white');
                $(this).css('text-decoration', 'none');
                $(this).css('width', '60');
                $(this).css('background-color', '#f60');
                $(this).css('border', '3px outset #000');
            });
        });
        
        return this;
    };
})(jQuery);
