const Informations = JSON.parse(getCookie('info'));
Informations.groupName = Informations.groupName.split('+').join(' ');

if ($_GET('page')) {
    let page = $_GET('page');
    switch (page) {
        case 'registration':
            $("#classroom-register-container").toggle();
            break;
        case 'confirmation':
            $("#account-activated").toggle();
            break;
        case 'login':
            delayDivUpdate('#classroom-desc', Informations.groupName);
            $('#classroom-login-container-bis').toggle();
            $("#classroom-create-account").toggle();
            break;
        case 'badlink':
            delayDivUpdate('#gourpName3', Informations.linkCode);
            $('#group-not-found').toggle();
            break;
        case 'invalidlink':
            $('#invalid-link').toggle();
            break;
        case 'confirm':
            delayDivUpdate('#groupNameConfirmLink', Informations.groupName);
            $('#confirm-link-to-group').toggle();
            break;
        case 'success':
            delayDivUpdate('#gourpName', Informations.groupName);
            $('#group-joinded-container').toggle();
            break;
        case 'alreadyactive':
            $('#already-active').toggle();
            break;
        case 'alreadylinked':
            $('#already-linked').toggle();
            break;
        case 'noteacher':
            $('#no-teacher').toggle();
            break;
        default:
            break;
    }
} else {
    $('#classroom-login-container-bis').toggle();
    $('#classroom-desc').text("Vous êtes invité dans le groupe : " + Informations.groupName);
}

function changeTypeInputPassword(input) {
    if ($('#' + input).attr('type') == "password")
        $('#' + input).prop('type', 'text');
    else
        $('#' + input).prop('type', 'password');
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

// if not delayed, the span appear after this line and the group name is not showed
function delayDivUpdate(div, message) {
    setTimeout(() => {
        $(div).text(message);
    }, 150);
}

function loginTeacher(payload) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=user&action=login",
            data: payload,
            success: function (response) {
                resolve(JSON.parse(response))
            },
            error: function () {
                reject();
            }
        });
    })
}

$('#connect-teacher').click(function () {
    $('#connect-teacher').attr('disabled', true);
    checkLoginTeacher();
})


function checkLoginTeacher() {
    let form = {
        'mail': $('#user-pseudo-form').val(),
        'password': $('#user-password-form').val()
    }

    loginTeacher(form).then(function (response) {
        if (response.success === true) {
            goToConfirm();
        } else {
            var infoBox = document.getElementById("info-box");
            infoBox = document.createElement("div");
            infoBox.className = "alert alert-danger";
            if (response.success == false) {
                infoBox.innerHTML = i18next.t('login_popup.error');
            } else {
                infoBox.innerHTML = i18next.t('login_popup.errorBeta');
            }
            document.getElementById("info-div").innerHTML = "";
            document.getElementById("info-div").style.display = "none";
            document.getElementById("info-div").appendChild(infoBox);
            $("#info-div").fadeIn("slow");
        }
        $('#connect-teacher').attr('disabled', false);
    })
}

$('#register-new-teacher').click(() => {
    $('#classroom-register-container').toggle();
    $('#classroom-login-container-bis').toggle();
})

/**
 * Create teacher form submit listener
 */
document.getElementById('create-teacher-account-and-link-to-group-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let data = new FormData(e.target);
    if (teacherAccountCreateFormCheckv2(data)) {
        createTeacherAccountv2(data).then((response) => {
            if (response.isUserAdded) {
                document.getElementById('profile-form-password').value = '';
                document.getElementById('profile-form-confirm-password').value = '';
                displayNotification('#notif-div', "classroom.notif.accountCreated", "success");
                $("#registration-successful").toggle();
                $("#classroom-register-container").toggle();
                $('#gourpName2').text(Informations.groupName);
            } else {
                if (response.errorType) {
                    switch (response.errorType) {
                        case 'unknownUser':
                            displayNotification('#notif-div', "classroom.notif.unknownUser",
                                "error");
                            break;
                        default:
                            break;
                    }
                }
                if (response.errors) {
                    for (let error in response.errors) {
                        displayNotification('#notif-div', `classroom.notif.${error}`, "error");
                    }
                }
            }
        });
    }
});

/**
 * Create teacher account (registration)
 */
