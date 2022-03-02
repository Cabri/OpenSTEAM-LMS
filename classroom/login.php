<?php
session_start();
require_once(__DIR__ . "/../vendor/autoload.php");

use Dotenv\Dotenv;
use DAO\RegularDAO;
use models\Regular;
use DAO\SettingsDAO;
use Utils\ConnectionManager;
use Database\DatabaseManager;

// load data from .env file
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

// load demoStudent name from .env file or set it to default demoStudent
$demoStudent = !empty($_ENV['VS_DEMOSTUDENT'])
                ? htmlspecialchars(strip_tags(trim($_ENV['VS_DEMOSTUDENT'])))
                : 'demoStudent';

$user = ConnectionManager::getSharedInstance()->checkConnected();

if ($user) {
    header("Location: /classroom/home.php");
    die();
}

require_once(__DIR__ . "/header.html");
?>
<link rel="stylesheet" href="/classroom/assets/css/main.css?version=1.2">

<script src="./assets/js/lib/rotate.js?version=1.2"></script>
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />
</head>

<body>
    <?php
    // add script tag with demoStudent name to make it available on the whole site
    echo "<script>const demoStudentName = `{$demoStudent}`</script>";
    require_once(__DIR__ . "/login.html");
    ?>

    <?php
    require_once(__DIR__ . "/footer.html");
    ?>
