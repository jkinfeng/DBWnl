<?php
$myfile = null;
$txt = '';
if(isset($_POST['month'])) {
    $myfile = fopen("wnl.json", "a") or die("Unable to open file!");
    $txt = $_POST['month'];
}
if(isset($_POST['jq'])) {
    $myfile = fopen("jq.json", "a") or die("Unable to open file!");
    $txt = $_POST['jq'];
    $txt = substr($txt,0,strlen($txt)-1);
    $txt = '{"jq":[' . $txt . ']}';
}
fwrite($myfile, $txt . "\r\n");
fclose($myfile);