function createTeacherAccountv2(formData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: '/routing/Routing.php?controller=groupadmin&action=registerTeacher',
            data: {
                'firstname': formData.get('first-name'),
                'surname': formData.get('last-name'),
                'pseudo': formData.get('nickname'),
                'email': formData.get('email'),
                'password': formData.get('password'),
                'password_confirm': formData.get('confirm-password'),
                'bio': formData.get('mini-bio'),
                'pseudo': formData.get('pseudo'),
                'phone': formData.get('phone-number'),
                'school': formData.get('school'),
                'grade': parseInt(formData.get('grade')) + 1,
                'subject': parseInt(formData.get('subject')) + 1,
                'newsletter': $('#cb_newsletter').is(':checked'),
                'private': $('#cb_name_public').is(':checked'),
                'mailmessage': $('#cb_alert_mail').is(':checked'),
                'contact': $('#cb_allow_contact').is(':checked'),
                'gcode': $_GET('gc')
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


/**
 * Link the teacher to the group
 */
function linkTeacherToGroup(user, group) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: '/routing/Routing.php?controller=groupadmin&action=linkTeacherToGroup',
            data: {
                'user_id': user,
                'group_id': group
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

function linkTeacherToGroupProcess() {
    $('#linkTeacherToGroupBtn').attr('disabled', true);
    linkTeacherToGroup(Informations.userId, Informations.groupId).then((response) => {
        document.location = Informations.urlWithCode + `&page=${response.message}`;
    })
}


/**
 * Check if the teacher's account update form values are correct
 * @returns {boolean} - true if check ok, false otherwise
 */
function teacherAccountCreateFormCheckv2(formData) {

    let formValues = {
            'firstname': {
                value: formData.get('first-name'),
                id: 'profile-form-first-name'
            },
            'surname': {
                value: formData.get('last-name'),
                id: 'profile-form-last-name'
            },
            'email': {
                value: formData.get('email'),
                id: 'profile-form-email'
            },
            'password': {
                value: formData.get('password'),
                id: 'profile-form-password'
            },
            'confirmPassword': {
                value: formData.get('confirm-password'),
                id: 'profile-form-confirm-password'
            },
            'bio': {
                value: formData.get('mini-bio'),
                id: 'profile-form-bio'
            },
            'phone': {
                value: formData.get('phone-number'),
                id: 'profile-form-phone'
            },
            'school': {
                value: formData.get('school'),
                id: 'profile-form-school'
            },
            'grade': {
                value: formData.get('grade'),
                id: 'profile-form-grade'
            },
            'subject': {
                value: formData.get('subject'),
                id: 'profile-form-subject'
            }
        },
        errors = [];

    for (let input in formValues) {
        let currentElt = document.getElementById(formValues[input].id);
        if (currentElt.classList.contains('form-input-error')) {
            currentElt.classList.remove('form-input-error');
        }
    }

    if (formValues.firstname.value.length < 2) {
        errors.push('firstNameTooShort');
        showFormInputError(formValues.firstname.id);
    }

    if (formValues.surname.value.length < 2) {
        errors.push('lastNameTooShort');
        showFormInputError(formValues.surname.id);
    }

    if (!formValues.email.value.match(
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )) {
        errors.push('invalidEmail');
        showFormInputError(formValues.email.id);
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

/**
 * Add the error class on input form
 * @param {string} id - the id of the form input
 */
function showFormInputError(id) {
    document.getElementById(id).classList.add('form-input-error');
}

// Grade select gestion
$('#profile-form-grade').change(() => {
    switch ($('#profile-form-grade').val()) {
        case "0":
            createSubjectSelectTeacherForm(getSubjects(0));
            break;
        case "1":
            createSubjectSelectTeacherForm(getSubjects(1));
            break;
        case "2":
            createSubjectSelectTeacherForm(getSubjects(2));
            break;
        case "3":
            createSubjectSelectTeacherForm(getSubjects(3));
            break;
        case "4":
            createSubjectSelectTeacherForm(getSubjects(4));
            break;
        default:
            break;
    }
})

function createSubjectSelectTeacherForm(array) {
    $("#profile-form-subject").empty();
    for (let index = 0; index < array.length; index++) {
        const o = new Option(array[index], index);
        $(o).html(array[index]);
        $("#profile-form-subject").append(o);
    }
}
createSubjectSelectTeacherForm(getSubjects(0));


function goToHome() {
    document.location = Informations.urlHome;
}

function goToLogin() {
    document.location = Informations.urlWithCode + "&page=login";
}

function goToSuccess() {
    document.location = Informations.urlWithCode + "&page=success";
}

function goToConfirm() {
    document.location = Informations.urlWithCode + "&page=confirm";
}