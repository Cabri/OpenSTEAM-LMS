const AllViews = ['#classroom-login-container', '#login-container', '#classroom-register-container', '#home-container', '#classroom-login-container-bis'];

// Global param who check if it's the first request of class
let firstRequestClass = true;
let firstRegisterLoad = true;
function onUrlChange() {
    // Close all views
    closeAllViews();
    // Show the view needed
    if ($_GET('p')) {
        switch ($_GET('p')) {
            case 'login-choice':
                $('#classroom-login-container').show();
                break;
            case 'login-container':
                $('#login-container').show();
                break;
            case 'register':
                // if the register form is already setup, we don't need to do it again and we can show it already
                if (!firstRegisterLoad) {
                    $('#classroom-register-container').show();
                }
                break;
            default:
                $('#home-container').show();
                break;
        }
    } else if ($_GET('link')) {
        // We trigger this one only if it's not the first request (the first request is handled by the Main.init())
        if (firstRequestClass === false) {
            findClassroomToConnect($_GET('link'));
        }
    } else {
        $('#home-container').show();
    }
}
// call onUrlChange one time a the initialization of the page for set the views correctly
onUrlChange();

// the function who manage the history without refreshing the page 
function navigateLight(page, i = 0) {
    let link;
    switch (i) {
        case 0:
            link = window.location.origin + window.location.pathname + "?p=" + page;
            break;
        case 1:
            link = window.location.origin + window.location.pathname + page;
            break;
        case 2:
            link = window.location.origin + window.location.pathname+ "?link=" + page;
            break;
        default:
            break;
    }

    window.history.pushState({}, '', link);
    onUrlChange();
}

function closeAllViews() {
    // Close all views
    AllViews.forEach(e => {
        $(e).hide();
    });
}

window.onpopstate = function (e) {
    onUrlChange();
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function displayNotification(div, message, status, options = '{}') {
    let randId = getRandomInt(10000)
    let html = `<div id='notif-` + randId + `' class="vitta-notif status-` + status + `" data-i18n="` + message + `" data-i18n-options=` + options + `><div class="vitta-notif-exit-btn"><i class="fa fa-times-circle"></i></div></div>`
    $(div).append(html)
    $(div).localize()
    setTimeout(function () {
        $('#notif-' + randId).remove()
    }, 15000);
}

function findClassroomToConnect(linkC) {

    $('#class-connexion').attr("disabled", true);
    $('#create-user').show();

    Main.getClassroomManager().getClassroom(linkC).then((response) => {
        closeAllViews();

        $('#classroom-login-container-bis').show();
        //$('#classroom-create-account .green-form').show();
        $('#blocked-class').remove();
        $('#class-connexion').attr("disabled", false);
        
        if (response.exist) {
            $('#classroom-login-account, #classroom-create-account').show();
            $('#classroom-desc').html(response.link.toUpperCase() + ' - CLASSE \"' + response.name + '\"');
            if (response.isBlocked == true) {
                let blockedClassDivElt = document.createElement("div");
                blockedClassDivElt.id = "blocked-class";
                blockedClassDivElt.innerHTML =
                    "Cette classe a été bloquée par l'enseignant.e qui l'a crée, tu ne peux donc pas créer de nouveau compte.<br>Si tu as déja un compte, essaye plutot de te connecter.";
    
                $('#classroom-create-account').hide();
                document.getElementById('classroom-desc').append(blockedClassDivElt);
    
                $('#classroom-create-account .green-form').hide();
                $('#create-user').hide();
            }
        } else {
            if (response.hasOwnProperty('errorLinkNotExists')) {
                $('#classroom-desc').html('Vous devez saisir un code.');
                $('#classroom-login-account, #classroom-create-account').hide();
            } else {
                $('#classroom-desc').html('Le code entré ne correspond à aucune classe.');
                $('#classroom-login-account, #classroom-create-account').hide();
            }
        }
    })
}


$('body').on('click', '.vitta-notif-exit-btn', function () {
    $(this).parent().remove()
})

/**
 * Event listener when clicking the Create account link
 */
if (document.getElementById('register-link')) {
    document.getElementById('register-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateLight("register")
    });
}

$('#login-vittascience').click(function () {
    navigateLight("login-container")
})

$('#home-connexion').click(function () {
    navigateLight("login-choice")
    document.documentElement.style = "scroll-behavior: auto";
    document.documentElement.scrollTo({
        top: 0,
        behavior: 'auto'
    });
})

$('.navbar-brand').click(function () {
    window.location.href = window.location.origin + window.location.pathname
})

