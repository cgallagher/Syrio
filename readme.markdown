#Are you for Syrio?

##Usage

Add the following to your document head
```
<link href="stylesheets/syrio.css" media="screen" rel="stylesheet" type="text/css" /> 
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js" type="text/javascript"></script> 
<script src="javascripts/syrio.js" type="text/javascript"></script>
```

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