<?php
session_start();

$openClassroomDir = __DIR__."/../../openClassroom";
if(is_dir($openClassroomDir)){
    require __DIR__."/../../vendor/autoload.php";
    require __DIR__."/../../bootstrap.php";
} else {
    require __DIR__."/../vendor/autoload.php";
    require __DIR__."/../bootstrap.php";
}

use Dotenv\Dotenv;
use User\Entity\Regular;
use Classroom\Entity\Groups;
use Classroom\Entity\UsersLinkGroups;
use User\Entity\User;

// Load env variables 
$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

// make sure we receive a token from url params else set token to null
$groupCode = isset($_GET['gc']) ? trim(htmlspecialchars(preg_replace('/<[^>]*>[^<]*<[^>]*>/', '',$_GET['gc']))) : null;
$token = isset($_GET['token']) ? trim(htmlspecialchars(preg_replace('/<[^>]*>[^<]*<[^>]*>/', '',$_GET['token']))) : null;
$page = isset($_GET['page']) ? trim(htmlspecialchars(preg_replace('/<[^>]*>[^<]*<[^>]*>/', '',$_GET['page']))) : null;
$uri_parts = explode('?', $_SERVER['REQUEST_URI'], 2);

$url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]". $uri_parts[0];
$urlgc = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]". $uri_parts[0]."?gc=".$groupCode;
$urlhome = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]"."/classroom/home.php";

$group = $entityManager->getRepository(Groups::class)->findOneBy(['link' => $groupCode]);


// check if the user exists in db
if ($token) {
    $regularUserToActivate = $entityManager->getRepository(Regular::class)->findOneBy(array('confirmToken'=> $token));
    
    if (isset($_SESSION['id']) && $_SESSION['id'] != null) {
        // check if the link between the group and the user exist
        $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $_SESSION['id']]);
        $linkAlreadyExist = $entityManager->getRepository(UsersLinkGroups::class)->findOneBy(['user' => $user, 'group' => $group]);
    }
    
    $location="";

    if ($linkAlreadyExist) {
        $location = $urlgc."&page=alreadylinked";
    } else {
        // user not found in db, return error
        if (!$regularUserToActivate) {
            setcookie("invalidUser",true, strtotime("+1 minute"));
            $location = $urlgc."&page=alreadyactive";
        } else {
            // get user data from users table
            $userData = $entityManager->getRepository(User::class)->findOneBy(array('id'=> $regularUserToActivate->getUser()));
            // no $userData found, return an error
            if(!$userData){
                setcookie("invalidUserData",true, strtotime("+1 minute"));
                $redirect = "{$_ENV['VS_HOST']}/classroom";
            }
            // update user data in user_regulars and users tables
            $regularUserToActivate->setConfirmToken(null);
            $regularUserToActivate->setActive(true);
            $userData->setUpdateDate(new \DateTime());
            $entityManager->flush();
        
            // set the success cookie and redirect wether the user is logged or not
            setcookie("accountActivationSucceded",true, strtotime("+1 minute"));
            $location = $urlgc."&page=confirmation";
        
        }
    }
    // redirect the user 
    return header("Location: $location");
}

    

$grouName = "";
$groupId = "";
if ($group) {
    $grouName = $group->getName();
    $groupId = $group->getId();
}

$userId = isset($_SESSION['id']) ? $_SESSION['id'] : '';


$informations = ['url' => $url, 
                'urlWithCode'=> $urlgc, 
                'urlHome' => $urlhome, 
                'groupName' => $grouName, 
                'linkCode' => $groupCode, 
                'groupId' => $groupId, 
                'userId' => $userId];
                
setcookie('info', json_encode($informations), time()+600);

if (strlen($groupCode) != 5 || !preg_match("/^[a-zA-Z0-9]+$/", $groupCode)) {
    return header("Location: $url?gc=00000&page=invalidlink");
}

if (!$group && $page != "badlink") {
    return header("Location: $url?gc=$groupCode&page=badlink");
}

if (isset($_SESSION['id']) && ($page != "confirm" && $page != "success" && $page != "alreadylinked" && $page != "badlink")) {
    return header("Location: $url?gc=$groupCode&page=confirm");
}

require_once(__DIR__ . "/header.html");
?>
    <link rel="stylesheet" href="/classroom/assets/css/main.css">
    </head>

    <body>

    <?php

    require_once(__DIR__ . "/group_invitation.html");
    require_once(__DIR__ . "/footer.html");

?>