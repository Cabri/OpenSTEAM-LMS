<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;

$tool_jwks_keys_url = "https://e777241e7461.ngrok.io/keys";
$platform_url = "http://localhost:7080";

// decode jwt token and check signature using jwks public key

//TODO MUST VALIDATE JWT TOKEN BEFORE GIVING THE ACCESS TOKEN

try {
$decoded = JWT::decode($_REQUEST['client_assertion'], JWK::parseKeySet(json_decode(file_get_contents($tool_jwks_keys_url), true)), array('RS256'));
} catch(exception $A) {
  echo $A;
}

$contentItemsLabel = "https://purl.imsglobal.org/spec/lti-dl/claim/content_items";
$jwtCreationTime = time();
$jwtExpirationTime = $jwtCreationTime + 86400;

$payload = array(
  "iss" => $platform_url,
  "aud" => $decoded->iss,
  "sub" =>  $decoded->iss,
  "iat" => $jwtCreationTime,
  "exp" => $jwtExpirationTime
);

$jwt = JWT::encode($payload, file_get_contents(__DIR__ . "/keys/private.key"), 'RS256');

$responseData = [
  "access_token" => $jwt,
  "token_type" => "Bearer",
  "expires_in" => $jwtExpirationTime
];

header('Content-type: application/json');
echo json_encode($responseData);

?>

