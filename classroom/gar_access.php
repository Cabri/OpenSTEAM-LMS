<?php session_start();
require_once(__DIR__ . "/../vendor/autoload.php");

use Utils\ConnectionManager;

require_once(__DIR__ . "/CAS.php");
$user = ConnectionManager::getSharedInstance()->checkConnected(); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Vittascience</title>
    <link rel="stylesheet" href="assets/js/lib/bootstrap-4.4.1/bootstrap.min.css">
    <link rel='stylesheet' type='text/css' href='/classroom/assets/css/main.css?version=VERSIONNUM' />
    <script src="assets/js/lib/marked.min.js?version=VERSIONNUM"></script>
    <link rel="stylesheet" href="assets/css/lib/fontAwesome-5.13.0/css/all.min.css">
</head>

<body>
</body>
