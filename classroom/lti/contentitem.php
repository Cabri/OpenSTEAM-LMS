<?php
session_start();
/**
 * Handle sending a user to a tool provider to initiate a content-item selection.
 */
require_once __DIR__ . "/findrelativeroute.php";

$rootPath = findRelativeRoute();

require_once $rootPath . 'vendor/autoload.php';

require_once $rootPath . 'bootstrap.php';

use Classroom\Entity\Applications;
use Classroom\Entity\LtiTool;

if (empty($_SESSION["id"])) {
	echo "You must be logged in to use this file";
	exit;
}

if ($_SERVER["REQUEST_METHOD"] != "POST") {
	echo "Request method not allowed!";
	exit;
}

$applicationType = $_POST["application_type"] ?? null;
$isUpdate = $_POST["is_update"] ?? null;
$updateUrl = $_POST["update_url"] ?? null;

if ($applicationType == null) {
	echo "Bad application requested!";
	exit;
}

$platform_url = getenv('VS_HOST');

$ltiApplication = $entityManager->getRepository(Applications::class)->findOneBy(["name" => $applicationType])->getId();
$ltiTool = $entityManager->getRepository(LtiTool::class)->findOneBy(["application" => $ltiApplication]);

if (!$ltiTool) {
	echo 'Tool not found!';
	exit;
}

$loginHint = [
	"userId" => $_SESSION["id"],
	"isStudentLaunch" => false,
	"activityType" => $applicationType,
	"deploymentId" => $ltiTool->getDeploymentId(),
	"deepLink" => true
];

if ($isUpdate != null && $updateUrl != null) {
	$loginHint['isUpdate'] = $isUpdate;
	$loginHint['updateUrl'] = $updateUrl;
}

$loginHint = json_encode($loginHint);

echo "
<form name='lti_teacher_login_form' action='{$ltiTool->getLoginUrl()}' method='post'>
	<input id='lti_teacher_iss' type='hidden' name='iss' value='{$platform_url}' />
	<input id='lti_teacher_login_hint' type='hidden' name='login_hint' value='{$loginHint}' />
	<input id='lti_teacher_client_id' type='hidden' name='client_id' value='{$ltiTool->getClientId()}' />
	<input id='lti_teacher_deployment_id' type='hidden' name='deployment_id' value='{$ltiTool->getDeploymentId()}' />
	<input id='lti_teacher_target_link_uri' type='hidden' name='target_link_uri' value='{$ltiTool->getDeepLinkUrl()}' />
</form>";

echo "
<script>
	document.forms['lti_teacher_login_form'].submit();
</script>";
