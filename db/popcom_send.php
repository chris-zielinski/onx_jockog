<?php
/** Send participant's comments in an html format
	using the mail php function (AppReg experiment)
	
* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/

//====== Parameters
// Destination
$to = "...@..."; 
$from = "... <www-data@...>";
// Message subject
$subject = "Jockg | Comments";
// Line transition
$rowp = "\r\n";
//===========


//====== Get values to send
// Comments
$comment = $_GET['comment'];
// Prevent line with more than 70 characters (make new line)
$comment = wordwrap($comment, 70, "\r\n");
// Contact mail if provides
$mail =  $_GET['mail'];
//===========

$txt_msg = "<b>Commentaire : </b>".$comment. "<br />";
$txt_msg .= "<b>Contact : </b>".$mail. "<br />";

//====== Define e-mail header
$header = "From: ".$from.$rowp;
$header.= "MIME-Version: 1.0".$rowp;
$header.= "Content-Type: text/html; charset=\"UTF-8\"".$rowp;
$header.= "Content-Transfer-Encoding: 8bit".$rowp;
//==========

//====== Define the whole html message
$message = $rowp.$txt_msg.$rowp;


//====== Send email !!
mail($to, $subject, $message, $header);
//die("message sent")

?>


