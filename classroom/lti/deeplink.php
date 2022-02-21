<?php
/**
 * This file is responsible for recieving deeplink data sent by the tool provider
 */


require_once __DIR__ . "/findrelativeroute.php";

$rootPath = findRelativeRoute();

require_once $rootPath . 'vendor/autoload.php';
require_once $rootPath . 'bootstrap.php';

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Classroom\Entity\LtiTool;

$decodedToken = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.', $_REQUEST['JWT'])[1]))));

$clientId = $decodedToken->iss;

$ltiTool = $entityManager->getRepository(LtiTool::class)->findOneByClientId($clientId);

$jwksKeys = json_decode(file_get_contents($ltiTool->getPublicKeySet()), true);
// decode jwt token and check signature using jwks public key
$validatedToken = JWT::decode(
  $_REQUEST['JWT'],
  JWK::parseKeySet($jwksKeys),
  array('RS256'),
  $ltiTool->getKid()
);
$contentItemsLabel = "https://purl.imsglobal.org/spec/lti-dl/claim/content_items";
// here save activity url in db

//dd($validatedToken);
?>

<script>
  window.onload = function() {
    // send deeplink url to parent window
    //const msg = {type: 'end-lti-deeplink', content: '<?php //echo $validatedToken->$contentItemsLabel[0]->url; ?>'};
    const msg = {type: 'end-lti-deeplink', content: '<?php echo $validatedToken->$contentItemsLabel[0]->custom->value; ?>'};
    window.parent.postMessage(JSON.stringify(msg), '*')
  }
</script>


