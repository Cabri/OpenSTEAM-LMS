<?php
/**
 * This file is responsible for recieving deeplink data sent by the tool provider
 * Copyright (C) 2022 Seif-Eddine Benomar - Cabrilog
 * Contribution to OpenSTEAM Project
*/


$rootPath = "../../";

require_once $rootPath . 'vendor/autoload.php';
require_once $rootPath . 'bootstrap.php';

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Classroom\Entity\LtiTool;

$decodedToken = json_decode(base64_decode(str_replace('_', '/', str_replace('-','+',explode('.', $_REQUEST['JWT'])[1]))));

$clientId = $decodedToken->iss;

$ltiTool = $entityManager->getRepository(LtiTool::class)->findOneByClientId($clientId);

$jwksKeys = json_decode(file_get_contents($ltiTool->getPublicKeySet()), true);
$algo = 'RS256';
// decode jwt token and check signature using jwks public key
$validatedToken = JWT::decode(
  $_REQUEST['JWT'],
  JWK::parseKeySet($jwksKeys, $algo),
);
$contentItemsLabel = "https://purl.imsglobal.org/spec/lti-dl/claim/content_items";
// here save activity url in db

//dd($validatedToken);
?>

<script>
  window.onload = function() {
    // send deeplink url to parent window
    const msg = {
      type: 'end-lti-deeplink', 
      content: '<?php echo $validatedToken->$contentItemsLabel[0]->url; ?>',
      title: "<?php echo $validatedToken->$contentItemsLabel[0]->title; ?>",
      typeLtiTool: "<?php
        if (isset($validatedToken->$contentItemsLabel[0]->custom) && 
        isset($validatedToken->$contentItemsLabel[0]->custom->typeLtiTool)) {
          echo $validatedToken->$contentItemsLabel[0]->custom->typeLtiTool;
        }
      ?>",
      typeTool: "<?php
        if (isset($validatedToken->$contentItemsLabel[0]->custom) && 
        isset($validatedToken->$contentItemsLabel[0]->custom->typeTool)) {
          echo $validatedToken->$contentItemsLabel[0]->custom->typeTool;
        }
      ?>",
      autocorrect: "<?php
        if (isset($validatedToken->$contentItemsLabel[0]->custom) && 
        isset($validatedToken->$contentItemsLabel[0]->custom->autocorrect)) {
          echo $validatedToken->$contentItemsLabel[0]->custom->autocorrect;
        }
      ?>",
    };
    window.top.postMessage(JSON.stringify(msg), '*')
  }
</script>


