/** Specific plugin for AppReg experiment

Define an object arExp with methods to define : 

- the welcome page with the request to manually set the page in full screen size for IE or Edge :
	arExp.initFullScreen
	
- the additional informations pages (age + keyboard layout) : arExp.additionalInfo

- the main game choice page that appears again at the end of each game : arExp.draw_mean_page

- the popup page to send a message with comments + optional mail address : arExp.add_popcom 
	(use the popcom methods defined in ar_popcom.js)
	
- the task related to the game choice, including : 
	-- instruction page  : arExp.char_instr
	-- typing task : arExp.char_block
	-- and feedback page : arExp.final_sequence (save and get score, dispaly the feedback page)

* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/

var arExp = (function(){
	
	var core = {};
	
	// Array holding the number of character per game (as string)
	var listgame = ['10', '20', '50', '100', '200'];
	// Number of character for demo mode
	var ndemo = ['2', '4', '6', '8', '9'];	
	
	// Variable to store the best rank of the participant for each game
	// Values will be updated at the end of each game
	// bestrank[game] with fields : 
	//				.val (best rank for the game) 
	//          	.tot (total number of participants)	
	var bestrank = [];
	
	// Mean page (game choices) header (logo)
	var $header = $('<header/>')
	.html('<img class="kogjc_img" src="img/logo_kogjc.png"/>' +
			'<div id="kogjc_str"><p style="margin: 0px">The <span class="blue kogjc">K</span>eyboard <span class="black kogjc">O</span>lympic <span class="red kogjc">G</span>ames</p>' +
			'<p style="margin: 0px 10px">Les <span class="yellow kogjc">J</span>eux <span class="black kogjc">O</span>lympiques du <span class="green kogjc">C</span>lavier</p></div>');

/**-------	
	
  DEFINE LIST OF (RANDOM/REGULAR) CHARACTERS 
 
-------- **/
	// => stimlist method defined in ar_stimlist script
	// var list = stimlist("100");	

/**-------	
	
  WELCOME SCREEN + REQUEST FULLSCREEN
 
-------- **/
	core.initFullScreen = function(afterfullfunc){
		
		/** WELCOME block message*/
		var begdiv = "<div class='blue large' style='display:inline-block; width: 100%; height: 6em; text-align: center;  margin: 10% auto 2em auto;'>";		
		var wtxt = "<p>Bienvenue sur la fenêtre des Jeux Olympiques du Clavier ! </p>";		
		var itx = begdiv + wtxt;
		var etx = "</div>";
		
		// Check if full size : page width ~= screen size				
		function is_not_fullwindow(){
			if (window.outerWidth < screen.width-100){
				return true;
			}else{
				return false;
			}
		}
		
		// Need a first block for jspsych conditionnal method to work with the following blocks 
		var welcome_block = {
			type: 'text',
			text: function(){
				$('body').addClass('bg_og');
				return 	itx + etx
				},
			timing_stim: 1000		
		};
		
		// Page to show if fullsize is OK
		var noresize_block = {
			timeline: [{
					type: 'text',
					text: function(){
						$('body').addClass('bg_og');
						return 	itx + "<p>Veuillez ne pas la redimensionner.</p><p>Cliquez sur la fenêtre pour commencer...</p>" + etx
						},
					cont_key: 'mouse'
					}],
			conditional_function: function(){
				return (!is_not_fullwindow());
			}
		};
		
		// Conditional block if not in full screen (cf. Edge)
		// Block to show if fullsize is required
		var resize_block = { 
			timeline: [{
					type: 'resize',
					text: function(){
						$('body').addClass('bg_og');
						return 	itx + "<p>Pour commencer, merci de mettre cette fenêtre en plein écran (bouton du milieu, en haut à droite).</p>" + etx
						}
					}],					
			conditional_function: function(){
				return is_not_fullwindow();
			}
		};
		
		jsPsych.init({
			timeline: [welcome_block, noresize_block, resize_block],
			on_finish: function(){ 	
				jsPsych.data.deleteAllData();	
				afterfullfunc();
			}	
		});
	};
	
