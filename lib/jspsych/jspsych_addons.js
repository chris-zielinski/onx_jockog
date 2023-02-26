/** 
* Add new methods to jsPsych object for CREx experiments
*
* jsPsych.getSubjectID
* jsPsych.prepareProgressBar
* jsPsych.initFullScreen
* jsPsych.feedback
* 	jsPsych.feedback.getBlocksOfTrials
* 	jsPsych.feedback.getBlockSummary
* 	jsPsych.feedback.getAllBlocksSummary
* 	jsPsych.feedback.makeScoreDiv
* 	jsPsych.feedback.score_div
*
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


/**-------- subject_ID based on the starting date */

jsPsych.getSubjectID = (function() {
	
	/* Define subject ID (based on an accurate start date - millisecond order precision) */
	function datestr(sdat) {
		function formatstr(num, dignum){
			dignum = (typeof dignum =='undefined') ? 2 : dignum;
			var numstr = num.toString();
			if (numstr.length < dignum) {
				for (var j = 0 ; j < dignum - numstr.length ; j++) {				
					numstr = "0" + numstr;
				}
			}
			return numstr;
		}
		var sy = sdat.getFullYear();
		var smo = formatstr(sdat.getMonth()+1);
		var sda = formatstr(sdat.getDate());
		var sho = formatstr(sdat.getHours());
		var smi = formatstr(sdat.getMinutes());
		var sse = formatstr(sdat.getSeconds());
		var sms = formatstr(sdat.getMilliseconds(), 3);
		var strdat = sy + smo + sda + "_" + sho + smi + sse + "_" + sms;
		
		return strdat ;
	}

	return 'ID_' + datestr(new Date());
});

/**---------- Add progress bar (html script) to experiment object when it's required (expobj.probar === true)*/

// Parse experiment structures array
// Add progress bar HTML code when "progbar" field is found in experiment structure
jsPsych.prepareProgressBar = function(expobj) {
	/* Global number of experiment part - for drawing progress bar */
	//var Npbar = 8;
	/* Function to draw progress bar */
	function putProgressBarStr(istep, Nstep){
		// Parse number of element with progress bar inside			
		var prop = istep / Nstep;
		var strpbar = "<div id='progressbar-wrap'><p id='progressbar-wrap-txt'>Progression globale</p>"+
						"<div id='progressbar-container'><div id='progressbar-inner' style='width:" + (prop*100) + "%'><p>Etape " + istep + "/"+ Nstep + "</p></div></div></div>"; //Math.round(prop*100) + "%
		return strpbar;
	}

	// parseProgressBar
	// [1] Count the total number of required progress bar
	// Total number
	var Nbar = 0;
	// Array of indices of expobj where putProgressBarStr is called
	var ibararr = []; 
	
	for (var j = 0 ; j < expobj.length ; j++) {
		// Search for Xbar occurrence
		// Should only occurs inside text or preambule field
		// Doing as we don't know apriori
		var subobj = expobj[j];
		if (subobj.progbar !== undefined){
			if (subobj.progbar == true){
				Nbar = Nbar + 1;
				ibararr.push(j);
			}
		}
	}

	// [2] Now add progress bar HTML string
	for (var k = 0 ; k < ibararr.length ; k++) {			
		expobj[ibararr[k]]["progbarstr"] = putProgressBarStr(k+1, Nbar);
	}
	return expobj;
};


/**--------------------- Full window check & request for Edge*/

