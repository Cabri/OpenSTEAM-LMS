<?php

require_once __DIR__ . '/../vendor/autoload.php';

$nonce = base64_encode(random_bytes(16));

use \Firebase\JWT\JWT;
//require_once __DIR__ . '/../vendor/firebase/php-jwt/src/JWT.php';
// todo HTTP_HOST is insecure (controlled by the client)
$platform_url = getenv('HTTP_HOST');
$tool_url = 'https://lti1p3.cabricloud.com';

$loginHint = json_decode($_REQUEST['login_hint'], true);

$jwt_payload = [
  "iss" => $platform_url,
  "aud" => ['client_id_php'],
  "sub" => $loginHint['userId'],
  "exp" => time() + 600,
  "iat" => time(),
  "nonce" => $nonce,
  "https://purl.imsglobal.org/spec/lti/claim/deployment_id" => '8c49a5fa-f955-405e-865f-3d7e959e809f',
  //"https://purl.imsglobal.org/spec/lti/claim/message_type" => "LtiResourceLinkRequest",
  "https://purl.imsglobal.org/spec/lti/claim/version" => "1.3.0",
  //"https://purl.imsglobal.org/spec/lti/claim/target_link_uri" => TOOL_HOST . "/game.php",
    "https://purl.imsglobal.org/spec/lti/claim/custom" => [
      "activityType" => $loginHint['activityType']
    ]
];

//if(strpos($_REQUEST['login_hint'], 'student-launch') === 0) {
if($loginHint['isStudentLaunch']) {
  // Student Launch

  // create a new lineitem in database  if lineitem doesn't exist

  //$lineItemId = explode("#", $_REQUEST['login_hint'])[1];

  $jwt_payload[  "https://purl.imsglobal.org/spec/lti/claim/roles"] =  [
    "https://purl.imsglobal.org/vocab/lis/v2/membership#Learner",
  ];

  $jwt_payload["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"] = [
      "scope" => [
        "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem",
        "https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly",
        "https://purl.imsglobal.org/spec/lti-ags/scope/score"
      ],
      // TODO hostname must be dynamic
      "lineitems"=> $platform_url . "/lti/tools/1/lineitems",
      "lineitem" => $platform_url . "/lti/tools/1/lineitems/" . urlencode($loginHint['activitiesLinkUser'])
      //"lineitem" => $platform_url . "/lti/tools/1/lineitems/" . urlencode($loginHint['lineitemId'])
      // def: http://lti1p3.cabricloud.com/<tool_id>/lineitems/<line_item_1>
    ];

    $jwt_payload['https://purl.imsglobal.org/spec/lti/claim/message_type'] = 'LtiResourceLinkRequest';
    $jwt_payload['https://purl.imsglobal.org/spec/lti/claim/resource_link'] = [
       "id" => $loginHint['lineitemId'],
      //"description": "Assignment to introduce who you are",
      //"title": "Introduction Assignment"
    ];
  $jwt_payload["https://purl.imsglobal.org/spec/lti/claim/target_link_uri"] = $tool_url;

}
else  {
  // Teacher Launch
  // Using deep link
  $jwt_payload[  "https://purl.imsglobal.org/spec/lti/claim/roles"] =  [
    "http://purl.imsglobal.org/vocab/lis/v2/institution/person#Instructor"
  ];

  $jwt_payload["https://purl.imsglobal.org/spec/lti/claim/message_type"] = "LtiDeepLinkingRequest";
  $jwt_payload["https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"] =
    [
      "deep_link_return_url" => $platform_url . "/lti/deeplink.php",
      "accept_types" => ["ltiResourceLink"]
    ];
  $jwt_payload["https://purl.imsglobal.org/spec/lti/claim/target_link_uri"] = $tool_url . "/deeplink";

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

