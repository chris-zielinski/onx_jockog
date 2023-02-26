<?php
/*
Save the participant's score (RT) 
in the table associated with the current game 
(depending on the number of characters stimuli)
AppReg Experiment

* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/

//---- Database connection
// Return database object ($dba)
require("db_connect.php");
// => $dba

// Get game type (number of displayed chars) 
$nch = $_POST['nch_game'];
$subjscore = $_POST['subj_score'];
$subjage = $_POST['subj_rage'];

// Relative table name that holds the scores
$tnameg = $tname_score.$nch;

//---------------------
// Create $tname table if it's not existing yet

$istable = $dba->query("SHOW TABLES LIKE '".$tnameg."'")->rowCount() > 0;
if (!$istable){
	// See http://www.cloudconnected.fr/2009/04/09/mysql-int11-a-la-meme-taille-que-int3/
	try {
		$sql = "CREATE TABLE ".$tnameg."(
		ID smallint unsigned not null auto_increment,
		agerange tinyint unsigned not null,
		scores  mediumint unsigned not null,
		PRIMARY KEY  (ID)
		)";
		$dba->exec($sql);
		echo " Table ".$tnameg." created successfully ";
    }
	catch(PDOException $e)
	{
		echo "Error creating table: <br>" . $e->getMessage();
    }
}	

//---------------------
// Insert new score into the data table

try {
    $req = $dba->prepare('INSERT INTO '.$tnameg.'(agerange, scores) 
						VALUES(:agerange, :scores)'); 

    $req->execute(array(
		'agerange' => $subjage,
        'scores' => $subjscore
    ));
		
    echo '  Insertion OK ! ';
}
catch(PDOException $e)
{
    echo " Echec de l'insertion <br>".$e->getMessage();
}


//---------------------
// Disable the connection

$dba = null;

?>