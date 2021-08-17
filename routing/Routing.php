<?php


require_once '../bootstrap.php';

use Utils\Exceptions\EntityDataIntegrityException;
use Utils\Exceptions\EntityOperatorException;
use Doctrine\DBAL\DBALException;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\ORMException;
use Utils\Backend\Errors;

use User\Controller\ControllerUser;

use Interfaces\Controller\ControllerProject;
use Interfaces\Controller\ControllerProjectLinkUser;

use Classroom\Controller\ControllerClassroom;
use Classroom\Controller\ControllerClassroomLinkUser;
use Classroom\Controller\ControllerActivityLinkUser;

use Learn\Controller\ControllerCourse;
use Learn\Controller\ControllerChapter;
use Learn\Controller\ControllerFavorite;
use Learn\Controller\ControllerLesson;
use Learn\Controller\ControllerComment;
use Learn\Controller\ControllerActivity;
use Learn\Controller\ControllerCourseLinkCourse;
use Learn\Controller\ControllerCollection;

use Lti\Controller\ControllerLtiScore;
use Lti\Controller\ControllerLtiLineItem;

use Monolog\Logger;
use VittaLogger\Log;

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__."/../");
$dotenv->safeLoad();

const OK = "OK";
$controller = isset($_GET['controller']) ? $_GET['controller'] : null;
$action = isset($_GET['action']) ? $_GET['action'] : null;

try {
    // Get User.
    session_start();
    $user = null;
    if (isset($_SESSION["id"])) {
        $user = $entityManager->getRepository('User\Entity\User')
            ->find(intval($_SESSION["id"]))->jsonSerialize();
        try {
            $regular = $entityManager->getRepository('User\Entity\Regular')
                ->find(intval($_SESSION["id"]))->jsonSerialize();
            $user['isRegular']  = $regular['email'];
        } catch (error $e) {
            $user['isRegular'] = false;
        }
    }
    // Intercept action.
    $logPath = $_ENV['LOG_PATH'] ?: "/logs/log.log";
    $log = Log::createSharedInstance($controller, $logPath, Logger::NOTICE);

    // get and scan the entire plugins folder
    $pluginsDir = '../plugins';
    if(is_dir($pluginsDir)){
        $pluginsFound = array_diff(scandir($pluginsDir), array('..', '.'));

        // scan each single plugin folder
        foreach($pluginsFound as $singlePlugin){
            $singlePluginFolders = array_diff(scandir("../plugins/$singlePlugin"), array('..', '.'));

            // convert snake_case from url param into PascalCase to find the right controller file to instanciate
            $ControllerToInstanciate = "Controller".str_replace('_', '', ucwords($controller, '_'));

            // check if a Controller folder exists in the plugins list
            if(in_array("Controller",$singlePluginFolders))
            {
                // check if the required controller file exists and require it
                if (file_exists("../plugins/$singlePlugin/Controller/$ControllerToInstanciate.php"))
                {
                    require_once "../plugins/$singlePlugin/Controller/".$ControllerToInstanciate.".php";

                    // instanciate the matching controller
                    $class = "Plugins\\Controller\\".$ControllerToInstanciate;
                    $controller = new $class($entityManager, $user);

                    // return data and exit the foreach loop with a break
                    echo (json_encode($controller->action($action, $_POST)));
                    $log->info($action, OK);
                    break ;
                }
            }
        }
    }

    switch ($controller) {
        case 'user':
            $controller = new ControllerUser($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST)));
            $log->info($action, OK);
            break;
        case 'project':
            $controller = new ControllerProject($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST)));
            $log->info($action, OK);
            break;
        case 'project_link_user':
            $controller = new ControllerProjectLinkUser($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST)));
            $log->info($action, OK);
            break;
        case 'classroom':
            $controller = new ControllerClassroom($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST)));
            $log->info($action, OK);
            break;
        case 'classroom_link_user':
            $controller = new ControllerClassroomLinkUser($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST)));
            $log->info($action, OK);
            break;
        case 'activity_link_user':
            $controller = new ControllerActivityLinkUser($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST)));
            $log->info($action, OK);
            break;
        case 'course':
            $controller = new ControllerCourse($entityManager, $user);
            // handle get and post
            echo (json_encode($controller->action($action, $_POST, true)));
            $log->info($action, OK);
            break;
        case 'collection':
            $controller = new ControllerCollection($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST, true)));
            $log->info($action, OK);
            break;
        case 'activity':
            $controller = new ControllerActivity($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST, true)));
            $log->info($action, OK);
            break;
        case 'chapter':
            $controller = new ControllerChapter($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST, true)));
            $log->info($action, OK);
            break;
        case 'favorite':
            $controller = new ControllerFavorite($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST, true)));
            $log->info($action, OK);
            break;
        case 'comment':
            $controller = new ControllerComment($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST, true)));
            $log->info($action, OK);
            break;
        case 'lesson':
            $controller = new ControllerLesson($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST, true)));
            $log->info($action, OK);
            break;
        case 'tutorial_link_tutorial':
            $controller = new ControllerCourseLinkCourse($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST, true)));
            $log->info($action, OK);
            break;
        case 'session':
            echo (json_encode($user));
            $log->info($action, OK);
            break;
        case 'lti_line_item':
            $controller = new ControllerLtiLineItem($entityManager, $user);
            echo (json_encode($controller->action($action, $_POST, true)));
            $log->info($action, OK);
            break;
        case 'lti_score':
          $controller = new ControllerLtiScore($entityManager, $user);
          echo (json_encode($controller->action($action, $_POST, true)));
          $log->info($action, OK);
          break;
        default:
            $log->warning(null, __FILE__, __LINE__, "Non matched controller");
            break;
    }
} catch (EntityDataIntegrityException $e) {
    $log->error($action, $e->getFile(), $e->getLine(), $e->getMessage());
    echo (json_encode(Errors::createError($e->getMessage())));
} catch (EntityOperatorException $e) {
    $log->error($action, $e->getFile(), $e->getLine(), $e->getMessage());
    echo (json_encode(Errors::createError($e->getMessage())));
} catch (DBALException $e) {
    $log->error($action, $e->getFile(), $e->getLine(), $e->getMessage());
    echo (json_encode(Errors::createError($e->getMessage())));
} catch (PDOException $e) {
    $log->error($action, $e->getFile(), $e->getLine(), $e->getMessage());
    echo (json_encode(Errors::createError($e->getMessage())));
} catch (ORMException $e) {
    $log->error($action, $e->getFile(), $e->getLine(), $e->getMessage());
    echo (json_encode(Errors::createError($e->getMessage())));
} catch (Exception $e) {
    $log->error($action, $e->getFile(), $e->getLine(), $e->getMessage());
    echo (json_encode(Errors::createError($e->getMessage())));
}
