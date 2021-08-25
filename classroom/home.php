<?php
session_start();
require_once(__DIR__ . "/../vendor/autoload.php");
require_once '../bootstrap.php';

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
require_once(__DIR__ . "/home.html");
