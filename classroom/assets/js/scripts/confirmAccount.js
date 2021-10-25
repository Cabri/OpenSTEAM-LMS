if ($_GET('page')) {
    let page = $_GET('page');
    switch (page) {
        case 'success':
            $("#account-activated").toggle();
            break;
        case 'user-not-found':
            $("#no-teacher").toggle();
            break;
        case 'already-active':
            $("#already-active").toggle();
            break;
        default:
            break;
    }
}

function goToLogin() {
    document.location = "/classroom/login.php";
}