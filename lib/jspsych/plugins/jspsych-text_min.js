jsPsych.plugins["text"]=(function(){var plugin={};plugin.trial=function(display_element,trial){trial.cont_key=trial.cont_key||[];trial.timing_post_trial=trial.timing_post_trial||-1;trial.timing_stim=trial.timing_stim||-1;trial.progbar=(typeof trial.progbarstr==='undefined')?"":trial.progbarstr;trial=jsPsych.pluginAPI.evaluateFunctionParameters(trial);display_element.html(trial.text);display_element.prepend(trial.progbar);var after_response=function(info){display_element.html('');jsPsych.finishTrial({"rt":info.rt,"kp":info.key});};if(trial.timing_stim>0){setTimeout(function(){display_element.html('');jsPsych.finishTrial();},trial.timing_stim);}else{if(trial.cont_key=='mouse'){var mouse_listener=function(){var rt=(new Date()).getTime()-start_time;display_element.unbind('click',mouse_listener);after_response({"key":"mouse","rt":rt});};var start_time=(new Date()).getTime();display_element.click(mouse_listener);}else{jsPsych.pluginAPI.getKeyboardResponse({callback_function:after_response,valid_responses:trial.cont_key,rt_method:'date',persist:false,allow_held_key:false});}}};return plugin;})();