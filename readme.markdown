#Are you for Syrio?

##Usage

Add the following to your document head

  &lt;link href=&quot;stylesheets/syrio.css&quot; media=&quot;screen&quot; rel=&quot;stylesheet&quot; type=&quot;text/css&quot; /&gt; 
  &lt;script src=&quot;https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt; 
  &lt;script src=&quot;javascripts/syrio.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;


Then in your application.js or an inline script tag in your document head
```
var options = {
		close_enabled: true,
		modal_title: "",
		parse_fbml: false,
		html_content: "",
		overlay: false,
		after_open: function(clicked){ },
		after_close: function(clicked){ },
		show_nav: false
};
$.syrio("button.modal", options);
```