/**-------	
	
  GET AGE INFO + KEYBOARD LAYOUT
 
-------- **/

	// Update subjinfo global variable (define in ar_exp) depending on subject's answers 
	// about age + kb layout
	core.update_subjinfo = function(sadd){
		if (typeof sadd == 'string'){
			sadd = [sadd];
		}
		for (var i = 0; i < sadd.length; i++){			
			subjinfo += '_'+ sadd[i]; 
		}
		//alert(subjinfo);
	}
	// Special module to launch jsPsych for the collect of additional participant's info at the beginning of the 
	core.additionalInfo = function(after_info){
		
		var ageform = {
			type : "radio",
			idname : "age",
			quest : "Votre tranche d'âge :",
			opt_str : ["0-9 ans", "10-15 ans", "16-19 ans", "20-39 ans", "40 ans et plus", "Non merci"],
			opt_id : ["age_1", "age_2", "age_3", "age_4", "age_5", "age_0"]
		};
		
		var form_age = {
			type: "form",
			preamble: "<p class='blue'>Afin d'établir votre classement parmi les autres participants, pourriez-vous nous préciser votre tranche d'âge ?</p>"+
						"<p class='age_info'>En cochant <span class='black italic'>Non merci</span>, votre classement sera affiché en considérant l'ensemble des participants, tous âges confondus.</p>",
			form_struct: [ageform],
			submit: "Valider"
		};
		
		// Specific plugin to ask for keybord layout (choice as radio button + image and mask + input field)
		var kb_layout = [
						{
							opt_id: 'az',
							opt_str: 'Azerty',
							img: 'img/kb_azerty.png', 
							msk: 'img/kb_azerty_msk.png'
						}, 
						{
							opt_id: 'qw',
							opt_str: 'Qwerty',
							img: 'img/kb_qwerty.png', 
							msk: 'img/kb_qwerty_msk.png'
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
		
		var form_kb = {
			type: 'form-kb-layout',
			idname: "kb_lay",
			quest: "<span class='blue'>Enfin, pourriez-vous préciser le type de clavier que vous utilisez actuellement ?</span>",
			layout: kb_layout
		};	

		jsPsych.init({
			timeline: [form_age, form_kb],
			on_finish: function(){	
					// Get layout response
					var layresp = jsPsych.data.getTrialsOfType('form-kb-layout');
					var slay = layresp[0].layout;
					
					// Get age response
					var respdat = jsPsych.data.getTrialsOfType('form');
					var sresp = JSON.parse(respdat[0]['responses']);
					var sage = sresp.age;
					
					if (sage==='NA'){
						sage = 'age_0';	
					}
					// Try again to have subject information by WhichBrowser
					if (subjinfo == "Unable_whichbro"){
						subjinfo = getBrowserInfos();
					}
					// Update subjinfo_string (with age range code in the last position)
					arExp.update_subjinfo([slay, sage]);
					
					after_info(); // start the JOC ! (draw main page)
					
			}
		}); 
		
	};

/**-------	
	
  INSTRUCTION & TYPING TASK blocks definitions
 
-------- **/	
	
	/** Define instruction page as a function of game choice (number of characters) */
	
	core.char_instr = function(nch) { 
		var spn = "<span class='bd col_game_" + nch + "'>" + nch + " lettres</span>";
		var char_intro = {
			type: 'text',
			text: "<div class='instructions'><p>Dans ce jeu, "+ spn + " vont apparaître successivement à l'écran."+
				"<p>Dès l'apparition d'une lettre, vous devez <b>appuyer sur la touche correspondante du clavier</b> le plus rapidement possible."+
				"<p>A la fin de la partie, vous pourrez connaître votre score.</p>"+
				"<p>Tenez-vous prêt !</p>"+
				"<p>Appuyer sur une touche pour lancer la partie...</p></div>",
			timing_post_trial: 800
		};
		return char_intro
	};
	
	/**-------		Define char block object as function of nch choice **/
	
	core.char_block = function(stimlist, nch){

		/** Draw the list and return the stimuli for the 2 blocks*/
		var list = stimlist.make(nch);
		var stim = list.charlist;
		// Crop stim list if demo mode
		if (isdemo){
			stim = stim.slice(0, ndemo[listgame.indexOf(nch)]);
		}
		
		var char_block = {
			type: "char-typing",
			char_stim: stim,
			id_list: list.idname,
			timing_interstim: 0
		};
		return char_block;	
	};

/**-------	
	
  SPECIAL FUNCTIONS
 
-------- **/
	
	/**------- Get update bestrank values (DOM variable)  */
	core.bestrank = function(){
		return bestrank;
	};
	
	/**------- Set comment popup div **/
	core.add_popcom = function(){
		
		var $comlink = $('<div/>')
				.attr('id', 'popcom_linkdiv')
				.html('<a id="popcom_link">Nous contacter</a>');
				
		$('body').append($comlink);
		popcom.init('popcom_linkdiv');
		
	};

	/**-------		Save the RT data **/	
	core.save_data = function (subjID, subjinfo, gameinfo, data){
		return { 
			type: 'post',
			cache: false,
			url: 'db/db_save.php', 
			data: {
				subjid: subjID,
				subjinfo: subjinfo,
				game: gameinfo,
				json: JSON.stringify(data)
			}
		}
	};
	
	
/**-------	
	
  MAIN PAGE WITH GAME CHOICES
  TRIGGER THE TASK
 
-------- **/
	
	core.draw_mean_page = function(initfunc){
		
		// Delete previous jsPsych data (CREx addictional method in jsPsych core script) 
		jsPsych.data.deleteAllData();
		
		var intro_txt = "<p>Vous pouvez choisir l'épreuve des <span class='blue bd'>10</span>, "+
						"<span class='black bd'>20</span>, <span class='red bd'>50</span>, "+
						"<span class='yellow bd'>100</span> ou <span class='green bd'>200</span> "+
						"lettres en cliquant sur l'image correspondante.</p>"+
						"<p>Votre meilleur classement parmi l'ensemble des participants sera affiché à la fin de l'épreuve.</p><p>Vous pouvez recommencer autant de fois que vous le désirez pour tenter "+
						"d'améliorer votre score.</p>";
		
		var $preamb = $('<div/>').attr('id', 'game_intro').html(intro_txt);
			
		var Ng = listgame.length;
		
		// $divgame will hold all the game_div definition in jquery 		
		var $divgame = [];
		for (var i = 0 ; i < Ng ; i++){
			var nch = listgame[i];
			
			// Add div with button for game (== image)
			var $dg = $('<div/>').addClass('game_div').attr('id', nch);
			
			// Define image 
			var $but = $('<img/>')
						.attr('id', 'ar_' + nch)
						.addClass('game_button')
						.attr('src', 'img/ar_game_' + nch + '.png');

			// Define the mask image that will appear when hover the game_div
			// This mask holds the onclick event used to initialize jsPsych adn launch the experiment
			var $mask = $('<img/>')
					.addClass('game_button_mask')
					.attr('id', 'msk_ar_'+nch)
					.attr('src', "img/ar_game_" + nch +'_maskp.png')
					.click(function(){								
							var idnam = $(this).attr("id");
							// Extract game id (Nchar)
							var numchar = idnam.substring(7);
							
							setTimeout(function(){
								// Initialization function to launch the jsPsych experiment
								initfunc(numchar);
							}, 100);
							});
							
			// Add elements to $dg div (game_div)
			$dg.append($but, $mask);
			
			// Keep all game_div in $divgame array
			
			$divgame.push($dg);
			if (i==2){
				var $pp = $('</p>').attr('id','game_sep').html('ZZZzzzzz').css('visibility', 'hidden');
				$divgame.push($pp);
			}
		}
		
		// Add all the elementary game_div in a general div = game_choices	
		var $gchoice = $('<div/>').attr('id', 'game_choices');
		$gchoice.append($divgame);
		
		// Draw all the stuffs on the page
		$('body').append($header, $preamb, $gchoice)
				.addClass("jspsych-display-element bg_og");	
		
		// Add hover action on game_div elements as well as score_div
		$(".game_div").each( function() {
				// Game type (number of characters) = id of the game div
				var gdid = $(this).attr('id');
				
				// Add div to hold scores				
				var $sdiv = $('<div/>')
							.attr('id', 'scorediv_' + gdid)
							.html('<p style="line-height:1em">Rang</p>')
							.css('visibility', 'hidden')
							.addClass('score_div');
							
				$(this).append($sdiv);
				$(this).hover(function (){
					// Hide main game image (css: z-index: 1) to see the mask image (z-index: 0)
						$('#ar_'+gdid).hide();
					},
					function (){
						$('#ar_'+gdid).show();
				});
			});
			
		// Add best rank
		add_game_rank();
		
		// Add popcom link
		core.add_popcom();
	};
	
	// Define the medal image depending on the score for each game type
	// The best rank per game are sorted from minimum rank value to maximum rank
	// med field is added to the gamerank object with the rank amongst the different games
	function medal_rank(gamerank) {
		
		var sortrank = [];
		for (var game in gamerank){
			sortrank.push([game, parseInt(gamerank[game].val)]);				
		}			
		sortrank.sort(function(a, b) { 
					return a[1] - b[1]; 
					});							
		gamerank[sortrank[0][0]]["med"] = 1;
		var Nr = sortrank.length;
		if (Nr > 1){
			for (var i = 1; i < Nr; i++){
				var prevgr = gamerank[sortrank[i-1][0]];
				var curgr = gamerank[sortrank[i][0]];
				gamerank[sortrank[i][0]]["med"] = (curgr.val===prevgr.val) ? prevgr.med : prevgr.med+1;	
			}
		}
		return gamerank;
	}
	
	// Add the best game rank information + associated medal image at the bottom of 
	// each game choice button
	function add_game_rank(){
		var gamerank = bestrank;
		if ((typeof(gamerank) === 'object') && (gamerank.length > 0)) {
			// Assign medals depending on rank of ranks

			var gamerank = medal_rank(gamerank);
			
			for (var game in gamerank){
				var scorobj = gamerank[game];
				/** DEMO  */
				if (isdemo){
					game = listgame[ndemo.indexOf(game)];					
				}

				var $divmed = $('<div/>').addClass('medal_div'); 
				var $medal = $('<img/>')
							.attr('src', 'img/ar_place_'+ scorobj.med + '.png')
							.addClass('medal');
				$divmed.append($medal);
				
				var $rankdiv = $('<div/>').addClass('rank_div');
				var $scdiv = $('<span/>')
						.addClass('col_game_' + game)
						.html('<p>Votre rang : </p><p>' + scorobj.val + ' sur ' + scorobj.tot + '</p>');
				$rankdiv.append($scdiv);
				
				$('#scorediv_' + game)
						.html('')
						.css('visibility', 'visible')
						.append($divmed, $rankdiv);
			}
		}
	}		
	
/**-------	Final sequence
  SAVE AND GET SCORE		
  DRAW FEEDBACK PAGE
  MEAN PAGE RETURN
-------- **/

	// Allow to display the final sequence of each game : feedback page following 
	// by main page including best rank reminder
	core.final_sequence = function(initfunc) {
				
		// Save the score in the dedicate database table
		function save_score(nch, rt){
			return {
				type: 'post',
				cache: false,
				url: 'db/db_score_save.php',
				data: {
					nch_game: nch,
					subj_score: rt,
					subj_rage: subjinfo.slice(-1)
				}
			}
		}
		
		// Feedback page handle event on button click = draw the mean page with game choice as
		// well as best game rank
		function feedback_page(score, initfunc) {
			// scrore : the object holding the participant's score for the current game
			// score.nch_game, score.nb_valid, score.rt
			// initfunc : the function that launchs the jsPsych experiment when game choice is done
			// by clicking on the game button
			var corval = score.nb_valid + " sur " + score.nch_game;
			var cgam = "col_game_" + score.nch_game;
			var spangam = "<span class='fb_res  "+ cgam + "'>";	
			var fbtxt = "<p class='large'>Bravo ! Voici vos résultats pour cette épreuve : </p>"+
						"<span class='fb_info'> (3 secondes de pénalité sont ajoutées par erreur de frappe)</span>"+
						"<p>Nombre de réponses correctes : " + spangam +
						corval + "</span></p>"+
						"<p>Temps total : " + spangam + score.rt + " secondes </span></p>" +
						"<p>Classement global : "+ spangam + score.rank + " sur " + score.ntotal + " participants</span></p>";
						
			// Add div with button
			var $fbdiv = $('<div/>').addClass('fb_div fb_col_' + score.nch_game)
								.html(fbtxt);
			var $fbbut_div = $('<div/>').addClass('fb_but_div');
			var butgam = "fb_but_" + score.nch_game;
			var $fbbut = $('<a/>')
						.attr('id', 'fb_but')
						.addClass('fb_button fb_ini_col')
						.html("<span id='butxt'>Rejouer une épreuve</span>") /*class='ini_col'*/
						.hover( function(){
										$('.fb_button').removeClass('fb_ini_col');
										$('.fb_button').addClass(butgam);
								},
								function(){
										$('.fb_button').removeClass(butgam);
										$('#fb_but').addClass('fb_ini_col');
								})
						.click(function(){
							// Add a small amount of time before switching to main page
							setTimeout(function(){
								$('body').html('');
								arExp.draw_mean_page(initfunc);
								}, 100);
							});
							
			$fbbut_div.append($fbbut);
			
			$('body').append($fbdiv, $fbbut_div)
					.removeClass('bg_grey')
					.addClass("jspsych-display-element bg_og");
			
			// Display data if demo mode 			
			if (isdemo){
				jsPsych.data.displayData();
			}
		}
		
		// Update best rank for this game
		function update_best_rank(newscore) {
			var game = newscore.nch_game;

			if (typeof bestrank[game] != 'object') {
				bestrank[game] = {
					val : newscore.rank,
					tot: newscore.ntotal
				};				

			}else{
				var pgrank = bestrank[game];
				// Keep lower rank -- No CREx-170616 : keep rank of the last game
				// Update with the current rank
				//if (newscore.rank < pgrank.val){
					bestrank[game]["val"] = newscore.rank;	
					// Update total number of participations
					bestrank[game]["tot"] = newscore.ntotal;
				//}
			}
		}
		
		// Get rank for this game 
		function get_rank(score, fbdraw_callback, initfunc){
			return {
				type: 'get',
				url: 'db/db_score_rank.php',
				data: {
					nch_game: score.nchar_game,
					subj_score: score.rtms,
					subj_rage: subjinfo.slice(-1)
				},
				dataType: 'json',
				success: function(data) {
					// data is an object process by db_score_rank holding the values :
					// data.rank and data.ntotal, as well as data.rt and data.nch_game
					// Add nch, rt and nb_valid info
					data["nb_valid"] = score.nb_valid;
					data["rt"] = score.rt;
					data["nch_game"] = score.nchar_game;
					// Update best rank => change bestrank global variable of arExp object
					update_best_rank(data);
							
					fbdraw_callback(data, initfunc);
				},
				error: function(resultat, statut, erreur){
					console.log(resultat);
				}
			}	
		}
		
		// Get and save score, then get rank
		var optfb = {rt_field:'rt', 
				score_type:'sum',
				show_blocknum: false
				};
		
		// as data are deleted at the end of each game, score_div should 
		// only return the score of the current game
	
		var scorediv = jsPsych.feedback.score_div("char-typing", optfb);
		
		// RT in ms
		var rtms = scorediv.fb_val.all[0];
		
		// Add 3 s penality per error				
		var nb_err = scorediv.fb_val.n_tot[0] - scorediv.fb_val.n_val[0];
		
		rtms = rtms + nb_err*3000;		
		
		// Get RT in seconds and only keep one value for decimal
		var rt = (rtms/1000).toString();
		rt = rt.slice(0, rt.indexOf(".") + 2);
		rt = parseFloat(rt);

		// N-char game
		var ncg = scorediv.fb_val.n_tot[0];

		var score = {
			nchar_game: ncg.toString(),
			nb_valid: scorediv.fb_val.n_val[0],
			rt: rt,
			rtms: rtms
		};
			
		// Save score first then display feedback page = function get_rank, 
		// that will compute player rank, display the page 
		// and add event to "Recommencer" button to display the main page 
		// (that will display the game choices + the update best gammer ranks for each game)
		$.ajaxQueue(save_score(score.nchar_game, score.rtms));
		$.ajaxQueue(get_rank(score, feedback_page, initfunc));			
	}

	return core;
})();

