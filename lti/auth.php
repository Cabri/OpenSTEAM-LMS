<?php

require_once __DIR__ . '/../vendor/autoload.php';

$nonce = base64_encode(random_bytes(16));

use \Firebase\JWT\JWT;
//require_once __DIR__ . '/../vendor/firebase/php-jwt/src/JWT.php';

$jwt_payload = [
  "iss" => 'http://localhost:7080',
  "aud" => ['client_id_php'],
  "sub" => 'client_id_php',
  "exp" => time() + 600,
  "iat" => time(),
  "nonce" => $nonce,
  "https://purl.imsglobal.org/spec/lti/claim/deployment_id" => '8c49a5fa-f955-405e-865f-3d7e959e809f',
  //"https://purl.imsglobal.org/spec/lti/claim/message_type" => "LtiResourceLinkRequest",
  "https://purl.imsglobal.org/spec/lti/claim/version" => "1.3.0",
  //"https://purl.imsglobal.org/spec/lti/claim/target_link_uri" => TOOL_HOST . "/game.php",
  "https://purl.imsglobal.org/spec/lti/claim/roles" => [
    "https://purl.imsglobal.org/vocab/lis/v2/institution/person#Student",
    "https://purl.imsglobal.org/vocab/lis/v2/membership#Learner",
    "https://purl.imsglobal.org/vocab/lis/v2/membership#Mentor"
  ]
];

if(strpos($_REQUEST['login_hint'], 'student-launch') === 0) {
  // Student Launch
}
else  {
  // Teacher Launch
  // Using deep link
  $jwt_payload["https://purl.imsglobal.org/spec/lti/claim/message_type"] = "LtiDeepLinkingRequest";
  $jwt_payload["https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"] =
    [
      "deep_link_return_url" => "http://localhost:7080/deeplink",
      "accept_types" => ["ltiResourceLink"]
    ];
  $jwt_payload["https://purl.imsglobal.org/spec/lti/claim/target_link_uri"] = "http://localhost:3000/deeplink";
}

$token = JWT::encode(
  $jwt_payload,
  file_get_contents(__DIR__ . "/keys/private.key"),
  'RS256'
);
?>

<form name="post_redirect" method="post" action="<?php echo $_REQUEST['redirect_uri']?>">
  <input type="hidden" name="state"  value="<?php echo $_REQUEST['state'] ?>">
  <input type="hidden" name="id_token" value="<?php echo $token ?>">
  <noscript>
    <input type="submit" value="Click here to continue">
  </noscript>
</form>
<script>
  window.onload = function() {
    document.getElementsByName('post_redirect')[0].style.display = 'none';
    document.forms["post_redirect"].submit();
  }
</script>

