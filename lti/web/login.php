<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db/example_database.php';

use \IMSGlobal\LTI;

//echo "sessionID: ";
//echo $_SESSION;

//echo '<pre>'; print_r($_SESSION); echo '</pre>';

// Launch OPEN ID CONNECT Login Request to The Tool Provider
// The request contains jwt containing all login information (ExampleDatabase())
LTI\LTI_OIDC_Login::new(new Example_Database())
    //->do_oidc_login_redirect(TOOL_HOST . "/lti/web/game.php")
    ->do_oidc_login_redirect("http://localhost:3000/player?")
    ->do_redirect();
?>
