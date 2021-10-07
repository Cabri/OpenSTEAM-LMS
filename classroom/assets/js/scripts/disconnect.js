'use strict';

function goToDisconnect() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=user&action=disconnect",
            success: function (response) {
                resolve(JSON.parse(response))
            },
            error: function () {
                reject();
            }
        });
    }).then(()=>{
        if (UserManager.getUser().isFromGar){
            window.location = 'https://simulent.partenaire.test-gar.education.fr/mediacentre';
        } else {
            // TODO updated by CABRI
            window.location = '/classroom/login.php';
        }
    }).catch((e)=>{
        console.log(e);
    });
}
