/** jspsych-text.js plugin adapted from the original jsPsych plugin for CREx online experiments
 *
 * This plugin displays text (including HTML formatted strings) during the experiment.
 * Use it to show instructions, provide performance feedback, etc...
 *
* jsPsych documentation: docs.jspsych.org
* de Leeuw, J. R. (2014). jsPsych: A JavaScript library for creating behavioral 
* experiments in a Web browser. Behavior research methods, 1-12
*
* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/


jsPsych.plugins["text"] = (function() {

	var plugin = {};


	plugin.trial = function(display_element, trial) {
			
		// Check for parameters
		// Required response to end trial (default: all keys)
		trial.cont_key = trial.cont_key || []; 
		
		// Timing_post_trial parameter (otherwise, the default value is 1000 in jspsych.js)
		trial.timing_post_trial = trial.timing_post_trial || -1;	
		
		// CREx add 150903 -- display text during the duration timing_stim
		// (without waiting for keyboard or mouse response) - then go to the next trial
		trial.timing_stim = trial.timing_stim || -1; 
		
		// Progress bar
		trial.progbar = (typeof trial.progbarstr === 'undefined') ? "" : trial.progbarstr;

		// Evaluates functions
		trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

		// Display the text
		display_element.html(trial.text);
		
		// Add progress bar
		display_element.prepend(trial.progbar);
		
		//----  After response : clear the display and terminate trial (only if response is expected)
		var after_response = function(info) {
			// Clear the display
			display_element.html(''); 
			// Finish trial and write data
			jsPsych.finishTrial({"rt": info.rt,"kp": info.key});
		};
		
		//---- FinishTrial without recording anything if timing is set 
		if (trial.timing_stim > 0) {
			setTimeout(function() {
				display_element.html('');
				jsPsych.finishTrial();
					}, trial.timing_stim);
		}else{		
		//---- Start listeners (mouse or keyboard)
			
			//-- mouse click required
			if (trial.cont_key == 'mouse') {
				// Mouse listener function
				var mouse_listener = function() {
					var rt = (new Date()).getTime() - start_time;
					// Disable mouse listener
					display_element.unbind('click', mouse_listener);
					// Finish trial and write data
					after_response({"key": "mouse", "rt": rt});
				};	
				
				var start_time = (new Date()).getTime();
				// Start mouse listener
				display_element.click(mouse_listener);
				
			//-- keyboard key required	
			} else {
				// Start keyboard listener
				// (will be remove by jsPsych after response because persiste==false)
				jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: after_response,
					valid_responses: trial.cont_key,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				}); 
			}
		}
	};
	return plugin;
})();
