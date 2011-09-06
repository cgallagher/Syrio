if(!com) var com = {};
if(!com.betapond) com.betapond = {};

com.betapond.photo_claim = function(options){
	
	var defaults = {
	};
	var _t = this;
	this.settings = $.extend({}, defaults, options);
	
	this.current_photo = null;
	this.photosets = $('.photosets li.photoset');
	this.photos = $('.photos a.photo[rel=photoset]');
	this.claim_form = $('.photos form');
	this.claim_button = $('<button class="claim_button">'+I18n.claim_button_text+'</button>').click(function(){_t.claim_current_photo();});
	this.entry_form = $('.new_entry form');
	this.time_form = $('form#filter_time');
	this.form_errors = [];
	//init fbapp
	this.fb = new com.betapond.bookface({perms:Settings.facebook.permissions.split(/, ?/)});
	this.fb.init(function(){ _t.init(); });
};

com.betapond.photo_claim.prototype = {
	init: function(){
		_t = this;
		
		$('a.vote').click(function(e){e.preventDefault(); _t.vote(this);});
		
		$.syrio('.photos a.photo', {
			html_content: function(clicked){ return _t.modal_content_for(clicked) },
			parse_fbml:true,
			overlay: false,
			after_open: function(el){
				_t.current_photo = el;
			}
		});
		
		this.entry_form.submit(function(){ return _t.validate_entry_form(this); });
		
		this.time_form.find('#time').change(function(){
			_t.time_form.submit();
		});
		
		$("#close_flash").click(function(){
			$("#flash_messages").fadeOut("slow");
		});
		
		
		_t.share_claimed_photo();
		
	},
	
	modal_content_for: function(element){
		var photo = $(element);
		if(photo.hasClass('claimed')){
			var photo_id = element.id.match(/photo_([0-9]+)/)[1];
			var response = null;
			$.ajax({url:'/entries/' + photo_id + '?nolayout=true', async:false, success: function(data){
				response = data;
			}});
			return response;
		}
		else{
			var content = $('<div />').addClass('modal_claim');
			var image = $('<img width="500" height="333"/>').attr('src', photo.attr('href'));
			var title = $('<h3 />').text(photo.find('span').text());
			var claim_text = $('<div class="claim_text" />').html(I18n.claim_text);
			return content.append(image, title, claim_text, this.claim_button);
		}
	},
	
	share_claimed_photo: function(){
		var _t = this;
		var cta_link = $("#photo_link").val();
		var thumbnail_src = $("#thumbnail_src").val();
		
		if ($('#share_my_photo').val() === "true"){
			FB.ui(
	    {
	      method: 'stream.publish',
	      attachment: {
	        name: I18n.claimed.title,
	        caption: I18n.claimed.caption,
	        description: I18n.claimed.description,
	        href: cta_link,
	        media: [
	          {
	            type: 'image',
	            href: cta_link,
	            src: thumbnail_src
	          }
	        ]
	      },
	      action_links: [
	        { 
						text: I18n.claimed.cta_label, 
						href: cta_link
					}
	      ]
	    },
	    function() {
	    });
		}
	},
	
	claim_current_photo: function(){
		var photo_id = this.current_photo.id.match(/photo_([0-9]+)/)[1];
		this.claim_form.get(0).photo_id.value = photo_id;
		if( confirm(I18n.claim_confirm_message)){
			var _t = this;
			this.fb.while_connected(function(){
				var user_field = $('<input type="hidden" name="user[fbid]" />').val(_t.fb.login.session.uid);
				var access_token = $('<input type="hidden" name="user[access_token]" />').val(_t.fb.login.session.access_token);
				_t.claim_form.append(user_field, access_token);
				var spinner = new Spinner({
				  lines: 12, // The number of lines to draw
				  length: 20, // The length of each line
				  width: 7, // The line thickness
				  radius: 10, // The radius of the inner circle
				  color: '#fff', // #rbg or #rrggbb
				  speed: 1, // Rounds per second
				  trail: 100, // Afterglow percentage
				  shadow: true // Whether to render a shadow
				}).spin();
				var spinner_container = $("<div class='spinner' />");
				$('#modal_content').append(spinner_container);
				spinner_container.get(0).appendChild(spinner.el);
				$('.claim_button').attr("disabled", "disabled");
				_t.claim_form.submit();
			});
		}
	},
	
	validate_entry_form: function(form){
		this.form_errors = [];
		$(form).find('input[name=_method]').remove();
		return (this.form_errors.length > 0) ? false : true;
	},
	
	vote: function(el){
		var _t = this;
		var link = $(el);
		var photo_id = link.attr('rel').match(/photo_([0-9]+)/)[1];
		var phase = '';
		var matches = false;
		if(matches = link.attr('class').match(/phase_[0-9]+/)){
			phase = matches[0];
			this.fb.while_connected(
				function(){
					var params = {
						phase: phase,
						fbid: _t.fb.login.session.uid
					};
					$.post('/photos/'+photo_id+'/vote', params, function(data){ _t.after_vote(data, link, photo_id);});
				},
				{with_permissions:[]} //basic perms needed only
			);
		}
		else{
			alert('Sorry, there was an error. Your vote could not be counted. - Competition Phase Error')
			return false;
		}
	},
	
	after_vote: function(data, link, photo_id){
		if(data.status == 'error'){
			alert(data.error);
		}
		else{
			link.addClass('voted').unbind('click');
			link.find('#photo_' + photo_id + '_votes_count').text(data.votes);
		}
	}
};