$('#class-connexion').click(function () {
    if ($('#class-code').val().length == 5) {
        firstRequestClass = false;
        navigateLight($('#class-code').val(), 2);
    } else {
        displayNotification('#notif-div', "classroom.notif.invalidLink", "error");
    }
})

if ($_GET('panel') == "login") {
    $('#home-container').toggle();
    $('#classroom-login-container').toggle();
}
if ($_GET('warn') == 'notester') {
    let html = `<div class="alert alert-warning"> ` + i18next.t('login_popup.errorBeta') + `</div>`
    $('#interactive-elements-container').append(html)
}

if ($_GET('afterconfirm')) {
    $('#info-div').append(`<div id='info-box' class='alert alert-success'>` + i18next.t('login-page.successConfirm') + "</div>")
}
if ($_GET('mailchanged')) {
    $('#info-div').append(`<div id='info-box' class='alert alert-success'>` + i18next.t('login-page.successMail') + "</div>")
}
if ($_GET('denied')) {
    $('#info-div').append(`<div id='info-box' class='alert alert-warning'>` + i18next.t('login-page.notConnect') + "</div>")
}

function loginFaq() {
    let html = ''
    let index = [8, 8, 4]
    for (let i = 1; i < 4; i++) {
        html += "<h3 data-i18n='[html]faqInfo." + i + ".section_title'></h3>";
        for (let j = 1; j < index[i - 1]; j++) {
            html += `<div class="kit-faq-box">
            <div class="faq-box-header" style="transform: rotate(0deg); transform-origin: 50% 50% 0px;">
                <div class="faq-box-dropdown">
                    <span class="fa fa-chevron-right" style="line-height:40px; font-size:16px;"></span>
                </div>
                <p style="font-size:16px; margin:0; padding:0;">
                    <b data-i18n='[html]faqInfo.` + i + `.question_list.` + j + `.title'></b>
                </p>
            </div>
            <div class="faq-box-content">
            <p data-i18n='[html]faqInfo.` + i + `.question_list.` + j + `.answer'></p>
            </div>
        </div>`

        }
    }
    $('#classroom-faq div h2').after(html)
    if ($("#classroom-faq").localize) {
        $("#classroom-faq").localize();
    }
}

function loginFaqNeutral() {
    let html = ''
    let index = [6, 7, 3]
    for (let i = 1; i < 4; i++) {
        html += "<h3 data-i18n='[html]faqInfoNeutral." + i + ".section_title'></h3>";
        for (let j = 1; j < index[i - 1]; j++) {
            html += `<div class="kit-faq-box">
            <div class="faq-box-header" style="transform: rotate(0deg); transform-origin: 50% 50% 0px;">
                <div class="faq-box-dropdown">
                    <span class="fa fa-chevron-right" style="line-height:40px; font-size:16px;"></span>
                </div>
                <p style="font-size:16px; margin:0; padding:0;">
                    <b data-i18n='[html]faqInfoNeutral.` + i + `.question_list.` + j + `.title'></b>
                </p>
            </div>
            <div class="faq-box-content">
            <p data-i18n='[html]faqInfoNeutral.` + i + `.question_list.` + j + `.answer'></p>
            </div>
        </div>`

        }
    }
    $('#classroom-faq div h2').after(html)
    if ($("#classroom-faq").localize) {
        $("#classroom-faq").localize();
    }
}

$('#create-user').click(function () {
    let pseudo = $('#new-user-pseudo-form').val()
    let link = $_GET('link')
    Main.getClassroomManager().createAccount(pseudo, link).then(function (result) {
        if (result != false) {
            if (!result.isUsersAdded) {
                switch (result.errorType) {
                    case 'pseudoIsMissing':
                        displayNotification('#notif-div', "classroom.notif.pseudoMissing", "error");
                        break;
                    case 'classroomBlocked':
                        displayNotification('#notif-div', "classroom.notif.cantLoginClassroomBlocked", "error");
                        break;
                    case 'reservedNickname':
                        displayNotification('#notif-div', `classroom.notif.${result.errorType}`, "error", `'{"reservedNickname": "${demoStudentName}"}'`);
                        break;
                    default:
                        displayNotification('#notif-div', "classroom.notif.cantLoginLimitLearners", "error");
                        break;
                }
            } else {
                window.open('/classroom/login.php', "_self");
            }
        } else {
            $('#warning-pseudo-used').toggle()
            setTimeout(function () {
                $('#warning-pseudo-used').toggle()
            }, 10000)
        }
    })
})

