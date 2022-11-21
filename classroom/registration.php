<?php
session_start();

$openClassroomDir = __DIR__ . "/../../openClassroom";
if (is_dir($openClassroomDir)) {
    require __DIR__ . "/../../vendor/autoload.php";
    require __DIR__ . "/../../bootstrap.php";
} else {
    require __DIR__ . "/../vendor/autoload.php";
    require __DIR__ . "/../bootstrap.php";
}

use Dotenv\Dotenv;
use User\Entity\Regular;
use Utils\ConnectionManager;

// Load env variables
$dotenv = Dotenv::createImmutable(__DIR__ . "/../");
$dotenv->safeLoad();

$uri_parts = explode('?', $_SERVER['REQUEST_URI'], 2);
$token = isset($_GET['token']) ? htmlspecialchars($_GET['token']) : null;
$page = isset($_GET['page']) ? htmlspecialchars($_GET['page']) : null;
$url = $_ENV['VS_HOST'] . $uri_parts[0];
$urlhome = $_ENV['VS_HOST'] . "/classroom/home.php";
setcookie("token", $token, time() + 3600);

if (isset($_SESSION['id'])) {
    $sessionUserId = intval($_SESSION["id"]);
    $sessionToken = htmlspecialchars(strip_tags(trim($_SESSION["token"])));

    $manager = ConnectionManager::getSharedInstance();
    $user = $manager->checkConnected();
    $res = $manager->deleteToken($sessionUserId, $sessionToken);
}

$redirect = "";
if ($token) {
    $regularUserToActivate = $entityManager->getRepository(Regular::class)->findOneBy(array('confirmToken' => $token));
    if (!$regularUserToActivate && $page != "invalid-token") {
        $redirect = $url . "?page=invalid-token&token=azerty";
    }
} else if ($page != "no-token") {
    $redirect = $url . "?page=no-token";
}
if ($redirect != "") {
    return header("Location: $redirect");
}

require_once(__DIR__ . "/header.html");
?>
<link rel="stylesheet" href="/classroom/assets/css/main.css?version=VERSIONNUM">
<script src="./assets/js/lib/rotate.js?version=VERSIONNUM"></script>
<link rel="stylesheet" type="text/css" href="assets/css/slick.css?version=VERSIONNUM">
</head>

<body>
<?php
require_once(__DIR__ . "/registration.html");
require_once(__DIR__ . "/footer.html");
