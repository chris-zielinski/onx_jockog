/**
* jspsych-countdown -- jsPsych plugin for AppReg experiment
* Adapted from http://stackoverflow.com/questions/16299529/settimeout-javascript-countdown-timer-with-delay
*
*------
* Input parameters
* -- ncount: start number to count (decreasing order) [ default : 3 ]
* -- interval_ms: duration to show each countdown number in ms [ default : 800 ms]
* -- timing_after_ms : duration for waiting at the end of the countdown before go on to the next task
* 	[ default: 1000 ms ]
* 
* The countdown layout is define in the jspsych.css file.
*
* jsPsych documentation: docs.jspsych.org
* de Leeuw, J. R. (2014). jsPsych: A JavaScript library for creating behavioral 
* experiments in a Web browser. Behavior research methods, 1-12
*
* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
*
**/

jsPsych.plugins["countdown"] = (function() {

	var plugin = {};
	
	// Countdown function
	// 	$el : div element to display the count
	// 	n : count number
	//	intms : time interval between the count
	function countdown($el, n, intms) {
		(function loop() {
			// Initialize the size of the countdown number
			$el.css("font-size", "120px");
			
			// jQuery animate function is used to change the size of the countdown number
			$el.html(n).animate({fontSize: "160px"}, 
				{
					duration: intms, 
					complete: function(){
						if (n--) {
							if (n==0) {
								n = 'Go !';
							}
							setTimeout(loop, 50);
						}else{
							jsPsych.finishTrial();	
						}
					}		
				}	
			);
		})();
	}

	plugin.trial = function(display_element, trial) {
		
		//------ Check for input parameters
		
		// Start count number
		trial.ncount = (typeof trial.ncount === 'undefined') ? 3 : trial.ncount;
		
		// Interval between successive count (in ms)
		trial.interval_ms = (typeof trial.interval_ms === 'undefined') ? 800 : trial.interval_ms;
		
		// Duration to wait after the end of the countdown (in ms)
		// jsPsych automatically considers timing_post_trial parameter when finishTrial method is called
		trial.timing_post_trial = (typeof trial.timing_after_ms === 'undefined') ? 1000 : trial.timing_after_ms; 	
	
		// Clear the display and disable cursor visibility		
		display_element.html('');	
		display_element.removeClass('bg_og').addClass('hidecursor bg_grey');
		
		// Define the div that will hold the countdown
		var $numdiv = $('<div/>')
					.attr('id', 'countdiv')
					.addClass('initial'); 
		
		display_element.append($numdiv);
		
		//------ Start the countdown
		countdown($numdiv, trial.ncount, trial.interval_ms);
	};

	return plugin;
})();
