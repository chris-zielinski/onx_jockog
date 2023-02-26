/** Object to define the stimuli = serie of characters to copy

For lists with 100 or 200 characters, one of the following type of regularity will be generated (randomly) :

- A : sequence of 3 vowels (VVV) - fillers (1 to 3) = randomed consonnants
- B : sequence of 3 consonnants (CCC) - fillers (1 to 3)= randomed other letters (C and V)
- Bp : sequence of 3 mixed characters (at leat 1 C and 1 V) - fillers (1 to 3)  = random other letters (C and V)
- C : 2 paires of fixed sequences (VV + CC) - fillers (1 to 2) = random other letters (C and V)
- Cp1 = CC + CC - fillers (1 to 2) = random other letters (C and V)
- Cp2 = VV + VV - fillers (1 to 2) = random other letters (C and V)
- Cp3 = (CC ou VV) + (CV ou VC) - fillers (1 to 2) = random other letters (C and V)
- Cp4 = 2 mixed pairs (CV ou VC) - fillers (1 to 2) = random other letters (C and V)
- D = VxV with x = random consonant and fillers (2 to 3 between each sequence) = random consonnants
*/
var stimlist = (function(){

	// Get a random integer between min (included) and max (included)
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
		
	// Randomly draw characters from chstr string, from minum to maxnum characters
	function randstr(chstr, minum, maxnum){
		var maxnum = (typeof maxnum === 'undefined') ? minum : maxnum;
		var nc_rand = getRandomInt(minum, maxnum);
		// rc is the random list build from random draw amongst of characters chstr string
		var rc = '';
		var nstr = chstr.length;
		var inichstr = chstr;

		// Build the chstr 
		while (rc.length < nc_rand) {
			
			var ir = getRandomInt(0, chstr.length - 1);	
			rc = rc + chstr[ir];
			// Remove the randomly drawn letter from the strch
			if (chstr.length > 1){
				// Remove the drawn letter form chstr
				chstr = chstr.replace(chstr[ir], '');
			}else{
				// Re-initialized chstr
				chstr = inichstr;				
			}
		}
		return rc;
	}

	// Remove characters in rmchars string from inistr string
	function removechars(inistr, rmchars){
		var torem = new RegExp('[' + rmchars + ']', 'g'); 
		var newstr = inistr.replace(torem, "");
		return newstr;	
	}

	// Shuffle characters in str string
	// Andy E. :  https://stackoverflow.com/questions/3943772/how-do-i-shuffle-the-characters-in-a-string-in-javascript
	function shuffle(str) {
		var a = str.split(""),
			n = a.length;

		for(var i = n - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}
		return a.join("");
	}
	
	var core = {};

	// Define list type according to nchar and to a random selection for nch >=100
	// + sequence (seq) and filler to be use by stimlist.make function to create the list
	core.init = function(nchar){

		var nch = parseInt(nchar);
		
		var vow = 'AEIOU';
		var cons = 'BCDFGHJKLMNPQRSTVWXZ';
		var allchar = vow + cons;
		
		// Cas > 100
		// Build string of random length from minum to maxnum and
		// randomly selected letters from chstr 1 to 3 consonants		
		
		if (nch >= 100){
			// Same probability for the 6 list types
			var rlist = getRandomInt(1, 6);
			switch (rlist){
				// Sequence with 3 vowels
				case 1:
					var styp = 'A';
					var seq = randstr(vow, 3);	
					var filler = cons;
					var name = styp + '_' + seq;
					break;
				// Sequence with 3 consonants
				case 2:
					var styp = 'B';
					var seq = randstr(cons, 3);
					// Remove those cons from initial cons list	
					// Add vowels to the possible fillers characters
					var filler = removechars(cons, seq) + vow;
					var name = styp + '_' + seq;
					break;
				// Sequence mixing consonants and vowels (=> 1 to 2 vowels)
				case 3:
					// To ensure this to be really a Bp condition, need to force the presence of 1 to 2 vowels in the 3-letters sequence
					var styp = 'Bp';
					var svow = randstr(vow, 1, 2);
					var scon = randstr(cons, 3 - svow.length);
					var seq = shuffle(svow + scon);
					// Remove those consonants from initial cons list	
					var filler = removechars(allchar, seq);
					var name = styp + '_' + seq;
					break;
							// 1 pair of vowels + 1 pair of consonants
				case 4:
					var styp = 'C';
					// Define pair of vowels and pair of consonnes
					var seq_a = randstr(vow, 2);
					var seq_b = randstr(cons, 2);	
					var seq = [seq_a, seq_b];	
					var filler = removechars(allchar, seq_a + seq_b);	
					var name = styp + '_' + seq_a + seq_b;
					break;
				// Define 2 pairs of arbritary characters (cons/vow)
				// But different from case 1 
				case 5:	
					// At list one vowel in one of the two pairs

					var ns = getRandomInt(1, 5);
					switch (ns) {
						// 2 pairs of consomns
						case 1:
							var styp = 'Cp1';
							var seq_a = randstr(cons, 2);
							var seq_b = randstr(removechars(cons, seq_a), 2);
							break;					
						// 2 pairs of vowels
						case 2:
							var styp = 'Cp2';
							var seq_a = randstr(vow, 2);
							var seq_b = randstr(removechars(vow, seq_a), 2);
							break;
						// 1 pair mixed + 1 pair of consonants only
						case 3: 
							var styp = 'Cp3';
							var seq_a = shuffle(randstr(vow, 1) + randstr(cons, 1));
							var seq_b = randstr(removechars(cons, seq_a), 2);
							break;
						// 1 mixed pair + 1 pair of vowels only
						case 4:
							var styp = 'Cp3';
							var seq_a = shuffle(randstr(vow, 1) + randstr(cons, 1));
							var seq_b = randstr(removechars(vow, seq_a), 2);
							break;							
						// 2 pairs with one cons + 1 vow each
						case 5:
							var styp = 'Cp4';
							var seq_a = shuffle(randstr(vow, 1) + randstr(cons, 1));
							var seq_b = shuffle(randstr(removechars(vow, seq_a), 1) + randstr(removechars(cons, seq_a), 1));
							break;
					}
					var seq = [seq_a, seq_b];
					var filler = removechars(allchar, seq_a + seq_b);
					var name = styp + '_' + seq_a + seq_b;
					break;
				case 6:
					// AxB type with A and B = vowels and x = random consonnant
					var styp = 'D';
					var seq = randstr(vow, 2);
					var filler = cons;
					var name = styp + '_' + seq[0] + 'x' + seq[1];
			}

		}else{	
			// Add 'Y' letter for game with list of only random letters (no regularity)
			var styp ='R';
			// List is only made by fillers randomly selected
			var filler = randstr(allchar + 'Y', nch);
			var seq = '';
			var name = styp;
		}		
		
		return {nchar: nch, 
				type: styp,
				seq: seq,
				filler: filler,
				idname: name};
	};

	core.make = function(nchar){
		var listparam = core.init(nchar);
		var listyp = listparam.type[0];	
		var nch = listparam.nchar;
		var id = listparam.idname;
		
		var filler = (typeof listparam.filler === 'undefined') ? "" : listparam.filler;
		var seq = (typeof listparam.seq === 'undefined') ? "" : listparam.seq;
		// Lists with sequences of 3 characters
		if (listyp=='A' || listyp=='B'){
			var the_list = randstr(filler, 1, 3);
			var ns = the_list.length;
			while (ns < nch) {				
				if (ns < nch-5){
					the_list = the_list + seq + randstr(filler, 1, 3);	
					
				}else if ( (ns >= nch-5) && (ns < nch-3) ) {
					// ns>=95 & ns<97 -- Add sequence only 
					the_list = the_list + seq;
				}else if ( (ns >= nch-3) && (ns < nch)) {
					// ns>=97 & ns<nch -- Add fillers only
					the_list = the_list + randstr(filler, nch-ns, nch-ns);
				}		
				ns = the_list.length;
			}
		// Lists with sequences = 2 pairs of characters
		}else if (listyp=='C'){
			var the_list = randstr(filler, 1, 2);
			var ns = the_list.length;
			while (ns < nch) {		
				var the_seq = seq[getRandomInt(0, 1)];
				if (ns < nch-4){
					the_list = the_list + the_seq + randstr(filler, 1, 2);	
					
				}else if ( (ns >= nch-4) && (ns < nch-2) ) {
					// ns>=96 & ns<98 -- Add sequence + rest of fillers 
					the_list = the_list + the_seq + randstr(filler, nch-ns-2, nch-ns-2);
				}else if (ns == nch-2)  {
					// ns>=97 & ns<nch -- Add fillers only
					the_list = the_list + the_seq;
				}else if (ns == nch-1){
					the_list = the_list + randstr(filler, nch-ns, nch-ns);
				}		
				ns = the_list.length;
			}
		// List with pseudo-sequence of type AXB with X = random letter & A and B = vowels
		}else if (listyp=='D'){
			var the_list = randstr(filler, 2, 3);
			var ns = the_list.length;
			while (ns < nch) {
				var the_seq = seq[0] + randstr(filler, 1) + seq[1];
				if (ns < nch-5){
					the_list = the_list + the_seq + randstr(filler, 2, 3);	
				}else if ( ns == nch - 8){
					the_list = the_list + the_seq + randstr(filler, 2, 2);	
				}else if ( (ns >= nch-5) && (ns < nch-2) ) {
					// ns>=95 & ns<98 -- Add sequence only 
					the_list = the_list + the_seq;
				}else if ( (ns >= nch-2) && (ns < nch)) {
					// ns>=97 & ns<nch -- Add fillers only
					the_list = the_list + randstr(filler, nch-ns, nch-ns);
				}		
				ns = the_list.length;
			}
		}else if (listyp=='R'){
		
			var the_list = filler;
		}
		
		return {
			charlist: the_list,
			idname: id
		}
	};

	return core;
})();