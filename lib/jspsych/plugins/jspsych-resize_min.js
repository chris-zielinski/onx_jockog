jsPsych.plugins["resize"]=(function(){var plugin={};plugin.trial=function(display_element,trial){trial.cont_key='mouse';trial.timing_post_trial=600;trial.timing_stim=10000;var max_time=trial.timing_stim;var iniw=$(window).width();var nores=1;var after_click=function(){display_element.html('');display_element.unbind('click',after_click);jsPsych.finishTrial();};function is_resize(ini_width){var cur_width=$(window).width();if((cur_width!=ini_width)&&(cur_width>screen.width-150)){var rs=true;}else{var rs=false;}
return rs;}
var resize_done=function(){if(is_resize(iniw)){var $rs_msg=$('<p/>').html("Merci ! Cliquez n'importe où sur la page pour continuer...").addClass('large');display_element.append($rs_msg);display_element.click(after_click);$(window).off("resize");nores=0;}};var not_resize=function(){if(nores){var $nors_msg=$('<p/>').html("Pour continuer même si la page n'est pas en plein écran, cliquez n'importe où sur la page...").addClass('large');display_element.append($nors_msg);display_element.click(after_click);$(window).off("resize");}};display_element.html(trial.text);$(window).resize(resize_done);setTimeout(not_resize,max_time);};return plugin;})();