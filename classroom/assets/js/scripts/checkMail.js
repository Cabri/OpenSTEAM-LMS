const MIN_MESSAGE_SIZE = 1;
const MAX_MESSAGE_SIZE = 800;
const MIN_SUBJECT_SIZE = 1;
const MAX_SUBJECT_SIZE = 80;

var mailInput = UserManager.getUser().isRegular;
var messageInput = document.getElementById("contact-message-input");
var subjectInput = document.getElementById("contact-subject-input");

var btn = document.getElementById("contact-submit-btn");

function checkText (input,min,max){
    var value = input.value.trim();
    if (value.length === 0){
        input.className = "form-control";
    }
    else {
        if (value.length >= min && value.length <= max){
            input.className = "form-control is-valid";
        }
        else {
            input.className = "form-control is-invalid";
        }
    }
}

function enableButton(btn, title = false) {
    btn.removeAttribute("disabled");
    btn.style.cursor = "pointer";
    if (title != false) {
        btn.setAttribute('title', "")
    }
}

function disableButton(btn, title = false) {
    btn.setAttribute("disabled", "disabled");
    btn.style.cursor = "not-allowed";
    if (title != false) {
        btn.setAttribute('title', title)
    }
}

messageInput.onkeyup = function () {
    checkText(this, MIN_MESSAGE_SIZE, MAX_MESSAGE_SIZE);
    checkContactForm();
};

subjectInput.onkeyup = function () {
    checkText(this, MIN_SUBJECT_SIZE, MAX_SUBJECT_SIZE);
    checkContactForm();
};

function getAjaxRequest() {
    var request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return request;
}

function checkContactForm() {
    if ($(messageInput).hasClass("is-valid") &&
        $(subjectInput).hasClass("is-valid")) {
        enableButton(btn, true);
    } else {
        disableButton(btn, "Complétez tous les champs");
    }
}

function sendMailForm(number, username, forma, info) {
    /*     $('#za78e-username-contact').val($('#homepage').val()) */

    let honeyNumber = $('#' + number).val();
    let honeyUsername = $('#' + username).val();
    /*     if (honeyNumber.length > 0 || honeyUsername.length != 13) {
            throw "Lorem Ipsum";
        } */
    $('#contact-submit-btn').attr('disabled', 'disabled')
    $('#contact-submit-btn').toggleClass('disabled')
    var form = document.getElementById(forma);
    var info = document.getElementById(info);
    info.style.display = "none";
    info.innerHTML = "";
    var formData = new FormData(form);
    if (UserManager.getUser().isRegular) {
        formData.append('name', UserManager.getUser().firstname + " " + UserManager.getUser().surname + " id = " + UserManager.getUser().id)
    } else {
        formData.append('name', UserManager.getUser().pseudo)
    }
    if (forma == 'about-contact-form-student') {

        formData.append('idMail', $('#help-student-select').val())
    }
    var request = getAjaxRequest();

    request.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);
                if (response.success === true) {
                    info.className = "alert alert-success";
                    info.innerHTML = i18next.t('about.contact.success');
                    $(form).fadeOut("slow", function () {
                        $(info).fadeIn("slow");
                    });
                    return;
                } else {
                    info.className = "alert alert-danger";
                    var errors = document.createElement("ul");
                    for (var i = 0; i < response.errors.length; i++) {
                        var error = document.createElement("li");
                        error.innerHTML = "<span " + response.errors[i] + "></span>";
                        errors.appendChild(error);
                    }
                    info.appendChild(errors);
                    $(".alert-danger").localize();
                    $(info).fadeIn("slow");
                }
            } else {
                console.log("Request failed: " + this.status);
            }
            $('#contact-submit-btn').attr('disabled', 'false')
            $('#contact-submit-btn').toggleClass('disabled')
        }
    };
    if (forma == 'about-contact-form') {
        request.open("POST", "/services/post/postTeacherHelp.php");
    } else {
        request.open("POST", "/services/post/postStudentToTeacher.php");
    }
    request.send(formData);
}