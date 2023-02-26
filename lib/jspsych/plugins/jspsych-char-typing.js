/** 
* jspsych-char-typing -- jsPsych plugin for AppReg experiment
* Adapted from Josh de Leeuw plugin : jspsych-multi-stim-multi-response
*
* Display a series of characters and record typing times of the responses 
*
* Plugin parameters :
* --------------------
*--- char_stim : string holding all the chars to be display one by one, successively
*--- timing_interstim : duration between two stimuli (in ms) [ default : O ms ]
*
* Output data :
*---------------
	"stim": the initial char list (char_stim string)
	"kc": the subject's responses concatenated in a unique char string,
	"rt": array of the response times 
	"nvld": number of valid responses
*
*
* jsPsych documentation: docs.jspsych.org
* de Leeuw, J. R. (2014). jsPsych: A JavaScript library for creating behavioral 
* experiments in a Web browser. Behavior research methods, 1-12

* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
*
**/

jsPsych.plugins["char-typing"] = (function() {

	var plugin = {};

	plugin.trial = function(display_element, trial) {

		
		trial.timing_post_trial = (typeof trial.timing_interstim === 'undefined') ? 0 : trial.timing_interstim;
		
		var charlist = trial.char_stim;
		var Nchar = charlist.length;
		

		/*** CREx simplified Keyboard listener to improve performance (some fixed parameters) **/
		/** Adapted from the getKeyboardResponse function of jsPsych (pluginAPI)*/

		var getkb = function(callback_function){
			
			var listener_function = function(e) {
				// Performance gives time in ms with microsecond precision
				// round to keep only ms
				var key_time = performance.now();	
				$stimdiv.html('');
				setTimeout(function(){						
						callback_function({
						key: e.which,
						rt: Math.round(key_time - start_time) 
					});
					}, 100);

					var after_up = function(up) {
						if (up.which == e.which) {
							$(document).off('keyup', after_up); 
						}
					};
					$(document).keyup(after_up);
			};
			$(document).keydown(listener_function);  
			return {type: 'keydown', fn: listener_function}
		};
		
		
		// Clear the display and disable cursor visibility
		
		display_element.html('');	
		display_element.removeClass('bg_og').addClass('hidecursor bg_grey');
		
		var $stimdiv = $('<div/>')					
					.attr('style','padding-bottom: 10px')
					.attr('id', 'jspsych-char-stimulus');
		display_element.append($stimdiv);
		
		function display_char(chardisp, cb_func){
			$stimdiv.html(chardisp);
			return performance.now();
		}

		// display stimulus
		var istim = 0;			
		// array for response times 
		var responseTimes = [];

		// array for response keys (char form)
		var responseChars = "";

		var responseValidity = [];
		
		// function to end trial when it is time
		var end_trial = function() {


			// kill keyboard listeners
			// alert(keyboard_listeners)
			jsPsych.pluginAPI.cancelKeyboardResponse(kb_listener);
			
			// Number of correct responses
			var nval = responseValidity.reduce(function(ss,x){return (ss+x);}, 0);

			// gather the data to store for the trial
			var trial_data = {
				"stim": charlist,
				"kc": responseChars,
				"rt": JSON.stringify(responseTimes),
				"nvld": nval
			};

			// clear the display
			display_element.html('');
			
			// move on to the next trial
			// In the new version of jspsych, if timing_post_trial exists, 
			// the related time gap is added inside jspsych finishTrial module			
			jsPsych.finishTrial(trial_data);
			
		};

		// function to handle responses by the subject		
		var after_response = function(info) {
			if (responseTimes.length <= Nchar){
				responseTimes.push(info.rt);
				var rchar = String.fromCharCode(info.key);
				responseChars = responseChars + rchar;
				if (rchar == charlist[istim]){
					responseValidity.push(1);
				}else{
					responseValidity.push(0);
				}
				// Display the next character, return the associated start_time
				istim++;
				if (istim + 1 <= Nchar){
					start_time = display_char(charlist[istim]);

				}else{
					display_element.removeClass('hidecursor bg_grey');
					end_trial();
				}
			}else{					
				// Check for number of correct answers					
				end_trial();
			}; 
		};

		// Initialize
		// Display the first character, return the associated start_time
		// start_time is used be the keyboard listener (getkb function) to compute the reaction time 
		// (= from the display time, start_time) to the pressed key time)
		var start_time = display_char(charlist[0]);
		// Start the keyboard listener
		var kb_listener = getkb(after_response);
	};

	return plugin;
})();
