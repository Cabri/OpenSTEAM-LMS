<?php

require_once __DIR__ . "/findrelativeroute.php";

$rootPath = findRelativeRoute();

require_once $rootPath . 'vendor/autoload.php';

require_once $rootPath . 'bootstrap.php';

use \Firebase\JWT\JWT;
use Classroom\Entity\ActivityRestrictions;
use Classroom\Entity\LtiTool;

$nonce = base64_encode(random_bytes(16));

$platform_url = getenv('VS_HOST');

$loginHint = json_decode($_REQUEST['login_hint'], true);

$ltiTool = $entityManager->getRepository(LtiTool::class)->findOneByClientId($_REQUEST['client_id']);

if (!$ltiTool) {
	echo 'Tool not found!';
	exit;
}

$jwt_payload = [
  "iss" => $platform_url,
  "aud" => $loginHint['deploymentId'],
  "sub" => $loginHint['userId'],
  "exp" => time() + 600,
  "iat" => time(),
  "nonce" => $nonce,
  "https://purl.imsglobal.org/spec/lti/claim/deployment_id" => $loginHint['deploymentId'],
  "https://purl.imsglobal.org/spec/lti/claim/version" => "1.3.0",
    "https://purl.imsglobal.org/spec/lti/claim/custom" => [
      "activityType" => $loginHint['activityType'],
      "isUpdate" => isset($loginHint['isUpdate']) ? true : false,
      "updateUrl" => $loginHint['updateUrl'] ?? '',
      "redirectionUrl" => $platform_url . '/lti/redirection.html',
      "studentResourceUrl" => isset($loginHint['studentResourceUrl']) ? $loginHint['studentResourceUrl'] : false
    ]
];

if($loginHint['deepLink']) {
  // Deep link launch
  $jwt_payload[  "https://purl.imsglobal.org/spec/lti/claim/roles"] =  [
    "http://purl.imsglobal.org/vocab/lis/v2/institution/person#Instructor"
  ];
  $jwt_payload["https://purl.imsglobal.org/spec/lti/claim/message_type"] = "LtiDeepLinkingRequest";
  $jwt_payload["https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"] =
    [
      "deep_link_return_url" => $platform_url . "/classroom/lti/deeplink.php",
      "accept_types" => ["ltiResourceLink"],
      "accept_presentation_document_targets"=> [
        "frame",
        "iframe",
        "window"
      ]
    ];
  $jwt_payload["https://purl.imsglobal.org/spec/lti/claim/target_link_uri"] = $ltiTool->getDeepLinkUrl();
}
else  {
  // Resource launch
  if ($loginHint['isStudentLaunch']) {
    $jwt_payload[  "https://purl.imsglobal.org/spec/lti/claim/roles"] =  [
      "https://purl.imsglobal.org/vocab/lis/v2/membership#Learner",
    ];
  } else {
    $jwt_payload[  "https://purl.imsglobal.org/spec/lti/claim/roles"] =  [
      "http://purl.imsglobal.org/vocab/lis/v2/institution/person#Instructor"
    ];
  }
  $jwt_payload['https://purl.imsglobal.org/spec/lti/claim/message_type'] = 'LtiResourceLinkRequest';
  $jwt_payload['https://purl.imsglobal.org/spec/lti/claim/resource_link'] = [
    "id" => $loginHint['lineitemId']
  ];
  $jwt_payload["https://purl.imsglobal.org/spec/lti/claim/launch_presentation"] = [
    "locale" => "en",
    "document_target" => "iframe",
    "return_url" => $platform_url . "/classroom/lti/redirection.html"
  ];
  $jwt_payload["https://purl.imsglobal.org/spec/lti/claim/target_link_uri"] = $loginHint['lineitemId'];
  $jwt_payload["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"] = [
    "scope" => [
			"https://purl.imsglobal.org/spec/lti-ags/scope/lineitem",
			"https://purl.imsglobal.org/spec/lti-ags/scope/lineitem.readonly",
			"https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly",
			"https://purl.imsglobal.org/spec/lti-ags/scope/score"
		],
		"lineitems" => $platform_url . "/classroom/lti/score.php",
		"lineitem" => $platform_url . "/classroom/lti/score.php?activity_id=" . urlencode($loginHint['activitiesLinkUser'])
  ];
}

$token = JWT::encode(
  $jwt_payload,
  //$ltiTool->getPrivateKey(),
   file_get_contents(__DIR__ . "/keys/private.key"),
  'RS256',
  $ltiTool->getKid()
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

