<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once '../bootstrap.php';

use Firebase\JWT\JWK;

use Firebase\JWT\JWT;
use Lti\Controller\ControllerLtiScore;

$headers = apache_request_headers();

$dbHost = 'cabrisql';
$dbName = 'opensteam';
$dbUser = 'opensteam';
$dbPassword = 'opensteam-db';
$dsn = "mysql:host={$dbHost};dbname={$dbName}";


// check validity of access_token
$decoded = JWT::decode(
  explode("Bearer ", $headers['Authorization'])[1],
  file_get_contents(__DIR__ . "/keys/public.key"),
  array('RS256')
);

//var_dump($decoded);

// Read the input stream
$body = file_get_contents("php://input");
// Decode the JSON object
$object = json_decode($body, true);

//var_dump($object);


$lineItemId = urldecode($_REQUEST['lineitem']);
$scoreGiven = $object['scoreGiven'];
$scoreMaximum = $object['scoreMaximum'];
$activityProgress = $object['activityProgress'];
$gradingProgress = $object['gradingProgress'];
$timestamp = $object['timestamp'];
$userId = $object['userId'];
$comment = $object['comment'];


// TODO replace this  temporary fix
$lineItemId = str_replace('https:/', 'https://', $lineItemId);

echo $lineItemId;

try {
  $db = new PDO($dsn,$dbUser,$dbPassword);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  /*
    $lineItemId = 'https://cabri.blob.core.windows.net/shared/seif.benomar/C01_determiner_les_coordonnees_dun_point_du_plan_repere_orthonorme.clmc';
    $scoreGiven = 70;
    $scoreMaximum = 100;
    $activityProgress = 'InProgress';
    $gradingProgress = 'Graded';
    $timestamp = 1234567;
    $userId = 6;*/

  $data = [
    'score_given' => $scoreGiven,
    'score_maximum' => $scoreMaximum,
    'activity_progress' => $activityProgress,
    'grading_progress' => $gradingProgress,
    'user_id' => $userId,
    'id_lineitem' => $lineItemId,
    'timestamp' => $timestamp,
    'comment'=>$comment,
    'tag'=>'tag'
  ];

  $sql = "INSERT INTO lti_scores (score_given, score_maximum, activity_progress, grading_progress, user_id, id_lineitem, timestamp, comment, tag) VALUES (:score_given, :score_maximum, :activity_progress, :grading_progress, :user_id, :id_lineitem, :timestamp, :comment, :tag)";
  $ret = $db->prepare($sql)->execute($data);
} catch(Exception $e){
  // display errors
  echo $e->getMessage();
}

?>
