<?php

//set POST variables
$url = "http://sealang.net/lao/search.pl";

$queryStr = $_POST["query"];

$params = array(
	"dict" => "lao",
	"hasFocus"=>"orth",
	"approx"=>"",
	//"orth"=>"%E0%BA%81%E0%BA%B1%E0%BA%94",
	"orth"=>$queryStr,
	"phone"=>"",
	"def"=>"",
	"matchEntry"=>"any",
	"matchLength"=>"word",
	"matchPosition"=>"any",
	"anon"=>"on",
	"approxLao"=>"1",
	"ety"=>"",
	"pos"=>"",
	"usage"=>"",
	"subject"=>"",
	"useTags"=>"1",
	"hyphenateSyls"=>"0"
);

$postData = '';
// create name value pairs seperated by &
foreach ($params as $k => $v)
{
	$postData .= $k . '=' .$v.'&';
}
rtrim($postData,'&');

//phpinfo();

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
curl_setopt($ch,CURLOPT_HEADER, false);
curl_setopt($ch,CURLOPT_POST,count($postData));
curl_setopt($ch,CURLOPT_POSTFIELDS,$postData);

//execute post
$result = curl_exec($ch);

if ($result === false)
{
	echo "Error Number:" .curl_errno($ch)."<br>"; 
}

//close connection
curl_close($ch);

echo $result;

?>