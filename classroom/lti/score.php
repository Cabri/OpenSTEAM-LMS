<?php

require_once __DIR__ . "/findrelativeroute.php";

$rootPath = findRelativeRoute();

require_once $rootPath . 'vendor/autoload.php';
require_once $rootPath . 'bootstrap.php';

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Lti\Controller\ControllerLtiScore;
use Lti\Entity\LtiScore;
use User\Entity\User;
use Classroom\Entity\ActivityLinkUser;
use Classroom\Entity\LtiTool;
use phpseclib\Crypt\RSA;

$headers = apache_request_headers();
$jwtToken = explode("Bearer ", $headers['Authorization'])[1];


  $decodedToken = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.', $jwtToken)[1]))));
  
  $ltiIssuer = $decodedToken->sub;

  $ltiTool = $entityManager->getRepository(LtiTool::class)->findOneByClientId($ltiIssuer);

  try {
    // TODO: IT SHOULD BE BETTER TO GENERATE THE PUBLIC KEY HERE INSTEAD OF GETTING IT FROM THE JWKS ENDPOINT
    $jwks = json_decode(file_get_contents("https://{$_SERVER['HTTP_HOST']}/classroom/lti/certs.php"), true);

    JWT::$leeway = 60; // $leeway in seconds

    // check validity of access_token
    $validatedToken = JWT::decode(
      explode("Bearer ", $headers['Authorization'])[1],
      file_get_contents(__DIR__ . "/keys/public.key"),
      array('RS256')
    );

  } catch (\Exception $e) {
    echo json_encode(['Error:' => $e->getMessage()]);
    exit;
  }

// Read the input stream
$body = file_get_contents("php://input");
// Decode the JSON object
$grade = json_decode($body);

$activityId = $_REQUEST['activity_id'];
$scoreGiven = $grade->scoreGiven ?? null;
$scoreMaximum = $grade->scoreMaximum ?? null;
$activityProgress = $grade->activityProgress;
$gradingProgress = $grade->gradingProgress;
$timestamp = $grade->timestamp;
$userId = $grade->userId;
$comment = $grade->comment;

try {
  // $lineItemId is the id of the activityLinkUser (sent back from the tool)
  $activityLinkUser = $entityManager->getRepository(ActivityLinkUser::class)->find($activityId);
  $activityLinkUser->setUrl($comment);

  if($gradingProgress == "FullyGraded") {
    $convertedScore = 3 / $scoreMaximum * $scoreGiven;
    $activityLinkUser->setNote((int) $convertedScore);
    $activityLinkUser->setCorrection(2);
  } 
  else {
    // set correction field to 1 (teacher must manually give score)
    $activityLinkUser->setCorrection(1);
  }

  $entityManager->flush();

} catch(Exception $e) {
  echo json_encode(['Error:' => $e->getMessage()]);
}