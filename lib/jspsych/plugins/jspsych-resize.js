/** jspsych-resize -- jsPsych plugin for CREx online experiment
*
* Specific plugin for CREx experiments to ask for resizing window in full screen at 
* the beginning of the experiment, by clicking on the standard resize button of the browser page. 
* This method is chosen over those of jsPsych (fullscreen), since it allows to let the close window button visible
* for the participant (total full screen require F11 press which is not obvious for all).
*
*
* jsPsych documentation: docs.jspsych.org
* de Leeuw, J. R. (2014). jsPsych: A JavaScript library for creating behavioral 
* experiments in a Web browser. Behavior research methods, 1-12
*
* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/

jsPsych.plugins["resize"] = (function() {

        var plugin = {};

        plugin.trial = function(display_element, trial) {

            trial.cont_key = 'mouse';
			trial.timing_post_trial = 600;
			trial.timing_stim = 10000;
			
			var max_time = trial.timing_stim;
			
			// Attach an event to the resize action
			var iniw = $(window).width(); 
			
			var nores = 1;
			
			//''''''''''
			//'''''''''' Set of functions to check for manual window resize
			//''''''''''
			
			// Clear the display, remove the mouse listener and  finish trial
            var after_click = function() {	
				display_element.html(''); 			
				display_element.unbind('click', after_click);                
                jsPsych.finishTrial();                
            };	
			
			// Compare window size with initial size to determine if resize is well done
			function is_resize(ini_width){
				var cur_width = $(window).width();
				if ((cur_width != ini_width) && (cur_width > screen.width - 150)){
					var rs = true;
				}else{
					var rs = false;
				}
				return rs;
			}	
			
			// Function to excecute when resize is done
			var resize_done = function (){
				if (is_resize(iniw)){
					// Add message to start experiment by clicking on the page
					var $rs_msg = $('<p/>')
						.html("Merci ! Cliquez n'importe où sur la page pour continuer...")
						.addClass('large');
				
					display_element.append($rs_msg);				
					
					// Add the mouse click listener 
					display_element.click(after_click);				
					
					// Remove resize listener (even if full size is not reached for obscure raisons
					$ (window ).off("resize");
					
					nores = 0;
				}
			};

			// Launch experiment anyway after max_time is reached
			var not_resize = function(){
				// Add message to start experiment by clicking on the page
				if (nores){
					var $nors_msg = $('<p/>')
						.html("Pour continuer même si la page n'est pas en plein écran, cliquez n'importe où sur la page...")
						.addClass('large');
				
					display_element.append($nors_msg);				
					
					// Add the mouse click listener 
					display_element.click(after_click);				
					
					// Remove resize listener (even if full size is not reached for obscure raisons
					$(window ).off("resize");	
				}
			};
			
			//''''''''''
			//''''''''''  Go !
			//''''''''''
			
			// Display the message to ask to resize windows
            display_element.html(trial.text);
			
			// Attach resize listener (easy with jQuery !)
			$( window ).resize(resize_done);	
			
			// Set the time out for starting experiment even if page is not resized
			setTimeout(not_resize, max_time);
			
        };

	return plugin;
})();
