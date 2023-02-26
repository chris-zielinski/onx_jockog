<?php
/* Database connection for online experiments using PDO
Table name is defined here.
The database connexion is defined as the $dba object.

* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/

//---- Name of the main data table
// $tname = 'ar_data_pretest_0130';

//---------------------
// Connection parameters
require('connect.php');
// => define $usern and $pword
// and the table name

//---------------------
// Database connection

$dsn = 'mysql:host=' . $hname . ';dbname=' . $dname . ';charset=utf8';

$opt = array(
	// any occurring errors will be thrown as PDOException
	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
	// an SQL command to execute when connecting
	PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'"
);

try {
	$dba = new PDO($dsn, $usern, $pword, $opt);
//echo " Connected to database "; 
} 
catch(PDOException $e)
{
	echo "Connection to database FAILED <br>" . $e->getMessage();  
}
	
?>