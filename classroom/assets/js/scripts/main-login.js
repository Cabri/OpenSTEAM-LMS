'use strict';
/**
 * login a user
 * @param {FormData}  
 * @return {Classroom} 
 */
function loginUser(payload) {
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

function checkLogin() {
    var button = document.getElementById("login-button");
    if ($('#za78e-username').val() == '') {
        $('#za78e-username').val($('#homepage').val())
    }
    let honeyNumber = $('#za78e-number').val();
    let honeyUsername = $('#za78e-username').val();

    button.setAttribute("disabled", "disabled");
    button.style.cursor = "not-allowed";

    var formData = new FormData(document.getElementById("login-form"));
    formData.append("za78e-username", honeyUsername)
    let form = {
        'mail': $('#login-mail-input').val(),
        'password': $('#login-pwd-input').val(),
        'za78e-username': honeyUsername,
    }
    loginUser(form).then(function (response) {
        if (response.success === true) {
            var infoBox = document.getElementById("info-box");
            if (infoBox === undefined || infoBox === null) {
                infoBox = document.createElement("div");
                infoBox.className = "alert alert-success";
                infoBox.innerHTML = i18next.t('login_popup.success');
                document.getElementById("info-div").innerHTML = "";
                document.getElementById("info-div").style.display = "none";
                document.getElementById("info-div").appendChild(infoBox);
                $("#info-div").fadeIn("slow");
            } else {
                document.getElementById("info-div").style.display = "none";
                infoBox.className = "alert alert-success";
                infoBox.innerHTML = i18next.t('login_popup.success');
                $("#info-div").fadeIn("slow");
            }
            setTimeout(function () {
                var redirect = $_GET("redirect");
                if (redirect == null) {
                    if (/classroom/.test(window.location.pathname)) {
                        document.location = "/classroom/home.php?link=aaaaa";
                    }
                } else {
                    document.location = decodeURIComponent(redirect);
                }
            });
        } else {
            button.removeAttribute("disabled");
            button.style.cursor = "pointer";
            infoBox = document.createElement("div");
            infoBox.className = "alert alert-danger";
            console.log(response)
            if(response.success == false && response.error == 'badInput'){
                infoBox.innerHTML = i18next.t('login_popup.error');
            }
            if(response.success == false) {
                infoBox.innerHTML = i18next.t('login_popup.error');
            }
            else {
                infoBox.innerHTML = i18next.t('login_popup.errorBeta');
            }
            document.getElementById("info-div").innerHTML = "";
            document.getElementById("info-div").style.display = "none";
            document.getElementById("info-div").appendChild(infoBox);
            $("#info-div").fadeIn("slow");
            setTimeout(() => {
                $("#info-div").fadeOut("slow");
            }, 5000);
        }
    })
}