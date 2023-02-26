<?php
/** Spy to get JavaScript error that is occuring in the user's browser
Adapted from https://github.com/posabsolute/jQuery-Error-Handler-Plugin

Set your e-mail address here

* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
**/

$to = "christelle.zielinski@blri.fr";  // Set your e-mail here
$subject = 'Jockg | JS error on '. $_GET['website'];
$message = 'Error: '. $_GET['message']. '<br />';
$message .= 'Url: '. $_GET['url']. '<br />';
$message .= 'Line: '. $_GET['line']. '<br />';
$message .= 'UserAgent: '. $_GET['userAgent']. '<br />';

$headers = "From: ". $_GET['from'] ."\r\n"; // Or sendmail_username@hostname by default
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
mail($to, $subject, $message, $headers);
die("message sent")

?>
