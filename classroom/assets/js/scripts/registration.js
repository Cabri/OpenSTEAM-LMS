if ($_GET('page')) {
    let page = $_GET('page');
    switch (page) {
        case 'invalid-token':
            $("#invalid-token").toggle();
            $("#registration-finalization-container").hide();
            break;
        case 'no-token':
            $("#no-token").toggle();
            $("#registration-finalization-container").hide();
            break;
        default:
            break;
    }
} else if (!$_GET('token')) {
    $("#no-token").show();
    $("#registration-finalization-container").hide();
}

function displayNotification(div, message, status, options = '{}') {
    let randId = Math.floor(Math.random() * Math.floor(10000))
    let html = `<div id='notif-` + randId + `' class="vitta-notif status-` + status + `" data-i18n="` + message + `" data-i18n-options=` + options + `><div class="vitta-notif-exit-btn"><i class="fa fa-times-circle"></i></div></div>`
    $(div).append(html)
    $(div).localize()
    setTimeout(function () {
        $('#notif-' + randId).remove()
    }, 15000);
}

function changeTypeInputPassword(input) {
    if ($('#' + input).attr('type') == "password")
        $('#' + input).prop('type', 'text');
    else
        $('#' + input).prop('type', 'password');
}

function finalizeRegistrationFormCheck(formData) {
    let formValues = {
            'password': {
                value: formData.get('password'),
                id: 'profile-form-password'
            },
            'confirmPassword': {
                value: formData.get('confirm-password'),
                id: 'profile-form-confirm-password'
            }
        },
        errors = [];

    for (let input in formValues) {
        let currentElt = document.getElementById(formValues[input].id);
        if (currentElt.classList.contains('form-input-error')) {
            currentElt.classList.remove('form-input-error');
        }
    }

    if (!formValues.password.value.length > 7) {
        errors.push('invalidPassword');
        showFormInputError(formValues.password.id);
    }

    if (formValues.password.value != formValues.confirmPassword.value) {
        errors.push('passwordAndConfirmMismatch');
        showFormInputError(formValues.password.id);
        showFormInputError(formValues.confirmPassword.id);
    }

    if (errors.length) {
        for (let error of errors) {
            displayNotification('#notif-div', `classroom.notif.${error}`, "error");
        }
        return false;
    } else {
        return true;
    }
}

document.getElementById('finalize-registration-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let data = new FormData(e.target);
    let token = getCookie('token');
    if (finalizeRegistrationFormCheck(data)) {
        finalizeRegistration(data, token).then((response) => {
            if (response.finalized == true) {
                $("#profile-form-password").val("");
                $("#profile-form-confirm-password").val("");
                displayNotification('#notif-div', "classroom.notif.accountCreated", "success");
                $('#success-registration').toggle();
                $("#no-token").hide();
                $('#registration-finalization-container').toggle();
            } else {
                if (response.message == "no user or already active") {
                    displayNotification('#notif-div', "manager.account.userNotFound", "error");
                } else if (response.message == "missing data") {
                    displayNotification('#notif-div', "manager.account.userNotFound", "error");
                }
            }
        });
    }
});

function finalizeRegistration(formData, token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: '/routing/Routing.php?controller=groupadmin&action=finalize_registration',
            data: {
                'password': formData.get('password'),
                'newsletter': $('#cb_newsletter').is(':checked'),
                'private': $('#cb_name_public').is(':checked'),
                'mailmessage': $('#cb_alert_mail').is(':checked'),
                'contact': $('#cb_allow_contact').is(':checked'),
                'token': token
            },
            success: function (response) {
                resolve(JSON.parse(response));
            },
            error: function () {
                reject();
            }
        });
    });
}

function goToLogin() {
    document.location = "/classroom/login.php";
}