jsPsych.initFullScreen = function(afterfullfunc){
	
	/** WELCOME block message*/
	
	// Check if full size
	
	// Conditional block if not in full screen (cf. Edge)
	function is_not_fullwindow(){
		if (window.outerWidth < screen.width-100){
			return true;
		}else{
			return false;
		}
	}
	var dtx = "<div class='large' style='display:inline-block; width: 100%; height: 6em; text-align: center; margin: 10% auto 2em auto;'>";

	var itx = dtx + "<p>Bienvenue sur la fenêtre d'expérience ! </p>";
	var etx = "</div>";
	
	var welcome_block = {
		type: 'text',
		text: itx + etx,
		timing_stim: 1000		
	};
	
	var noresize_block = {
		timeline: [{
				type: 'text',
				text: itx + "<p>Veuillez ne pas la redimensionner.</p><p>Cliquez sur la fenêtre pour commencer...</p>" + etx,
				cont_key: 'mouse'
				}],
		conditional_function: function(){
			return (!is_not_fullwindow());
		}
	};
	
	var resize_block = { 
		timeline: [{
				type: 'resize',
				text: itx + "<p>Pour commencer, merci de mettre cette fenêtre en plein écran (bouton du milieu en haut à droite).</p>" + etx
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


/**------------------------ Function for feedback */

jsPsych.feedback = (function(){
	
	var module = {};
	
	/*------- Put values associated to the same property in the same array */ 
	/* Assuming objarr an array, each element being an object with the same field names*/
	function concatObjArr(objarr){
		// Get object properties names
		var prop = Object.keys(objarr[0]);
		/* Store values of each object of objarr in the same array*/
		/* Initialize */
		var concobjarr = {}; // New object with properties listed in prop variable
		for (var i = 0 ; i < objarr.length ; i++){
			for (var j = 0 ; j < prop.length ; j++) {
			// Initialize
				if (i==0) {
					concobjarr[prop[j]] = [];	
				}
				concobjarr[prop[j]][i] = objarr[i][prop[j]];
			}
		
		}
		return concobjarr;	
	}
		
	/*------ Store all the trials of type trialtyp_names in the 2D array trialblocks */
	/* The trials of the same block are gathered together in the same line of trialblock array */	
	module.getBlocksOfTrials = function(trialtyp_names){
			
		/* Convert input trialtyp_names in array */
		// To allow mixing typing-times from different kinds of blocks 

		trialtyp_names = (typeof trialtyp_names == 'string') ? [trialtyp_names] : trialtyp_names;
		/* All trials currently store by jsPsych */
		var alltrials = [];
		var Ntt = trialtyp_names.length;
		for (var i = 0 ; i < Ntt ; i++){
			var trialpart = jsPsych.data.getTrialsOfType(trialtyp_names[i]);
			if (trialpart.length > 0){
				alltrials = alltrials.concat(trialpart);
			}
		}
		
		/* Gather trials of the same block together according to trial_index_global */
		/* A block is assuming containing trials with successive trial_index_global */	
		var trialblocks = [];
		var tnum = [];
		if (alltrials.length > 0) {
			trialblocks[0] = [alltrials[0]];
			kb = 0;
			
			var prevtig = alltrials[0].iG;
			tnum[0] = prevtig;
			
			for (var i = 1; i < alltrials.length; i++) {
			  var tig = alltrials[i].iG;
			  if (tig == prevtig + 1 ) { 
				// Same block
				trialblocks[kb].push(alltrials[i]);
			  }else{
				// A new block
				kb = kb + 1 ;
				trialblocks[kb] = [alltrials[i]];
				tnum[kb] = tig;
			  }
			  prevtig = tig;
			}	
		}
		
		// Check for blocks order		
		if (trialblocks.length > 1){
			var tempblocks = trialblocks.slice(0); // Deep copy ("WTF?")
			var sortnum = tnum.slice(0); // Deep copy ("WTF?")
			sortnum.sort(function(a, b) { return a - b; });
			for (var i = 0; i < sortnum.length ; i++){
				var ib = tnum.indexOf(sortnum[i]);
				trialblocks[i] = tempblocks[ib];	
			}
		}
		
		return trialblocks;	
	}
	
	
	/**------ Compute average typing time and percentage of matching answers */ 
	module.getBlockSummary = function(trials, rtfield){
		/* trials : array of trials object from the same block 
		rtfield : name of the field that contains the time measurement in each trial object
		(ex. : "rt" (reaction times for each key press) or "tt"(typing times for typing / keyseq tasks)
		The summary are done for both the sum and the average of the measurement of interest.
		Depending on the 
		// vld : response validity (1 : valid, 0 : not correct)
		// nvld : number of correct answers
		
		/*------ Convert string array to array of numbers */
		function str2arr(strdata){
			/* Remove brackets before spliting*/			
			strdata = strdata.substring(1, strdata.length - 1);
			var spstr = strdata.split(",");			
			var numArray = [];
			var k = 0;		
			for (var i = 0; i < spstr.length ; i++) {
				numArray[k] = parseInt(spstr[i]);
				k++;
			}
			return numArray;
		};
		
		// Initialize
		
		// Summary could be about rt and/or tt
		
		
		/** Sum the responses/ typing times **/
		var Nt = trials.length;
		// Typing time value (regardless answer validity)
		var rt_all = {nb: 0, 	// Total number of typing times 
					sum: 0}; 		// Sum of typing times
		
		// Typing time values (only for matching answers)
		var rt_val = {nb: 0,  // Total number
					sum: 0};  // Sum
					
		// Total number of correct answers 
		// If the trial is refering to a typing task (word / sequence reproduction at each trial)
		// the field "vld" gives the answer validity for the whole typing sequence
		// If the trial corresponds to a multi-stim task with one answer per stim, 
		// the field "nvld" gives the NUMBER of valid responses toward the whole multi-stim trial
		// It is not possible so to define the sum and average of reaction time for valid answer only.
		var ntot = 0;
		var nval = 0 ;		
		// if nval => ntot == the total number of subtrials
		// if vld => ntot == the total number of trials
		for (var i = 0; i < Nt; i++) {
			// vld field for typing task give the validity of the given typing response
			// cf. for word or sequence to reproduce, vld = 1 if the typing sequence matches the expected response, 0 otherwise
			var valflag = 0;
			
			// nval field give the number of valid responses for trial block with multiple successives responses
			// cf. char-typing
			// Compute the total number of valid responses
			if (typeof trials[i].nvld != 'undefined'){
				nval = nval + trials[i].nvld;
			}
			else if (typeof trials[i].vld != 'undefined'){
				valflag = trials[i].vld;
				nval = nval + valflag;
				ntot = ntot + 1;
			}		
			
			/* Typing time are return as a string array by jsPsych.data.getTrialsOfType */
			
			if (typeof trials[i][rtfield] !== 'undefined'){
				var vectt = str2arr(trials[i][rtfield]); // Fonction to convert string to number array
				// Loop on each responses for the same trial
				for (var j = 0, Nv = vectt.length ; j < Nv ; j++) {				
					if (vectt[j] > 0) {
						rt_all.sum = rt_all.sum + vectt[j];
						rt_all.nb = rt_all.nb + 1;
						
						// Count and sum times for correct answers only
						if(valflag==1){
							rt_val.sum = rt_val.sum + vectt[j];
							rt_val.nb = rt_val.nb + 1;
						}
					}
					if (typeof trials[i].nvld != 'undefined'){
						ntot = ntot + 1;
					}
				}				
			}
		}
		
		// Percent of correct answers
		if (ntot > 0){
			var pval =  Math.round(100 * nval / ntot);
		}else{
			var pval = 0;
		}			
		
		/** Compute the average of the response / typing times **/
		
		// Initialize
		var avgrt_val = -1; // Average typing time including those with matching answers only 
		var avgrt_all = -1; // Average typing time regardless answer validity		
		
		// Average typing time for matching answers only
		if (rt_val.nb > 0) { // Number of valid response could be 0 
			avgrt_val = Math.floor(rt_val.sum / rt_val.nb);
		}
		
		// Average typing time regardless validity
		if (rt_all.nb > 0){
			avgrt_all = Math.floor(rt_all.sum / rt_all.nb);
		}
		
		return {sum : {all: rt_all.sum, vld: rt_val.sum, p_vld: pval, n_val: nval, n_tot: ntot}, 
				avg: {all: avgrt_all, vld: avgrt_val, p_vld: pval, n_val: nval, n_tot: ntot}}	
	};
	
	/**------ Get all summary values per block */
	
	module.getAllBlocksSummary = function(trialtyp_names, rtfield, summtyp) {

		var trialtyp = (typeof trialtyp_names == 'string') ? [trialtyp_names] : trialtyp_names;
		
		var summtyp = (typeof summtyp == 'undefined') ? 'avg' : summtyp;
		
		var trialblocks = module.getBlocksOfTrials(trialtyp);
		
		// Initialize
		var blocksummary = [];

		// Loop through the blocks			
		for (var k = 0 ; k < trialblocks.length ; k++) {
			var bsumm= module.getBlockSummary(trialblocks[k], rtfield);
			blocksummary.push(bsumm[summtyp]);					
		}
		
		var concblocksummary = concatObjArr(blocksummary);
		return concblocksummary;
	};	
	
	/**-------  Define the score divs **/
	
	module.makeScoreDiv = function(scorearr, colorflag, sortmeth, Nsubpart){

		// Check for input paramaters
		if (typeof Nsubpart === 'undefined' || Nsubpart === null){
			var Nsubpart = 1;
		}
		
		var colorflag =  (typeof colorflag === 'undefined' || colorflag === null) ? 0 : colorflag;
		var sortmeth =  (typeof sortmeth === 'undefined' || sortmeth === null) ? 1 : sortmeth;		
		
		/* Deduce the information about the block number (main block as a char, subpart as a number)*/
		/* Ex. Partie A-1*/
		function block_info(iblock, Nsub){	
			// Number of sub-sections of each sequence 
			// var Nsub = 2; // Global variable
			
			/**--- Name for the current block**/
			/* According to general index of the restitution block*/		
			// Index of block begins by 0
			iblock = iblock + 1;
			
			var r = iblock % Nsub;

			// Number of the general part
			var ipart = Math.ceil(iblock / Nsub);

			if (r>0) {
				var isub = iblock - (ipart-1)*Nsub;
			}else{
				var isub = Nsub;
			}
			var genalpha = String.fromCharCode(ipart+64);
			if (Nsub > 1) {
				var partstr = genalpha + "-"+ isub;
			}else{
				var partstr = genalpha;
			}
			var blockinfo = {
				general_part : genalpha,
				current_subpart : isub,
				idstr : partstr,
				total_subpart : Nsub
			};
			return blockinfo;
		};
		
		/**--- CSS class to define the score div color of the block (red, grey or green)*/
		function score_class(scorearr, colflag, sortmeth) {
			// sortmeth : 	1 : score with max value refers to the best performance
			// 				2 : score with minimum value is the best		
			var Nblocks =  scorearr.length;		
			// Initialize class names array
			var cnames = [];

			for (var k = 0 ; k < Nblocks ; k++){
				if((Nblocks == 1) && (colflag)){
					cnames[k] = "best_score";
					cnames[k] = "best_score";
				}else{
					cnames[k] = "middle_score";
					cnames[k] = "middle_score";
				 }
			}

			// Find the best and worst scores indices
			if ((colflag) && (Nblocks > 1)){		
			
				// Find the last maximum and minimum scores 
				// Index of the last maximum score
				var i_max = scorearr.reduce(function(iMax,x,i,a) {return x >= a[iMax] ? i : iMax;}, 0);
				// Index of the last minimum score
				var i_min = scorearr.reduce(function(iMin,x,i,a) {return x <= a[iMin] ? i : iMin;}, 0); 				
				// sortmeth 1 - the last max score is the best (=> green). The last min is the worst (=> red)
				if (sortmeth == 1){
					ibest = i_max;
					iworst = i_min;
				}else{
				// sortmeth 2 - the min score value is the best (=> green). The last max value is the worst (=> red)
					ibest = i_min;
					iworst = i_max;
				}
				// Color assignment
				for (var k = 0 ; k < Nblocks ; k++){
					if (scorearr[k] == scorearr[iworst]){
						cnames[k] = "worst_score";
					}
					// if best value = worst value, the color is green for both
					if (scorearr[k] == scorearr[ibest]){
						cnames[k] = "best_score";
					}
				}
			}
			return cnames;
		};
		// Return the html code for the row of score div
	
		/* Total number of proceeded blocks, for the moment*/
		var Nk = scorearr.length;
		// Change values to 0 if "-1" is found (== no record)
		for (var i = 0; i < Nk; i++) {			
			if (scorearr[i] < 0) {
				scorearr[i] = 0;
			}
		}

			// Define class name array (allow to change color of scores per bloc
		var cnames = score_class(scorearr, colorflag, sortmeth);

		// Construct string with all the blocks summaries
		var sdiv = "<div class='scorerow'>";
		
		
		// Build the score labels
		//---- Associated with the previous block first
		for (var k = 0 ; k < Nk - 1 ; k++){	
			var strp = block_info(k, Nsubpart).idstr; 
			var sparty = "Partie [" + strp + "] : ";
			sdiv = sdiv + 
					"<div class='score " + cnames[k] + "'>" +
					sparty + 
					scorearr[k] + 
					"</div>";
		}	
		
		//---- For the current block "Partie [Nk] :" in bold
		icur = Nk -1;
		var strp = block_info(icur, Nsubpart).idstr; 
		var sparty = "Partie [" + strp + "] : ";
		
		sdiv = sdiv + "<div class='score " + cnames[icur] + "'>" +
					"<b>" + sparty + 
					scorearr[Nk-1] + 
					"</b></div>";			
		sdiv = sdiv + "</div>";		
		
		return sdiv;
	};		

	module.score_div = function(trialtyp_names, param){
		
		/** param with fields :
				rt_field : 		data field to consider for score calculations (ex. "rt")				
				score_type : 	define the king of method to be applied to data[rt_field] : "sum" or "avg" 
				apply_calc : 	function to apply to the preprocessed score 
								(ex. set ms RT to mean typing time in word per minutes)
				show_blocknum : flag for showing block information ( "Partie [A-1]") before score (true or false)
								when true, div is created showing scores for all blocks ("Partie [A-1] : 236  Partie [A-2] : 189...")
								the following parameters are applied to define the div content and attributes:
				nb_subpart : 	number of sub-part per blocks to deduce block info	
				color_flag : 	flag for indicating to add color for best (green) and worst (red) score 
								div (add a class set in jspsych css file)
				sort_meth : 	code to define how to sort score to put relative performance color:
								1: max is best score ; 2: min is best score
		**/
		// sort_meth is only to know how to define performance color for scores of type "all" and "vld" if color_flag is on.
		// (best score in green, worst in red, middle score in grey). For percent value, the sort method is automatically set to 1 (max score = best)

		/* Check for inputs */
		var trialtyp_names = (typeof trialtyp_names == 'string') ? [trialtyp_names] : trialtyp_names;

		var opt = {
			rt_field : (typeof param.rt_field !== "string") ? "rt" : param.rt_field,
			score_type : (typeof param.score_type !== "string") ? "avg" : param.score_type,
			apply_calc : (typeof param.apply_calc !== "object") ? 'no' : param.apply_calc,
			show_blocknum : ((typeof param.show_blocknum !== "number") & (typeof param.show_blocknum !== "boolean")) ? 1 : param.show_blocknum,
			nb_subpart : (typeof param.nb_subpart !== "number" ) ? 1 : param.nb_subpart,		
			color_flag : ((typeof param.color_flag !== "number") & (typeof param.color_flag !== "boolean")) ? 0 : param.color_flag,
			sort_meth : (typeof param.sort_meth !== "number") ? 1 : param.sort_meth			
		}
		
			
		if (typeof opt.color_flag == "boolean"){
			opt.color_flag = (opt.color_flag == true) ? 1 : 0;
		}
		// Define object containing all scores for all blocks
		var concsumm = module.getAllBlocksSummary(trialtyp_names, opt.rt_field, opt.score_type);
		
		/* Apply special calculation on concsumm object by apply_calc function*/
		/* (ex.: transform in word / minute  6.e4 / (5*IKIm))*/
		if (typeof opt.apply_calc === "object") {
			// Special calculus applied to concsumm object before defining the html div code		
			concsumm = opt.apply_calc.func(concsumm, opt.apply_calc.arg);
		}
		
		// Define score array (array holding scores of each blocks)
		var scoredivs = {};
		if (opt.show_blocknum){
		
			for (var typ in concsumm) {
				// For percent of valid answer, the sort method is 1 (the max percent is the best score)
				if (typ=="p_vld"){
					var smeth = 1;
				}else{
					var smeth = opt.sort_meth;
				}				
				scoredivs[typ] = module.makeScoreDiv(concsumm[typ], opt.color_flag, smeth, opt.nb_subpart);
			}
		}
		
		return {fb_div: scoredivs, fb_val: concsumm};
	};
		
	
	return module;

})();
	
