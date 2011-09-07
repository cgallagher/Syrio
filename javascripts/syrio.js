// jQuery Plugin for really basic modal window effects
// Syrio - The First Sword to the Sealord of Braavos
// version 0.1.2, 09 August 2011
// by Chris Gallagher
//$.syrio("", {html_content: gallery_item_html, parse_fbml: true }, function(){});
(function($) {
    $.syrio = function(element, options) {
        var defaults = {

            overlay_div:   'modal_overlay',
						modal_div:     'modal_display',
						close_button : 'close_modal',
						close_enabled: true,
						modal_title: "",
						parse_fbml: false,
						html_content: "",
						overlay: false,
						after_open: function(el){ /** nothing **/ },
						after_close: function(el){ /** nothing **/ },
						show_nav: false,
						next: "Next",
						prev: "Prev"
        };

        var plugin = this;
        plugin.settings = {};
				
				plugin.el = $(element);
				
        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
						plugin.el.click(function(e){
							e.preventDefault();
							plugin.show(this);
						});
						
						if(plugin.el.length > 1 && plugin.settings.show_nav === true){
							
							var next_div = $('<div class="syrio_next" />')
							.html("<span>"+plugin.settings.next+"</span>")
							.click(function(){ plugin.next(); })
							.hover(function(){$(this).addClass('hover');},function(){$(this).removeClass('hover');});
							
							var prev_div = $('<div class="syrio_prev" />')
							.html("<span>"+plugin.settings.prev+"</span>")
							.click(function(){ plugin.prev(); })
							.hover(function(){$(this).addClass('hover');},function(){$(this).removeClass('hover');});

							$("#modal_content").parent().prepend(next_div, prev_div);
						}
        };

				plugin.show = function(clicked){
					plugin.centre_the_modal(function(){
						plugin.close_controls();
						plugin.set_modal_title();
						plugin.show_overlay();
						plugin.append_html_content(clicked);
						plugin.bind_control_clicks();
						if(plugin.el.length > 1 && plugin.settings.show_nav === true){
							var current_index = plugin.el.index($('.syrio_active'));
							if(current_index == 0){
								$(".syrio_prev").addClass('first');
							}
							else if(current_index == (plugin.el.length - 1)){
								$(".syrio_next").addClass('last');
							}
						}
						plugin.settings.after_open.apply(plugin, [clicked]);
					});
				};

				plugin.next = function(){
					var current_index = plugin.el.index($('.syrio_active'));
					var next_item = plugin.el[current_index + 1];
					if( next_item !== undefined){
						plugin.append_html_content(next_item);
					}
					((current_index + 1) >= plugin.el.length) ? $(".syrio_next").addClass('last') : $(".syrio_next").removeClass('last');
					$(".syrio_prev").removeClass('first');
				};
				
				plugin.prev = function(){
					var current_index = plugin.el.index($('.syrio_active'));
					var prev_item = plugin.el[current_index - 1];
					if( prev_item !== undefined){
						plugin.append_html_content(prev_item);
					}
					((current_index - 1) <= 0) ? $(".syrio_prev").addClass('first') : $(".syrio_prev").removeClass('first');
					$(".syrio_next").removeClass('last');
				};
				
				plugin.close_controls = function(){
					if (plugin.settings.close_enabled){
						$("#" + plugin.settings.overlay_div).click(function(){
							plugin.close_all();
						});

						$("#" + plugin.settings.close_button).click(function(){
							plugin.close_all();
						});

						$(document).keyup(function(e) {
						  if (e.keyCode == 13) { plugin.close_all(); } 
						  if (e.keyCode == 27) { plugin.close_all(); } 
						});	
					}
					else{
						$("#close_modal").hide();
					}
				};
				
				plugin.add_overlay = function(){
					if($('#' + plugin.settings.overlay_div).length < 1){
						var overlay = $("<div />").attr("id", plugin.settings.overlay_div);
						$('body').prepend(overlay);
					}
				};
				
				plugin.set_modal_title = function(){
					if(plugin.settings.modal_title !== "")
						$("#syrio_title").html(plugin.settings.modal_title);
				};
				
        plugin.centre_the_modal = function(callback){
	        var modal_ele = $("#" + plugin.settings.modal_div);
					//this part is facebook specfic - if not in facebook then use scrolltop.
					var page_info;
					//hackety hack hack hack for bug - http://bugs.developers.facebook.net/show_bug.cgi?id=19946
					if (document.location.protocol === "https:"){
						$(modal_ele).css({top : "20px"});
		        $(modal_ele).css("left", (($(window).width() - modal_ele.outerWidth()) / 2) + $(window).scrollLeft() + "px");
						callback();
					}
					else{
						FB.Canvas.getPageInfo(function(info){
				        page_info = info;
				        $(modal_ele).css({top : page_info.scrollTop + "px"});
				        $(modal_ele).css("left", (($(window).width() - modal_ele.outerWidth()) / 2) + $(window).scrollLeft() + "px");
				        callback();
				    });	
					}
			    
        };

        plugin.show_overlay = function() {
						if(plugin.settings.overlay == true) plugin.add_overlay();
            $("#" + plugin.settings.overlay_div).show();
						$("#" + plugin.settings.modal_div).show();	
        };

				plugin.append_html_content = function(clicked) {
					if (plugin.settings.html_content != ""){
						var content = "";
						if(typeof(plugin.settings.html_content == "function")){
							content = plugin.settings.html_content.apply(plugin, [clicked]);
						}
						else{
							content = plugin.settings.html_content;
						}
						$("#modal_content").html(content);
						plugin.parse_fbml();
						$('.syrio_active').removeClass('syrio_active');
						$(clicked).addClass('syrio_active');
					}
				};

				plugin.bind_control_clicks = function() {
					
				};
				
				plugin.parse_fbml = function() {
					if (plugin.settings.parse_fbml){
						FB.XFBML.parse(document.getElementById('modal_content'));
					}
				};
				
				plugin.close_all = function() {
					$("#" + plugin.settings.overlay_div).hide();
					$("#" + plugin.settings.modal_div).hide();
					$('.syrio_active').removeClass('syrio_active');
					plugin.settings.after_close.apply(plugin, [plugin.el]);
				};
				
        plugin.init();
    };

    $.fn.syrio = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('syrio')) {
                var plugin = new $.syrio(this, options);
                $(this).data('syrio', plugin);
            }
        });
    };

})(jQuery);