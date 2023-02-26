/** Spy to get JavaScript error that is occuring in the user's browser
https://github.com/posabsolute/jQuery-Error-Handler-Plugin

Set your e-mail address inside jserrorhandler.php script

Adapted for AppReg Experiment

* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/

(function( $ ){
  $.fn.jsErrorHandler = function(options) {
  	
	var settings = {
		from: "AppReg <www-data@blri.fr>",
		website: document.domain
	}
	if (options) $.extend(settings, options);

 
    window.onerror = function (msg, url, line) {
		
		$.ajax({
			type:"GET",
			cache:false,
			url:"js/jserrorhandler.php",
			data: $.param({'message':msg, 'url': url, userAgent: navigator.userAgent, 'line': line, 'from':settings.from, 'website': settings.website}),
			success: function(test){
				if(window.console) console.log("Report sent about the javascript error")
			}
		})
		
		/* Add an error message to the page */
		var emsg = "<span class='large center-content'><p>Merci d'avoir bien voulu participer !</p>"+
					"<p>L'expérience ne se lance malheureusement pas correctement depuis votre navigateur.</p>"+
					"<p>Un rapport d'erreur a été envoyé pour nous permettre de corriger les scripts... </p>"+
					"<p>N'hésitez pas à retenter plus tard ! </p> </span>";
		$("body").html(emsg);	

	    return true;
	}
  };
})( jQuery );



