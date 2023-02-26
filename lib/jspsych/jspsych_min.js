var jsPsych=(function(){var core={};var opts={};var timeline;var global_trial_index=0;var current_trial={};var DOM_target;var exp_start_time;core.init=function(options){timeline=null;global_trial_index=0;current_trial={};var default_display_element=$('body');if(default_display_element.length===0){$(document.documentElement).append($('<body>'));default_display_element=$('body');}
var defaults={'display_element':default_display_element,'on_finish':function(data){return undefined;},'on_trial_start':function(){return undefined;},'on_trial_finish':function(){return undefined;},'on_data_update':function(data){return undefined;},'show_progress_bar':false,'auto_preload':true,'max_load_time':30000,'skip_load_check':false,'fullscreen':false,'default_iti':1000};opts=$.extend({},defaults,options);DOM_target=opts.display_element;DOM_target.addClass('jspsych-display-element');timeline=new TimelineNode({timeline:opts.timeline});if(opts.auto_preload){jsPsych.pluginAPI.autoPreload(timeline,startExperiment);}else{startExperiment();}};core.progress=function(){var percent_complete=timeline.percentComplete()
var obj={"total_trials":timeline.length(),"current_trial_global":global_trial_index,"percent_complete":percent_complete};return obj;};core.startTime=function(){return exp_start_time;};core.totalTime=function(){return(new Date()).getTime()-exp_start_time.getTime();};core.getDisplayElement=function(){return DOM_target;};core.finishTrial=function(data){data=typeof data=='undefined'?{}:data;jsPsych.data.write(data);var trial_data=jsPsych.data.getDataByTrialIndex(global_trial_index);if(typeof current_trial.on_finish==='function'){current_trial.on_finish(trial_data);}
opts.on_trial_finish(trial_data);if(typeof current_trial.timing_post_trial=='undefined'){if(opts.default_iti>0){setTimeout(next_trial,opts.default_iti);}else{next_trial();}}else{if(current_trial.timing_post_trial>0){setTimeout(next_trial,current_trial.timing_post_trial);}else{next_trial();}}
function next_trial(){global_trial_index++;var complete=timeline.advance();if(opts.show_progress_bar===true){updateProgressBar();}
if(complete){finishExperiment();return;}
doTrial(timeline.trial());}};core.endExperiment=function(end_message){timeline.end_message=end_message;timeline.end();}
core.endCurrentTimeline=function(){timeline.endActiveNode();}
core.currentTrial=function(){return current_trial;};core.initSettings=function(){return opts;};core.currentTimelineNodeID=function(){return timeline.activeID();};function TimelineNode(parameters,parent,relativeID){var relative_id;var timeline=[];var parent_node;var loop_function;var conditional_function;var trial_data;var randomize_order=false;var current_location=0;var current_iteration=0;var done_flag=false;var self=this;var _construct=function(){parent_node=parent;if(typeof parent=='undefined'){relative_id=0;}
relative_id=relativeID;if(typeof parameters.timeline!=='undefined'){var node_data=$.extend(true,{},parameters);delete node_data.timeline;delete node_data.conditional_function;delete node_data.loop_function;delete node_data.randomize_order;for(var i=0;i<parameters.timeline.length;i++){timeline.push(new TimelineNode($.extend(true,{},node_data,parameters.timeline[i]),self,i));}
if(typeof parameters.loop_function!=='undefined'){loop_function=parameters.loop_function;}
if(typeof parameters.conditional_function!=='undefined'){conditional_function=parameters.conditional_function;}
if(typeof parameters.randomize_order!=='undefined'){randomize_order=parameters.randomize_order;}
if(randomize_order===true){timeline=jsPsych.randomization.shuffle(timeline);}}
else{var trial_type=parameters.type;if(typeof trial_type=='undefined'){console.error('Trial level node is missing the "type" parameter. The parameters for the node are: '+JSON.stringify(parameters));}else if(typeof jsPsych.plugins[trial_type]=='undefined'){console.error('No plugin loaded for trials of type "'+trial_type+'"');}
trial_data=$.extend(true,{},parameters);}}();this.length=function(){var length=0;if(timeline.length>0){for(var i=0;i<timeline.length;i++){length+=timeline[i].length();}}else{return 1;}
return length;}
this.trial=function(){if(timeline.length==0){return trial_data;}else{if(current_location>=timeline.length){return null;}else{return timeline[current_location].trial();}}}
this.advance=function(){if(done_flag){return true;}
if(timeline.length!==0){if(timeline[current_location].advance()){current_location++;if(this.checkCompletion()){return true;}else{while(!this.checkCompletion()&&timeline[current_location].checkCompletion()){current_location++;}
if(this.checkCompletion()){return true;}else{return false;}}}else{return false;}}else{current_location++;done_flag=true;return true;}}
this.checkCompletion=function(){if(done_flag){return true;}
if(timeline.length==0&&current_location>0){done_flag=true;return true;}
if(timeline.length>0){if(current_location>=timeline.length){if(typeof loop_function!=='undefined'){if(loop_function(this.generatedData())){this.reset();}else{done_flag=true;return true;}}else{done_flag=true;return true;}}
if(typeof conditional_function!=='undefined'&&current_location==0){if(conditional_function()){return false;}else{done_flag=true;return true;}}}
return false;}
this.isComplete=function(){return done_flag;}
this.percentComplete=function(){var total_trials=this.length();var completed_trials=0;for(var i=0;i<timeline.length;i++){if(timeline[i].isComplete()){completed_trials+=timeline[i].length();}}
return(completed_trials/total_trials*100)}
this.reset=function(){current_location=0;done_flag=false;if(timeline.length>0){for(var i=0;i<timeline.length;i++){timeline[i].reset();}
if(randomize_order===true){timeline=jsPsych.randomization.shuffle(timeline);}}else{trial_data=$.extend(true,{},parameters);}
current_iteration++;}
this.end=function(){done_flag=true;}
this.endActiveNode=function(){if(timeline.length==0){this.end();parent_node.end();}else{timeline[current_location].endActiveNode();}}
this.ID=function(){var id="";if(typeof parent_node=='undefined'){return"0."+current_iteration;}else{id+=parent_node.ID()+"-";id+=relative_id+"."+current_iteration;return id;}}
this.activeID=function(){if(timeline.length==0){return this.ID();}else{return timeline[current_location].activeID();}}
this.generatedData=function(){return jsPsych.data.getDataByTimelineNode(this.ID());}
this.trialsOfType=function(type){if(timeline.length==0){if(trial_data.type==type){return trial_data;}else{return[];}}else{var trials=[];for(var i=0;i<timeline.length;i++){var t=timeline[i].trialsOfType(type);trials=trials.concat(t);}
return trials;}}}
function startExperiment(){var fullscreen=opts.fullscreen;if(fullscreen){var keyboardNotAllowed=typeof Element!=='undefined'&&'ALLOW_KEYBOARD_INPUT'in Element;if(keyboardNotAllowed){go();}else{DOM_target.append('<div style=""><p>The experiment will launch in fullscreen mode when you click the button below.</p><button id="jspsych-fullscreen-btn" class="jspsych-btn">Launch Experiment</button></div>');$('#jspsych-fullscreen-btn').on('click',function(){var element=document.documentElement;if(element.requestFullscreen){element.requestFullscreen();}else if(element.mozRequestFullScreen){element.mozRequestFullScreen();}else if(element.webkitRequestFullscreen){element.webkitRequestFullscreen();}else if(element.msRequestFullscreen){element.msRequestFullscreen();}
$('#jspsych-fullscreen-btn').off('click');DOM_target.html('');go();});}}else{go();}
function go(){if(opts.show_progress_bar===true){drawProgressBar();}
exp_start_time=new Date();doTrial(timeline.trial());}}
function finishExperiment(){opts.on_finish(jsPsych.data.getData());if(typeof timeline.end_message!=='undefined'){DOM_target.html(timeline.end_message);}
if(document.exitFullscreen){document.exitFullscreen();}else if(document.msExitFullscreen){document.msExitFullscreen();}else if(document.mozCancelFullScreen){document.mozCancelFullScreen();}else if(document.webkitExitFullscreen){document.webkitExitFullscreen();}}
function doTrial(trial){current_trial=trial;opts.on_trial_start();var display_element=DOM_target;if(typeof trial.display_element!=='undefined'){display_element=trial.display_element;}
jsPsych.plugins[trial.type].trial(display_element,trial);}
function drawProgressBar(){$('body').prepend($('<div id="jspsych-progressbar-container"><span>Completion Progress</span><div id="jspsych-progressbar-outer"><div id="jspsych-progressbar-inner"></div></div></div>'));}
function updateProgressBar(){var progress=jsPsych.progress();$('#jspsych-progressbar-inner').css('width',progress.percent_complete+"%");}
return core;})();jsPsych.plugins={};jsPsych.data=(function(){var module={};var allData=[];var dataProperties={};module.getData=function(){return $.extend(true,[],allData);};module.write=function(data_object){var progress=jsPsych.progress();var trial=jsPsych.currentTrial();var default_data={'type':trial.type,'tG':jsPsych.totalTime()};var ext_data_object=$.extend({},default_data,dataProperties,data_object,trial.data);allData.push(ext_data_object);var initSettings=jsPsych.initSettings();initSettings.on_data_update(ext_data_object);};module.addProperties=function(properties){for(var i=0;i<allData.length;i++){for(var key in properties){allData[i][key]=properties[key];}}
dataProperties=$.extend({},dataProperties,properties);};module.addDataToLastTrial=function(data){if(allData.length==0){throw new Error("Cannot add data to last trial - no data recorded so far");}
allData[allData.length-1]=$.extend({},allData[allData.length-1],data);}
module.deleteAllData=function(){allData=[];}
module.dataAsCSV=function(){var dataObj=module.getData();return JSON2CSV(dataObj);};module.dataAsJSON=function(){var dataObj=module.getData();return JSON.stringify(dataObj);};module.localSave=function(filename,format){var data_string;if(format=='JSON'||format=='json'){data_string=JSON.stringify(module.getData());}else if(format=='CSV'||format=='csv'){data_string=module.dataAsCSV();}else{throw new Error('invalid format specified for jsPsych.data.localSave');}
saveTextToFile(data_string,filename);};module.getTrialsOfType=function(trial_type){var data=module.getData();data=flatten(data);var trials=[];for(var i=0;i<data.length;i++){if(data[i].type==trial_type){trials.push(data[i]);}}
return trials;};module.getDataByTimelineNode=function(node_id){var data=module.getData();data=flatten(data);var trials=[];for(var i=0;i<data.length;i++){if(data[i].internal_node_id.slice(0,node_id.length)===node_id){trials.push(data[i]);}}
return trials;};module.getLastTrialData=function(){if(allData.length==0){return{};}
return allData[allData.length-1];};module.getDataByTrialIndex=function(trial_index){for(var i=0;i<allData.length;i++){if(allData[i].trial_index==trial_index){return allData[i];}}
return undefined;}
module.getLastTimelineData=function(){var lasttrial=module.getLastTrialData();var node_id=lasttrial.internal_node_id;if(typeof node_id==='undefined'){return[];}else{var parent_node_id=node_id.substr(0,node_id.lastIndexOf('-'));var lastnodedata=module.getDataByTimelineNode(parent_node_id);return lastnodedata;}}
module.displayData=function(format){format=(typeof format==='undefined')?"json":format.toLowerCase();if(format!="json"&&format!="csv"){console.log('Invalid format declared for displayData function. Using json as default.');format="json";}
var data_string;if(format=='json'){data_string=JSON.stringify(module.getData(),undefined,1);}else{data_string=module.dataAsCSV();}
var display_element=jsPsych.getDisplayElement();display_element.append($('<pre id="jspsych-data-display"></pre>'));$('#jspsych-data-display').text(data_string);};module.urlVariables=function(){return query_string;}
module.getURLVariable=function(whichvar){return query_string[whichvar];}
function saveTextToFile(textstr,filename){var blobToSave=new Blob([textstr],{type:'text/plain'});var blobURL="";if(typeof window.webkitURL!=='undefined'){blobURL=window.webkitURL.createObjectURL(blobToSave);}else{blobURL=window.URL.createObjectURL(blobToSave);}
var display_element=jsPsych.getDisplayElement();display_element.append($('<a>',{id:'jspsych-download-as-text-link',href:blobURL,css:{display:'none'},download:filename,html:'download file'}));$('#jspsych-download-as-text-link')[0].click();}
function JSON2CSV(objArray){var array=typeof objArray!='object'?JSON.parse(objArray):objArray;var line='';var result='';var columns=[];var i=0;for(var j=0;j<array.length;j++){for(var key in array[j]){var keyString=key+"";keyString='"'+keyString.replace(/"/g,'""')+'",';if($.inArray(key,columns)==-1){columns[i]=key;line+=keyString;i++;}}}
line=line.slice(0,-1);result+=line+'\r\n';for(var i=0;i<array.length;i++){var line='';for(var j=0;j<columns.length;j++){var value=(typeof array[i][columns[j]]==='undefined')?'':array[i][columns[j]];var valueString=value+"";line+='"'+valueString.replace(/"/g,'""')+'",';}
line=line.slice(0,-1);result+=line+'\r\n';}
return result;}
var query_string=(function(a){if(a=="")return{};var b={};for(var i=0;i<a.length;++i)
{var p=a[i].split('=',2);if(p.length==1)
b[p[0]]="";else
b[p[0]]=decodeURIComponent(p[1].replace(/\+/g," "));}
return b;})(window.location.search.substr(1).split('&'));return module;})();jsPsych.turk=(function(){var module={};module.turkInfo=function(){var turk={};var param=function(url,name){name=name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var regexS="[\\?&]"+name+"=([^&#]*)";var regex=new RegExp(regexS);var results=regex.exec(url);return(results==null)?"":results[1];};var src=param(window.location.href,"assignmentId")?window.location.href:document.referrer;var keys=["assignmentId","hitId","workerId","turkSubmitTo"];keys.map(function(key){turk[key]=unescape(param(src,key));});turk.previewMode=(turk.assignmentId=="ASSIGNMENT_ID_NOT_AVAILABLE");turk.outsideTurk=(!turk.previewMode&&turk.hitId===""&&turk.assignmentId==""&&turk.workerId=="")
turk_info=turk;return turk;};module.submitToTurk=function(data){var turkInfo=jsPsych.turk.turkInfo();var assignmentId=turkInfo.assignmentId;var turkSubmitTo=turkInfo.turkSubmitTo;if(!assignmentId||!turkSubmitTo)return;var dataString=[];for(var key in data){if(data.hasOwnProperty(key)){dataString.push(key+"="+escape(data[key]));}}
dataString.push("assignmentId="+assignmentId);var url=turkSubmitTo+"/mturk/externalSubmit?"+dataString.join("&");window.location.href=url;};return module;})();jsPsych.randomization=(function(){var module={};module.repeat=function(array,repetitions,unpack){var arr_isArray=Array.isArray(array);var rep_isArray=Array.isArray(repetitions);if(!arr_isArray){if(!rep_isArray){array=[array];repetitions=[repetitions];}else{repetitions=[repetitions[0]];console.log('Unclear parameters given to randomization.repeat. Multiple set sizes specified, but only one item exists to sample. Proceeding using the first set size.');}}else{if(!rep_isArray){var reps=[];for(var i=0;i<array.length;i++){reps.push(repetitions);}
repetitions=reps;}else{if(array.length!=repetitions.length){console.warning('Unclear parameters given to randomization.repeat. Items and repetitions are unequal lengths. Behavior may not be as expected.');if(repetitions.length<array.length){var reps=[];for(var i=0;i<array.length;i++){reps.push(repetitions);}
repetitions=reps;}else{repetitions=repetions.slice(0,array.length);}}}}
var allsamples=[];for(var i=0;i<array.length;i++){for(var j=0;j<repetitions[i];j++){allsamples.push(array[i]);}}
var out=shuffle(allsamples);if(unpack){out=unpackArray(out);}
return out;}
module.shuffle=function(arr){return shuffle(arr);}
module.shuffleNoRepeats=function(arr,equalityTest){if(typeof equalityTest=='undefined'){equalityTest=function(a,b){if(a===b){return true;}else{return false;}}}
var random_shuffle=shuffle(arr);for(var i=0;i<random_shuffle.length-2;i++){if(equalityTest(random_shuffle[i],random_shuffle[i+1])){var random_pick=Math.floor(Math.random()*(random_shuffle.length-2))+1;while(equalityTest(random_shuffle[i+1],random_shuffle[random_pick])||(equalityTest(random_shuffle[i+1],random_shuffle[random_pick+1])||equalityTest(random_shuffle[i+1],random_shuffle[random_pick-1]))){random_pick=Math.floor(Math.random()*(random_shuffle.length-2))+1;}
var new_neighbor=random_shuffle[random_pick];random_shuffle[random_pick]=random_shuffle[i+1];random_shuffle[i+1]=new_neighbor;}}
return random_shuffle;}
module.sample=function(arr,size,withReplacement){if(withReplacement==false){if(size>arr.length){console.error("jsPsych.randomization.sample cannot take a sample "+"larger than the size of the set of items to sample from when "+"sampling without replacement.");}}
var samp=[];var shuff_arr=shuffle(arr);for(var i=0;i<size;i++){if(!withReplacement){samp.push(shuff_arr.pop());}else{samp.push(shuff_arr[Math.floor(Math.random()*shuff_arr.length)]);}}
return samp;}
module.factorial=function(factors,repetitions,unpack){var factorNames=Object.keys(factors);var factor_combinations=[];for(var i=0;i<factors[factorNames[0]].length;i++){factor_combinations.push({});factor_combinations[i][factorNames[0]]=factors[factorNames[0]][i];}
for(var i=1;i<factorNames.length;i++){var toAdd=factors[factorNames[i]];var n=factor_combinations.length;for(var j=0;j<n;j++){var base=factor_combinations[j];for(var k=0;k<toAdd.length;k++){var newpiece={};newpiece[factorNames[i]]=toAdd[k];factor_combinations.push($.extend({},base,newpiece));}}
factor_combinations.splice(0,n);}
repetitions=(typeof repetitions==='undefined')?1:repetitions;var with_repetitions=module.repeat(factor_combinations,repetitions,unpack);return with_repetitions;}
module.randomID=function(length){var result='';var length=(typeof length=='undefined')?32:length;var chars='0123456789abcdefghjklmnopqrstuvwxyz';for(var i=0;i<length;i++){result+=chars[Math.floor(Math.random()*chars.length)];}
return result;}
function unpackArray(array){var out={};for(var i=0;i<array.length;i++){var keys=Object.keys(array[i]);for(var k=0;k<keys.length;k++){if(typeof out[keys[k]]==='undefined'){out[keys[k]]=[];}
out[keys[k]].push(array[i][keys[k]]);}}
return out;}
function shuffle(array){var copy_array=array.slice(0);var m=copy_array.length,t,i;while(m){i=Math.floor(Math.random()*m--);t=copy_array[m];copy_array[m]=copy_array[i];copy_array[i]=t;}
return copy_array;}
return module;})();jsPsych.pluginAPI=(function(){var module={};var keyboard_listeners=[];var held_keys=[];module.getKeyboardResponse=function(parameters){parameters.rt_method=(typeof parameters.rt_method==='undefined')?'date':parameters.rt_method;if(parameters.rt_method!='date'&&parameters.rt_method!='performance'&&parameters.rt_method!='audio'){console.log('Invalid RT method specified in getKeyboardResponse. Defaulting to "date" method.');parameters.rt_method='date';}
var start_time;if(parameters.rt_method=='date'){start_time=(new Date()).getTime();}else if(parameters.rt_method=='performance'){start_time=performance.now();}else if(parameters.rt_method=='audio'){start_time=parameters.audio_context_start_time;}
var listener_id;var listener_function=function(e){var key_time;if(parameters.rt_method=='date'){key_time=(new Date()).getTime();}else if(parameters.rt_method=='performance'){key_time=performance.now();}else if(parameters.rt_method=='audio'){key_time=parameters.audio_context.currentTime}
var valid_response=false;if(typeof parameters.valid_responses==='undefined'||parameters.valid_responses.length===0){valid_response=true;}
for(var i=0;i<parameters.valid_responses.length;i++){if(typeof parameters.valid_responses[i]=='string'){if(typeof keylookup[parameters.valid_responses[i]]!=='undefined'){if(e.which==keylookup[parameters.valid_responses[i]]){valid_response=true;}}else{throw new Error('Invalid key string specified for getKeyboardResponse');}}else if(e.which==parameters.valid_responses[i]){valid_response=true;}}
if(((typeof parameters.allow_held_key=='undefined')||!parameters.allow_held_key)&&valid_response){for(i in held_keys){if(held_keys[i]==e.which){valid_response=false;break;}}}
if(valid_response){held_keys.push(e.which);parameters.callback_function({key:e.which,rt:key_time-start_time});if($.inArray(listener_id,keyboard_listeners)>-1){if(!parameters.persist){module.cancelKeyboardResponse(listener_id);}}
var after_up=function(up){if(up.which==e.which){$(document).off('keyup',after_up);held_keys.splice($.inArray(e.which,held_keys),1);}};$(document).keyup(after_up);}};$(document).keydown(listener_function);listener_id={type:'keydown',fn:listener_function};keyboard_listeners.push(listener_id);return listener_id;};module.cancelKeyboardResponse=function(listener){$(document).off(listener.type,listener.fn);if($.inArray(listener,keyboard_listeners)>-1){keyboard_listeners.splice($.inArray(listener,keyboard_listeners),1);}};module.cancelAllKeyboardResponses=function(){for(var i=0;i<keyboard_listeners.length;i++){$(document).off(keyboard_listeners[i].type,keyboard_listeners[i].fn);}
keyboard_listeners=[];};module.convertKeyCharacterToKeyCode=function(character){var code;if(typeof keylookup[character]!=='undefined'){code=keylookup[character];}
return code;}
var keylookup={'backspace':8,'tab':9,'enter':13,'shift':16,'ctrl':17,'alt':18,'pause':19,'capslock':20,'esc':27,'space':32,'spacebar':32,' ':32,'pageup':33,'pagedown':34,'end':35,'home':36,'leftarrow':37,'uparrow':38,'rightarrow':39,'downarrow':40,'insert':45,'delete':46,'0':48,'1':49,'2':50,'3':51,'4':52,'5':53,'6':54,'7':55,'8':56,'9':57,'a':65,'b':66,'c':67,'d':68,'e':69,'f':70,'g':71,'h':72,'i':73,'j':74,'k':75,'l':76,'m':77,'n':78,'o':79,'p':80,'q':81,'r':82,'s':83,'t':84,'u':85,'v':86,'w':87,'x':88,'y':89,'z':90,'A':65,'B':66,'C':67,'D':68,'E':69,'F':70,'G':71,'H':72,'I':73,'J':74,'K':75,'L':76,'M':77,'N':78,'O':79,'P':80,'Q':81,'R':82,'S':83,'T':84,'U':85,'V':86,'W':87,'X':88,'Y':89,'Z':90,'0numpad':96,'1numpad':97,'2numpad':98,'3numpad':99,'4numpad':100,'5numpad':101,'6numpad':102,'7numpad':103,'8numpad':104,'9numpad':105,'multiply':106,'plus':107,'minus':109,'decimal':110,'divide':111,'F1':112,'F2':113,'F3':114,'F4':115,'F5':116,'F6':117,'F7':118,'F8':119,'F9':120,'F10':121,'F11':122,'F12':123,'=':187,',':188,'.':190,'/':191,'`':192,'[':219,'\\':220,']':221};module.evaluateFunctionParameters=function(trial,protect){var always_protected=['on_finish'];protect=(typeof protect==='undefined')?[]:protect;protect=protect.concat(always_protected);var keys=Object.keys(trial);for(var i=0;i<keys.length;i++){var process=true;for(var j=0;j<protect.length;j++){if(protect[j]==keys[i]){process=false;break;}}
if(typeof trial[keys[i]]=="function"&&process){trial[keys[i]]=trial[keys[i]].call();}}
return trial;};if(window.hasOwnProperty('webkitAudioContext')&&!window.hasOwnProperty('AudioContext')){window.AudioContext=webkitAudioContext;}
var context=(typeof window.AudioContext!=='undefined')?new AudioContext():null;var audio_buffers=[];module.getAudioBuffer=function(audioID){if(audio_buffers[audioID]=='tmp'){console.error('Audio file failed to load in the time alloted.')
return;}
return audio_buffers[audioID];}
var preloads=[];module.preloadAudioFiles=function(files,callback_complete,callback_load){files=flatten(files);var n_loaded=0;var loadfn=(typeof callback_load==='undefined')?function(){}:callback_load;var finishfn=(typeof callback_complete==='undefined')?function(){}:callback_complete;if(files.length==0){finishfn();return;}
function load_audio_file(source){var request=new XMLHttpRequest();request.open('GET',source,true);request.responseType='arraybuffer';request.onload=function(){context.decodeAudioData(request.response,function(buffer){audio_buffers[source]=buffer;n_loaded++;loadfn(n_loaded);if(n_loaded==files.length){finishfn();}},function(){console.error('Error loading audio file: '+bufferID);});}
request.send();}
for(var i=0;i<files.length;i++){var bufferID=files[i];if(typeof audio_buffers[bufferID]!=='undefined'){n_loaded++;loadfn(n_loaded);if(n_loaded==files.length){finishfn();}}
audio_buffers[bufferID]='tmp';load_audio_file(bufferID);}}
module.preloadImages=function(images,callback_complete,callback_load){images=flatten(images);var n_loaded=0;var loadfn=(typeof callback_load==='undefined')?function(){}:callback_load;var finishfn=(typeof callback_complete==='undefined')?function(){}:callback_complete;if(images.length==0){finishfn();return;}
for(var i=0;i<images.length;i++){var img=new Image();img.onload=function(){n_loaded++;loadfn(n_loaded);if(n_loaded==images.length){finishfn();}};img.onerror=function(){n_loaded++;loadfn(n_loaded);if(n_loaded==images.length){finishfn();}}
img.src=images[i];}};module.registerPreload=function(plugin_name,parameter,media_type){if(!(media_type=='audio'||media_type=='image')){console.error('Invalid media_type parameter for jsPsych.pluginAPI.registerPreload. Please check the plugin file.');}
var preload={plugin:plugin_name,parameter:parameter,media_type:media_type}
preloads.push(preload);}
module.autoPreload=function(timeline,callback){var images=[];var audio=[];for(var i=0;i<preloads.length;i++){var type=preloads[i].plugin;var param=preloads[i].parameter;var media=preloads[i].media_type;var trials=timeline.trialsOfType(type);for(var j=0;j<trials.length;j++){if(typeof trials[j][param]!=='undefined'){if(media=='image'){images=images.concat(flatten([trials[j][param]]));}else if(media=='audio'){audio=audio.concat(flatten([trials[j][param]]));}}}}
module.preloadImages(images,function(){module.preloadAudioFiles(audio,function(){callback();});});}
return module;})();function flatten(arr,out){out=(typeof out==='undefined')?[]:out;for(var i=0;i<arr.length;i++){if(Array.isArray(arr[i])){flatten(arr[i],out);}else{out.push(arr[i]);}}
return out;}