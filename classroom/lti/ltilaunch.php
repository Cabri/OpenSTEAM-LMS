<?php
session_start();
/**
 * Handle sending a user to a tool provider to initiate a LTI resource launch.
 */

$rootPath = "../../";
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
$targetLinkUri = $_POST["target_link_uri"] ?? null;
$studentLaunch = $_POST["student_launch"] ?? null;
$activitiesLinkUser = $_POST["activities_link_user"] ?? null;
$studentResourceUrl = $_POST["student_resource_url"] ?? null;


if ($applicationType == null) {
	echo "Bad application requested!";
	exit;
}

if ($targetLinkUri == null) {
	echo "Bad target link uri requested!";
	exit;
}

if ($studentLaunch == null) {
	echo "Bad student launch requested!";
	exit;
} else {
	if ($studentLaunch == "true"){
		$studentLaunch = true;
	} else {
		$studentLaunch = false;
	}
}

if ($activitiesLinkUser == null) {
	echo "Bad activities link user requested!";
	exit;
}

if($studentResourceUrl == null) {
  echo "Bad student resource url requested!";
}

//$platform_url = isset($_SERVER['HTTPS']) ? 'https://' : 'http://' . $_SERVER['HTTP_HOST'];
$platform_url = $_ENV['VS_HOST'];

$ltiApplication = $entityManager->getRepository(Applications::class)->findOneBy(["name" => $applicationType])->getId();
$ltiTool = $entityManager->getRepository(LtiTool::class)->findOneBy(["application" => $ltiApplication]);

if (!$ltiTool) {
	echo 'Tool not found!';
	exit;
}

$loginHint = json_encode([
	"lineitemId" => $targetLinkUri,
	"userId" => $_SESSION["id"],
	"isStudentLaunch" => $studentLaunch,
	"activityType" => $applicationType,
	"activitiesLinkUser" => $activitiesLinkUser,
	"deploymentId" => $ltiTool->getDeploymentId(),
	"deepLink" => false,
	"studentResourceUrl" => $studentResourceUrl
]);

echo "
<form name='lti_student_login_form' action='{$ltiTool->getLoginUrl()}' method='post'>
	<input id='lti_student_iss' type='hidden' name='iss' value='{$platform_url}' />
	<input id='lti_student_login_hint' type='hidden' name='login_hint' value='{$loginHint}' />
	<input id='lti_student_client_id' type='hidden' name='client_id' value='{$ltiTool->getClientId()}' />
	<input id='lti_student_target_link_uri' type='hidden' name='target_link_uri' value='{$targetLinkUri}' />
</form>";

echo "
<script>
	document.forms['lti_student_login_form'].submit();
</script>";
