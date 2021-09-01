<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;

$tool_jwks_keys_url = "https://9985-82-216-88-13.ngrok.io/keys";

// decode jwt token and check signature using jwks public key
$decoded = JWT::decode($_REQUEST['JWT'], JWK::parseKeySet(json_decode(file_get_contents($tool_jwks_keys_url), true)), array('RS256'));
$contentItemsLabel = "https://purl.imsglobal.org/spec/lti-dl/claim/content_items";

//print_r($decoded->$str[0]->custom->value);

// here save activity url in db
?>

<script>
  window.onload = function() {
    // send deeplink url to parent window
    window.parent.postMessage('<?php echo $decoded->$contentItemsLabel[0]->custom->value; ?>', '*')
  }
</script>


