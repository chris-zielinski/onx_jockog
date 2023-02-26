<?php
/*
 Saving the data from AppReg experiment to mySQL database using PDO 
 jsPsych data are submitted as a unique string (json-encoded object)

The database must contain the table $tname with at least 
the 4 columns : subjID, subjinfo, game and jsonData
The table is created if it doesn't exist yet.


* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/


//---- Database connection
// Return database object ($dba)
// and the name of the table ($tname variable)

require("db_connect.php");
// => $dba
// => $tname 
$tname = $tname_data;

//---------------------
// Create $tname table if not yet

$istable = $dba->query("SHOW TABLES LIKE '".$tname."'")->rowCount() > 0;
if (!$istable){

	try {
		$sql = "CREATE TABLE ".$tname."(
		ID int(11) NOT NULL auto_increment,
		subjID  varchar(200) character set utf8 collate utf8_bin NOT NULL,
		subjinfo varchar(256) character set utf8 collate utf8_bin NOT NULL,
		game varchar(20) character set utf8 collate utf8_bin NOT NULL,
		jsonData text character set utf8 collate utf8_bin NOT NULL,
		PRIMARY KEY  (ID)
		)";
		$dba->exec($sql);
		echo " Table ".$tname." created successfully ";
    }
	catch(PDOException $e)
	{
		echo "Error creating table: <br>" . $e->getMessage();
    }
}	

//---------------------
// Get the data submitted in the main experiment script 
// by POST method (using jQuery.ajax)

// subject ID 
$id = $_POST['subjid'];

// subject info
$uinfo = $_POST['subjinfo'];

// Blocks order (typing)
$game = $_POST['game'];

// json jsPsych data
$jsdata = $_POST['json'];


//---------------------
// Insert it into the data table

try {
    $req = $dba->prepare('INSERT INTO '.$tname.'(subjID, subjinfo, game, jsonData) 
						VALUES(:subjID, :subjinfo, :game, :jsonData)'); 

    $req->execute(array(
        'subjID' => $id,
        'subjinfo' => $uinfo,
		'game' => $game,
        'jsonData' => $jsdata
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