<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
/*
Get subject's rank for the current game (AppReg experiment)
depending on his score and of the other participant's scores that are store 
on the associated scores table

See http://stackoverflow.com/questions/13037495/basic-ranking-of-mysql-data-and-printing-result-with-php

* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/

/*-------- PARAMETERS -----------------------*/

//---- Database connection
// Return database object ($dba)
require("db_connect.php");
// => $dba 

// Get game type (number of displayed chars) 
$nch = $_GET['nch_game'];
// Subject score in ms
$subjscore = $_GET['subj_score'];
// Subject age range
$subjage = $_GET['subj_rage'];

// Relative table name that holds the scores
$tnameg = $tname_score.$nch;

/*--------------------------------------------*/

// Total number of scores
$sel = "SELECT count(ID) FROM ".$tnameg;
$nrow = $dba->query($sel)->fetchColumn();

$rank = 1;
if ($nrow > 1){
	// Get the subject's rank amongst the subjects with the same age range
	if ($subjage > 0){
		// Number of subjects in the same age range
		$gnum = $dba->prepare("SELECT count(*) FROM ".$tnameg." WHERE agerange = ".$subjage);
		$gnum->execute(); 
		// $nsubj = 1 (the current subject whom score has been previously saved) or > 1 (the subject + the others)
		$nsubj = $gnum->fetchColumn();
		// as score has been previously saved with the subject's agerange, $nsubj is at least == 1
		if ($nsubj > 1){
			// Count how many scores are < subject's score amongst the same age range
			// Min value = 1 - subject is at least 1 rank after score < its score (if no score < its score, rank = 1 too)
			$scorq = $dba->prepare("SELECT count(*)+1 FROM ".$tnameg." WHERE agerange = ".$subjage." AND scores < ".$subjscore);
			$scorq->execute(); 
			$rank = $scorq->fetchColumn();	
			// Remove 1 if all scores are < subject's score
			if ($rank == $nsubj + 1){
				$rank = $nsubj;
			}
		} else {
			// Only the current subject in the database => its rank = 1/1
			$rank = 1;
		}
	} else {  
		// if ($subjage==0){
		// Take all previous participants into account (no age category)	
		$scorq = $dba->prepare("SELECT count(*)+1 FROM ".$tnameg." WHERE scores < ".$subjscore);
		$scorq->execute(); 
		$rank = $scorq->fetchColumn();
		// If worst score, ( total number of score < subject score ) + 1 will exceed total number of participant 
		if ($rank == $nrow + 1){
			$rank = $nrow;
		}		
		$nsubj = $nrow;
	}
} else {
	$nsubj = 1;	
}

$scoredata = array("rank" => $rank, "ntotal" => $nsubj);	

// Disable the connection
$dba = null;

echo json_encode($scoredata);

?>

