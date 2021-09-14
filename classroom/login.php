<?php
session_start();
require_once(__DIR__ . "/../vendor/autoload.php");

use Utils\ConnectionManager;
use Database\DatabaseManager;
use DAO\SettingsDAO;
use DAO\RegularDAO;
use models\Regular;

$user = ConnectionManager::getSharedInstance()->checkConnected();
if ($user) {
    $tester = RegularDAO::getSharedInstance()->isTester($_SESSION['id']);
    $admin = RegularDAO::getSharedInstance()->isAdmin($_SESSION['id']);
    $testerProf = false;
    $adminProf = false;
    if (isset($_SESSION['idProf'])) {
        $testerProf = RegularDAO::getSharedInstance()->isTester($_SESSION['idProf']);
        $adminProf = RegularDAO::getSharedInstance()->isAdmin($_SESSION['idProf']);
    }
}
// Pourquoi cette ligne ? 
//&& (!$user instanceof Regular || ($tester || $admin || $testerProf || $adminProf))
if ($user) {
    header("Location: /classroom/home.php");
    die();
}

require_once(__DIR__ . "/header.html");
?>
<link rel="stylesheet" href="/classroom/assets/css/main.css">

<script src="./assets/js/lib/rotate.js"></script>
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />
</head>

<body>
    <?php
    require_once(__DIR__ . "/login.html");
    ?>

    <?php
    require_once(__DIR__ . "/footer.html");
    ?>