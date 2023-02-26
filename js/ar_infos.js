/** Function to define the More_info section of the AppReg home page

* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/
function get_info(){

	var obj = { 
		title: "Objectifs",
		text: [
			"Nous réalisons avec ce jeu des recherches en psychologie sur les processus mentaux mis en œuvre dans l’écriture au clavier."]
	};

	var anonym = {
		title: "Anonymat",
		text: [	
			"Les données collectées sont <b>anonymes</b>, c'est-à-dire qu'elles ne contiennent aucune information permettant de vous identifier (vos nom et prénom, adresse physique et IP demeurent inconnus).",
			"La liste des données collectées est :"+ 
			"<ul><li style='list-style-type:square;'> la date de lancement de l'expérience depuis votre navigateur</li>"+
			"<li style='list-style-type:square;'> le type de navigateur (Firefox, Chrome, Opera) et sa version</li>"+
			"<li style='list-style-type:square;'> le système d'exploitation (Windows, Mac, Unix) et sa version</li>"+
			"<li style='list-style-type:square;'> les données de temps de frappe</li>"+
			"<li style='list-style-type:square;'> les données du questionnaire</li></ul>",
			"Les réponses du questionnaire sont utilisées pour analyser les données.", 
			"L'ensemble de ces données est stocké dans une base mySQL sur le serveur à l'aide d'un script PHP, à la toute fin de l'expérience. ",
			"L'accès aux pages de l'expérience n'engendre aucun dépôt de traceur (cookie) sur votre ordinateur.",
			"Ce site n'est pas déclaré à la CNIL car il ne recueille pas d'informations personnelles (« informations qui permettent, sous quelque forme que ce soit, directement ou non, l'identification des personnes physiques auxquelles elles s'appliquent » - article 4 de la loi n° 78-17 du 6 janvier 1978)."] 
	};

	var consent = {
		title: "Consentement",
	text: ["En acceptant de lancer l'expérience, vous donnez votre consentement à l'enregistrement des données et à leur utilisation à des fins de recherche scientifique. Du fait qu'elles soient anonymes, il sera impossible de les supprimer a posteriori de la base de données. Vous pouvez à tout moment quitter l'expérience (les données ne sont enregistrées dans la base qu'à la toute fin de l'expérience)."]
	};

	var respon = {
		title: "Limitation de responsabilité",
		text: [
			"L'expérience est jouée par votre navigateur à l'aide du langage JavaScript, et en particulier de la librairie <a target='_blank' href='jspsych.org'>jsPsych</a>. Ce langage est interprété par tous les navigateurs récents, il permet de rendre le contenu de la page dynamique – le contenu est modifié par votre navigateur directement, indépendamment du côté serveur. En aucun cas ce site ne pourra être tenu responsable de dommages matériels directs ou indirects liés à l'exécution de l'expérience par votre navigateur."]
	};

	var legal = { 
		title: "Mentions légales",
		text: [
			"Ce site a été conçu pour le projet de recherche mené par des personnels du <a target='_blank' href='http://www.cnrs.fr'>CNRS</a> et d'<a target='_blank' href='http://www.univ-amu.fr/'>Aix-Marseille Université</a>.",
			"<span class='important'>Identification</span> Arnaud Rey (CNRS et AMU) - LPC - Adresse : 3 Place Victor Hugo, 13003 Marseille, France - Téléphone : +33(0)4.13.55.09.95 - Courriel : arnaud.rey(at)univ-amu.fr ",
			"<span class='important'>Conception et réalisation</span> B. Favre<sup>1</sup>, A. Rey<sup>2</sup>, C. Zielinski<sup>3</sup> (<sup>1</sup><a target='_blank' href='http://www.lif.univ-mrs.fr/'>Laboratoire d'Informatique Fondamentale</a> ; <sup>2</sup><a target='_blank' href='http://lpc.univ-amu.fr/'>Laboratoire de Psychologie Cognitive</a> ; <sup>3</sup><a target='_blank' href='http://www.blri.fr/'>Brain and Language Research Institute</a>)",
			"<span class='important'>Responsable de la publication</span> Arnaud Rey",
			"<span class='important'>Hébergement</span> Serveur BLRI administré par Cyril Deniaud (Laboratoire Parole et Langage, Aix-en-Provence, AMU)"]
	};


	var scripts = {
		title: "Outils & scripts",
		text: ["<a target='_blank' href='http://docs.jspsych.org/'><img id='jspsychlogo' src='img/logo_jspsych.png' alt='Logo jsPsych' title='Vers le site de jsPsych' /></a>L'expérience a été développée à partir de la librairie <a target='_blank' href='jspsych.org'>jsPsych</a>. " +  
			"Le fond d'écran de la page d'accueil provient du site <a target='_blank' href='https://www.toptal.com/designers/subtlepatterns/squairy/'>Subtle Patterns</a>. "+
			"Les barres de défilement ont été générées grâce au plugin <a target='_blank' href='http://manos.malihu.gr/jquery-custom-content-scroller/'>jQuery custom content scroller</a>."]
	};
		
	var allinfos = [obj, anonym, consent, respon, legal, scripts];

	function put_lines(textarr){
		var Np = textarr.length;
		var spar = "";
		for (var k = 0 ; k < Np ; k++){
			spar += "<p>" + textarr[k] + "</p>";
		}
		return spar;
	}

	function put_infos(infos){
		
		var Ni = infos.length;
		var infotext = "";
		for (var i=0; i < Ni; i++){
			
			var infopart = infos[i];
			infotext += "<div class='legal_title shabox'>" + infopart.title + "</div>";
			infotext += put_lines(infopart.text);
		}
		return infotext;	
	}

	var infotxt = put_infos(allinfos);
	
	return infotxt;
}