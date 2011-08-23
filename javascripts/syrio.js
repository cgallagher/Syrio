// jQuery Plugin for really basic modal window effects
// Syrio - The First Sword to the Sealord of Braavos
// version 0.1.1, 09 August 2011
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
						html_content: ""
        }

        var plugin = this;
        plugin.settings = {}

        var $element = $(element),
             element = element;
        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            plugin.centre_the_modal(function(){
							plugin.close_controls();
							plugin.set_modal_title();
							plugin.show_overlay();
							plugin.append_html_content();
							plugin.bind_control_clicks();
							plugin.parse_fbml();
						});
        },

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
				},
				
				plugin.set_modal_title = function(){
					$("#syrio_title").html(plugin.settings.modal_title);
				},
				
        plugin.centre_the_modal = function(callback){
	        var modal_ele = $("#" + plugin.settings.modal_div);
					//this part is facebook specfic - if not in facebook then use scrolltop.
					var page_info;
			    FB.Canvas.getPageInfo(function(info){
			        page_info = info;
			        $(modal_ele).css({top : page_info.scrollTop + "px"});
			        $(modal_ele).css("left", (($(window).width() - modal_ele.outerWidth()) / 2) + $(window).scrollLeft() + "px");
			        callback();
			    });
        },

        plugin.show_overlay = function() {
            $("#" + plugin.settings.overlay_div).show();
						$("#" + plugin.settings.modal_div).show();	
        },

				plugin.append_html_content = function() {
					if (plugin.settings.html_content != ""){
						$("#modal_content").html(plugin.settings.html_content);
					}
					else{
						var whatdowesaytothegodsofdeath = '<img src="http://gifninja.com/animatedgifs/155468/syrio-forel.gif" />';
						$("#modal_content").html(whatdowesaytothegodsofdeath);
					}
				},

				plugin.bind_control_clicks = function() {
					
				},
				
				plugin.parse_fbml = function() {
					if (plugin.settings.parse_fbml){
						FB.XFBML.parse(document.getElementById('modal_content'));
					}
				},
				
				plugin.close_all = function() {
					$("#" + plugin.settings.overlay_div).hide();
					$("#" + plugin.settings.modal_div).hide();
				}
        plugin.init();
    }

    $.fn.syrio = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('syrio')) {
                var plugin = new $.syrio(this, options);
                $(this).data('syrio', plugin);
            }
        });
    }

})(jQuery);