$(document).on('keydown', function (e) {
    if (e.keyCode === 13 && ($("#create-user").is(":focus") || $("#new-user-pseudo-form").is(":focus"))) {
        let pseudo = $('#new-user-pseudo-form').val()
        let link = $_GET('link')
        Main.getClassroomManager().createAccount(pseudo, link).then(function () {
            window.open('/classroom/login.php', "_self")
        })
    }
});

$('#connect-nongar-user').click(function () {
    let pseudo = $('#user-pseudo-form').val()
    let password = $('#user-password-form').val()
    let link = $_GET('link')
    Main.getClassroomManager().connectAccount(pseudo, password, link).then(function (response) {
        if (response == true) {
            window.open('/classroom/login.php', "_self")
        } else {
            $('.mismatched-login').show()
        }
    }).catch(error => {});
})


$(document).on('keydown', function (e) {
    if (e.keyCode === 13 && ($("#connect-nongar-user").is(":focus") || $("#user-password-form").is(":focus"))) {
        let pseudo = $('#user-pseudo-form').val()
        let password = $('#user-password-form').val()
        let link = $_GET('link')
        Main.getClassroomManager().connectAccount(pseudo, password, link).then(function (response) {
            if (response == true) {
                window.open('/classroom/login.php', "_self")
            } else {
                $('.mismatched-login').show()
            }
        }).catch(error => {});
    }
});


/**
 * Password display toggler : if an element that has the class password-display-toggler is clicked, it show/hide the password in the adjacent input element
 */
document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
    if (e.target.classList.contains('password-display-toggler')) {
        e.stopPropagation();
        for (let childElt of e.target.parentNode.childNodes) {
            if (childElt.tagName == 'INPUT') {
                if (childElt.getAttribute('type') == 'password') {
                    childElt.setAttribute('type', 'text');
                } else {
                    childElt.setAttribute('type', 'password');
                }
            }
        }
    }
});

/**
 * Create teacher form submit listener
 */
if (document.getElementById('create-teacher-account-form')) {
    document.getElementById('create-teacher-account-form').addEventListener('submit', (e) => {
        e.preventDefault();
        let data = new FormData(e.target);
        if (teacherAccountCreateFormCheck(data)) {
            createTeacherAccount(data).then((response) => {
                if (response.isUserAdded) {
                    document.getElementById('profile-form-password').value = '';
                    document.getElementById('profile-form-confirm-password').value = '';
                    displayNotification('#notif-div', "classroom.notif.accountCreated", "success");
                    returnToConnectionPanel('#login-container');
                } else {
                    if (response.errorType) {
                        switch (response.errorType) {
                            case 'unknownUser':
                                displayNotification('#notif-div', "classroom.notif.unknownUser", "error");
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
}


function createTeacherAccount(formData) {
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
                'bio': $('#profile-form-bio').length ? $('#profile-form-bio').val() : null,
                'pseudo': $('#profile-form-pseudo').length ? $('#profile-form-pseudo').val() : null,
                'phone': $('#profile-form-phone').length ? $('#profile-form-phone').val() : null,
                'school': $('#profile-form-grade').length ? $('#profile-form-school').val() : null,
                'grade': $('#profile-form-grade').length ? $('#profile-form-grade').val() + 1 : null,
                'subject': $('#profile-form-subject').length ? $('#profile-form-subject').val() + 1 : null,
                'newsletter': $('#cb_newsletter').is(':checked'),
                'private': $('#cb_name_public').is(':checked'),
                'mailmessage': $('#cb_alert_mail').is(':checked'),
                'contact': $('#cb_allow_contact').is(':checked'),
                'gcode': ''
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
 * Check if the teacher's account update form values are correct
 * @returns {boolean} - true if check ok, false otherwise
 */
function teacherAccountCreateFormCheck(formData) {

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

function createRegistrationTemplateForLogin() {
    getRegistrationTemplate().then((res) => {

        if (res.USER_USERNAME == "false") {
            $('#registration_pseudo').remove();
        }
        
        if (res.USER_PHONE == "false") {
            $('#registration_phone').remove();
        }
        
        if (res.USER_BIO == "false") {
            $('#registration_bio').remove();
        }

        if (res.USER_TEACHER_GRADE == "false") {
            $('#registration_grade').remove();
        }
        
        if (res.USER_TEACHER_SUBJECT == "false") {
            $('#registration_subject').remove();
        }

        if (res.USER_TEACHER_SCHOOL == "false") {
            $('#registration_school').remove();
        }
        
        if ($_GET('p') == "register") {
            $('#classroom-register-container').show();
        }
    
    })
}

