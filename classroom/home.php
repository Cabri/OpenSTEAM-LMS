<?php
session_start();
use Dotenv\Dotenv;
require_once(__DIR__ . "/../vendor/autoload.php");
require_once '../bootstrap.php';

// load data from .env file
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

// load demoStudent name from .env file or set it to default demoStudent
$demoStudent = !empty($_ENV['demoStudent'])
                ? htmlspecialchars(strip_tags(trim($_ENV['demoStudent'])))
                : 'demoStudent';

if (isset($_SESSION['idProf'])) {
    $user = $entityManager->getRepository('User\Entity\User')
        ->find($_SESSION['idProf']);
} else if (isset($_SESSION['id'])) {
    $user = $entityManager->getRepository('User\Entity\User')
        ->find($_SESSION['id']);
}
if (empty($user)) {
   header("Location: /classroom/login.php");
}
// $regular = $entityManager->getRepository('User\Entity\Regular')
//     ->findOneBy(array('user' => $user->getId()));

/* $premium = $entityManager->getRepository('User\Entity\UserPremium')
    ->findOneBy(array('user' => $user)); */


/* $tester = $premium->isTester(); */
// $admin = $regular->getIsAdmin();
// if (!$regular && (/* !$tester && */!$admin)) {
//     header("Location: /classroom/login.php?warn=notester");
// }
require_once(__DIR__ . "/header.html");

// add script tag with demoStudent name to make it available on the whole site
echo "<script>const demoStudentName = `{$demoStudent}`</script>";

require_once(__DIR__ . "/home.html");
