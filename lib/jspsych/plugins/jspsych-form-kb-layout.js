/**
* jspsych-form-kb-layout -- jsPsych plugin for AppReg experiment
* Adapted from jspsych-survey-text plugin 
*
* Very special form page to select the keyboard layout.
*
Special layout object parameters => params.layout
layobj hold subobjects to define layout names and images (one per form row)
Each row is composed from a radio button with the layout label string.
Optionally, an image is showing at the right of the layout choice to illustrate the layout.
An input field can be set too for asking for the specific layout that would not appeared
as radio choices.
 Subobject fields : 
 -- opt_id : the id for the radio choice 
 -- opt_str : the associated string label that is displayed at the right of the radio button
 
 If associated image and mask to display : 
 -- img : path of the associated layout image
 -- msk : path of the potential mask that will be showed when radio choice is hovered

 If associated input field with free answer to be displayed : 
 -- opt_input : an object with field :
		--- quest : question associated with the input field
 		--- input_char : width of the input field in number of characters
 		--- is_conditional : if the input field is to be displayed conditionally, when the associated radio button is selected (true or false) [ default: false ]

Example :
	
	var kb_layout = [
		{
			opt_id: 'az',
			opt_str: 'Azerty',
			img: 'img/ar_lay_az.png', 
			msk: 'img/ar_lay_az_msk.png'
		}, 
		{
			opt_id: 'qw',
			opt_str: 'Qwerty',
			img: 'img/ar_lay_qw.png', 
			msk: 'img/ar_lay_qw_msk.png'
		},
		{
			opt_id: 'ot',
			opt_str: 'Autre',
			opt_input :								
			{
			quest : "Précisez :",
			input_nchar: 20,
			is_conditional: true
			}
		}
	];
		
Input parameters to call the plugin by jsPsych :
		
		var form_kb = {
			type: 'form-kb-layout',
			idname: "kb_lay",
			quest: "<span class='blue'>Enfin, pourriez-vous préciser le type de clavier que vous utilisez actuellement ?</span>",
			layout: kb_layout
		};

	- idname : global name of the form element [default : "Qspec_form"]
	- quest : question associated to checkbox elements [default : ""]
	- submit : text to display on the submit button [default : "Valider"]
*
*---
*	
* jsPsych documentation: docs.jspsych.org
* de Leeuw, J. R. (2014). jsPsych: A JavaScript library for creating behavioral 
* experiments in a Web browser. Behavior research methods, 1-12
*
* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/

jsPsych.plugins["form-kb-layout"] = (function() {
	
	var plugin = {};

	function define_trial(params) {
		// Check for input parameters 
		
		// NO Preamble
		// preamble : potential preambule to display [default : ""]
		/*var preamb = (typeof params.preamble == 'undefined') ? "" : params.preamble;*/
		
		// General id of the layout form
		var idn = (typeof params.idname == 'undefined')  ? "kblay_form" : params.idname;
		
		// Question for selecting the keyboard layout
		var qstr = (typeof params.quest == 'undefined')  ? "" : params.quest;
		
		// Progress bar
		var pbar = (typeof params.progbarstr == 'undefined') ? "" : params.progbarstr;	
		
		// Submit button string
		var subm = (typeof params.submit == 'undefined') ? "Valider" : params.submit;
		
		// Check for layout options
		var lay = params.layout;		
		var nlay = lay.length;
	
		var formlay = [];
		// Parameters are checked for each button radio choices
		for (var i = 0; i < nlay; i++){
			var sublay = lay[i];
			// choice id
			var oid = (typeof sublay.opt_id == 'undefined') ? ("lay_" + i) : sublay.opt_id;
			// choice string
			var ostr = (typeof sublay.opt_str == 'undefined') ? ("Layout "+ i) : sublay.opt_str;
			// display associated image flag
			var is_img = (typeof sublay.img == 'undefined') ? false : true;
			// image path
			var imgpath= (typeof sublay.img == 'undefined') ? "" : sublay.img;			
			// display associated image mask flag
			var is_msk = (typeof sublay.msk == 'undefined') ? false : true;
			// mask path
			var mskpath= (typeof sublay.msk == 'undefined') ? "" : sublay.msk;
			// display associated input field flag
			var is_inp = (typeof sublay.opt_input == 'undefined') ? false : true;
			
			// Check for input object parameters
			var inp_obj = [];
			var optfunc = 0;
			var condclass = "";
			// If input field to put near the radio choice
			if (is_inp){
				
				var io = sublay.opt_input;
				var nch = (typeof io.input_char == 'undefined') ? 20 : io.input_char; 
				var ishid = (typeof io.is_conditional == 'undefined') ? false : true;
				
				if (ishid){
					optfunc = 1;
					condclass = 'hiderow cond_' + oid;
				}
				
				inp_obj = {
					quest: (typeof io.quest == 'undefined') ? "Précisez : " : io.quest,
					inpwidth: Math.floor(nch*0.7), 
					ishidden : ishid,
					condclass: condclass		
				};		
			}
			
			formlay.push({
				opt_str : ostr,
				opt_id : oid,
				is_img: is_img,
				img_path: imgpath,
				is_msk: is_msk,
				msk_path: mskpath,
				is_inp: is_inp,
				inp_obj: inp_obj,
				optfunc: optfunc
			});	
		}
		// preamble : preamb,
		var	trials = {
				progbar : pbar,
				idname : idn,
				quest : qstr,
				layout: formlay,
				submit : subm
		};
		return trials;
	}
	
	// Special function to add onclick event to option that involved new form rows to be
	// hidden or visible depending on the user's option choice (conditionnal rows)
	function addoptfunc(isfunc, $opt) {
		if (isfunc === 1) {	
			// Add onclick event to the body - each time something is selected, check 
			// if the radio button value that implies to show or hide conditional class 
			// is selected or not
			// Get the radio name (same for each radio related to the same question)
			var rnam = $opt.attr('name');
			var idtrig = $opt.attr('id');
			$opt.click( function(){	
				$(".cond_" + idtrig).removeClass("hiderow");
				
				$('[name='+ rnam + ']' ).each( function(){
					var idopt = $(this).attr('id');
					$(this).click(function(){
						if ($('#'+idtrig).is(":checked") == true){
							$(".cond_" + idtrig).removeClass("hiderow");
						}else{
							$(".cond_" + idtrig).addClass("hiderow");
						}
					});
				});					
			});
		}
		return $opt;
	}

	
	var layout_form = function(trial, display_element){
		var lay = {};
		var idname = trial.idname;
		
		lay.init = function (){
			// Clear the display
			display_element.html(' ');
			
			// Add progress bar
			display_element.append(trial.progbar);
			
			// Show preamble text
			var $preamb = $('<div/>')
				.attr("id","preamb")
				.html(trial.preamble)
				.addClass("form_preamble");	
				
			// display_element.append($preamb);

			var $formdiv = $('<div/>')
				.attr("id","theform")
				.css("text-align","left")
				.addClass("kbform_div");	
				
			display_element.append($formdiv);
			
			// Add questions and radio buttons
			
			// Question as span element
			var $quest =  $('<span/>')
				.addClass("kbform_quest")
				.html(trial.quest);	
			
			$('#theform').append($quest);				
		};
		
		lay.disp_radio = function(elm){
			
			var $rowdiv = $('<div/>')
				.attr('id', 'rowdiv_' + elm.opt_id)
				.addClass('kbform_row');
			
			var $radiv = $('<div/>')
				.addClass('kbform_rad');
			
			// Labels for each options
			var $opt_lab = $('<label/>')
				.attr("id", "lab" + elm.opt_id)
				.attr("for", elm.opt_id)
				.html(elm.opt_str)
				.addClass("radio_lab");
				//.addClass('blue');	
			
			// And associated button or checkbox
			var $opt_inp = $('<input/>')
				.attr("type", "radio")
				.attr("id", elm.opt_id)
				.attr("name", idname)
				.attr("value", elm.opt_id)
				.addClass("radio_but")
				.addClass("form_resp");	
			
			// Add conditional function (selected radio => new form element appear 
			// with class = 'cond_' + elm.opt_id) 			
			$opt_inp = addoptfunc(elm.optfunc, $opt_inp);			
			
			$radiv.append($opt_lab);
			$rowdiv.append($radiv);	
			$('#theform').append($rowdiv);
			// Prepend to have radio in the left
			$('#lab' + elm.opt_id).prepend($opt_inp);
		};
		
		// Add layout image
		lay.disp_img = function(imgpath, idrad){
			var $imgcont = $('<div/>')
				.addClass('kbform_img');
				
			var $lay_img = $('<img/>')
				.addClass("layout_img lay_main")
				.attr('data-idrad', idrad)
				.attr("id", "img_" + idrad)
				.attr("src", imgpath);
				// Put the image inside a label element in order to be able to select the radio button associated
				// with the image by clicking on the image (for attribute = value of the radio = id)
			var $labimg = $('<label/>')
				.attr("for", idrad);
				
			$labimg.append($lay_img);				
			$imgcont.append($labimg);			
			$('#rowdiv_' + idrad).append($imgcont);
		};
		
		// Add layout mask
		lay.disp_msk = function(mskpath, idrad){
			
			var $imgcont = $('<div/>')
				.addClass('kbform_img');
				
			var $mask = $('<img/>')
				.addClass("layout_img lay_msk")				
				.attr("id", "msk_" + idrad)
				.attr("src", mskpath);
				
			// Put the image inside a label element in order to be able to select the radio button associated
			// with the image by clicking on the image (for attribute = value of the radio = id)
			var $labmsk = $('<label/>')
				.attr("for", idrad);
				
			$labmsk.append($mask);			
			$imgcont.append($labmsk);			
			$('#rowdiv_' + idrad).append($imgcont);
		};
		
		// Add input text field
		lay.disp_input = function(inpobj, idrad){
				
			// Add question (label)
			var $txt_quest = $('<label/>')
				.attr("for", idrad)
				.addClass(inpobj.condclass)
				.html(inpobj.quest)
				.css('margin-right', '1em');

			// Add input area
			var $txt_inp = $('<input/>')
				.attr("type", 'text')
				.attr("id", 'resp_' + idrad)
				.attr("name", 'inp_' + idrad)
				.attr("style", "width:" + inpobj.inpwidth +"em")
				.addClass(inpobj.condclass)
				.addClass("form_resp")
				.addClass("lay_input");	
				
			var $inpdiv = $('<div/>')
				.attr('id', 'inpdiv_' + idrad)
				.addClass('lay_inpdiv');
				
			$inpdiv.append($txt_quest, $txt_inp);
			$('#rowdiv_'+ idrad).append($inpdiv);	
		};
		
		
		return lay;
	};
	

	plugin.trial = function(display_element, params) {
		
		// Check for parameters
		trial = define_trial(params);
		
		// Evaluates function if any
		trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
		
		
		/**------ DISPLAY THE FORM **/
		
		// Initialized layout_form object
		var layform = layout_form(trial, display_element);
		// Display each row of the form (radio choice + potential image + mask + input field)
		var layobj = trial.layout;
		var Nkb = layobj.length;		
		
		layform.init();
			
		// Azerty, Qwerty and Other
		for (var j = 0 ; j < Nkb ; j++) {
			var layo = layobj[j];
			
			layform.disp_radio(layo);
			
			var id_rad = layo.opt_id;
			if (layo.is_img) {
				layform.disp_img(layo.img_path, id_rad);
			}

			if (layo.is_msk) {
				layform.disp_msk(layo.msk_path, id_rad);
			}
			
			if (layo.is_inp) {
				layform.disp_input(layo.inp_obj, id_rad);
			}
			
		}
		
		// Adjust kbform_row div height in px
		var hform = $('body').height();
		var hrow = Math.round(hform/4.5);
		$('.kbform_row').css('height', hrow);
		$('.kbform_img').css('height', hrow);
		// Add actions on click and hover to highlight label and to show image mask		

		$(":radio").each( function() {
			
			// Show mask when click on radio
			$(this).click(function (){
				var gid = $(this).attr('id');			
				// Remove previous active msk
				$(".lay_main").show();
				$("#img_"+ gid).hide();	
				// Remove previous blue label	
				$('.radio_lab').removeClass('blue');
				$("#lab" + gid).addClass('blue');
				// If no associated text input field, remove other txt input field content
				if (!($('#resp_'+gid).length)){
					$('.lay_input').val('');
				}
			});
		});	
		$('.lay_inpdiv').click(function(){
			var rid = $(this).attr('id');
			var gid = rid.slice("inpdiv_".length);
			$('#'+gid).prop('checked', true);
			$('.radio_lab').removeClass('blue');
			$("#lab" + gid).addClass('blue');
			$(".lay_main").show();
		});
		$('.lay_input').focus(function(){
			var rid = $(this).attr('id');
			var gid = rid.slice("resp_".length);
			$('#'+gid).prop('checked', true);
			$('.radio_lab').removeClass('blue');
			$("#lab" + gid).addClass('blue');
			$(".lay_main").show();
		});	
		// When hover layout image
		$(".kbform_row").each( function() {
			var rid = $(this).attr('id');
			var gid = rid.slice("rowdiv_".length);
			$(this).hover(
				function (){
				$("#img_"+ gid).hide();
				//$('.radio_lab').removeClass('blue');
				$("#lab" + gid).addClass('blue');
				},				
				function (){
					
					if ( $("#" + gid).is(":checked") !== true ){
						$("#img_"+ gid).show();
						$("#lab" + gid).removeClass('blue');
					}
				}
			);
		});	
		
		// Add submit button
		var $subm = $('<div />')
			.attr('id',"subbut")
			.addClass("form_subbutton lay_but");

		var $but = $('<a />')
			.attr("id","submit")
			.addClass('button')				
			.html("<span id='subbut_txt'>"+trial.submit+"</span>");
			
		$('#theform').append($subm);		
		$('#subbut').append($but);

		
		/**------ PARSE THE RESPONSES AFTER SUBMIT BUTTON CLICK **/
		
		$("#submit").click( function() {
			var idn = trial.idname;
			var layresp = idn;	
			// Parse all input fields, store associated NAME (as "name") and VALUES	
			// Restrict to form_resp class only to avoid AdWare / SpyWare data inclusion (hidden input..)				
			$(".form_resp").each( function() {
				/* $(this) -> Selects the current HTML element */
				var intyp = $(this).attr("type");
				var fname = $(this).attr("name"); 
				var val = $(this).val();
				
				
				// Input text field or selected element or radio button : a unique answer 
				// to add to the field with the name value of the form_data object
				// For radio element, keep value only if checked
				if ((intyp == "radio") && ($(this).is(":checked") == true)) {
					if (val==""){
						val = "NA";
					}
					layresp += '_' + val;
				}
				if ((intyp == 'text') && (val.length > 0)){
					val = val.replace(/\s+/g, '');	
					layresp += '_' + val;
				}
			});
			if (layresp === idn){
				layresp += '_NA';
			}		
			// save data				
			form_data = {
				"layout": layresp
			};
			
			display_element.html('');

			// next trial
			jsPsych.finishTrial(form_data);
		});

	};

	return plugin;
})();