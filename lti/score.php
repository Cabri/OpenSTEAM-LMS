<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;

$headers = apache_request_headers();

try {
  // check validity of access_token
  $decoded = JWT::decode(
    explode("Bearer ", $headers['Authorization'])[1],
    file_get_contents(__DIR__ . "/keys/public.key"),
    array('RS256')
  );

  var_dump($decoded);

  // create score in database

} catch(exception $A) {
  echo $A;
}


?>
