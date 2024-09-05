<?php
/**
 * This file is responsible for giving Access_tokens to tool providers
 * Access Token is used when the tool provider want to send the score to platform (score.php)
 * Copyright (C) 2022 Seif-Eddine Benomar - Cabrilog
 * Contribution to OpenSTEAM Project
*/

$rootPath = "../../";
require_once $rootPath . 'vendor/autoload.php';
require_once $rootPath . 'bootstrap.php';


use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Classroom\Entity\LtiTool;

// decode token without validation
$decodedToken = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.', $_REQUEST['client_assertion'])[1]))));

// retrieve the tool name (subject)
$subjectKey = "sub";
$subjectValue = $decodedToken->$subjectKey;

// todo HTTP_HOST is insecure (controlled by the client)
//$platform_url = isset($_SERVER['HTTPS']) ? 'https://' : 'http://' . $_SERVER['HTTP_HOST'];
$platform_url = $_ENV['VS_HOST'];

// decode jwt token and check signature using jwks public key
$ltiTool = $entityManager->getRepository(LtiTool::class)->findOneByClientId($subjectValue);
// check if toolname is trusted
if(!$ltiTool) return;

// validate the jwt token using the tool public key (jwk)
$validatedToken = JWT::decode(
  $_REQUEST['client_assertion'],
  JWK::parseKeySet(json_decode(file_get_contents($ltiTool->getPublicKeySet()), true), 'RS256'),
);

$contentItemsLabel = "https://purl.imsglobal.org/spec/lti-dl/claim/content_items";
$jwtCreationTime = time();
$jwtExpirationTime = $jwtCreationTime + 86400;

$payload = array(
  "iss" => $platform_url,
  "aud" => $validatedToken->iss,
  "sub" => $validatedToken->iss,
  "iat" => $jwtCreationTime,
  "exp" => $jwtExpirationTime
);

$jwt = JWT::encode(
  $payload,
  $ltiTool->getPrivateKey(),
  'RS256',
  $ltiTool->getKid()
);

$responseData = [
  "access_token" => $jwt,
  "token_type" => "Bearer",
  "expires_in" => $jwtExpirationTime
];

header('Content-type: application/json');
echo json_encode($responseData);
